import { RouteHandlerMethod } from "fastify";
import MyDocument from "./pdf";
import * as React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { randomUUID } from "crypto";
import { Report } from "@entity/Report";
import { User } from "@entity/User";
import { In } from "typeorm";
import * as fs from "fs";

export const addReport: RouteHandlerMethod = async (request, reply) => {

    const { id } = request.body as { id: number };

    console.log(id)

    const repository = request.server.db.getRepository(Report);

    // fs.writeFileSync('storage/uploads/images/gallery/test.pdf', blob);

    const path = `uploads/pdf/reports/${randomUUID()}.pdf`;
    await ReactPDF.renderToFile(<MyDocument />, `storage/${path}`);

    const newData = repository.create({
        child: { id: id },
        path: "assets/" + path,
    });
    
    return await repository.save(newData);

    // console.log(stream);
    // ReactPDF.render(<MyDocument />, `example.pdf`);
   
}

export const getReports: RouteHandlerMethod = async (request, reply) => {

    const { children = [] } = request.query as { children: number[] };
    const manager = request.server.db.manager;
    const userRepo = request.server.db.getRepository(User);
    const userId = request.user.id;
    const currentUser = await userRepo.findOne({
      where: {id: userId},
      relations: { children: true }
    });

    if (!currentUser) {
        reply.unauthorized("Unauthorized");
        return;
    }

    if(currentUser.role === "Admin") {
        const parents = await userRepo.find({
            where: { nurseryId: currentUser.nurseryId },
            relations: { children: true }
        });

        for (let i = 0; i < parents.length; i++) {
            for (let j = 0; j < parents[i].children.length; j++) {
                children.push(parents[i].children[j].id);
            }
        }
        const res = await manager.find(Report, {
            where: { child: { id: In(children) } },
            relations: { child: true }
        });
        return res;

    } else if (currentUser.role === "Nursery") {
        const parents = await userRepo.find({
            where: { nurseryId: currentUser.nurseryId },
            relations: { children: true }
        });

        for (let i = 0; i < parents.length; i++) {
            for (let j = 0; j < parents[i].children.length; j++) {
                if(parents[i].children[j].classroomId == currentUser.classroomId){
                    children.push(parents[i].children[j].id);
                }
            }
        }
        const res = await manager.find(Report, {
            where: { child: { id: In(children) } },
            relations: { child: true }
        });
        return res;

    } else {
        for (let i = 0; i < currentUser.children.length; i++) {
            children.push(currentUser.children[i].id);
        }
        const res = await manager.find(Report, {
            where: { child: { id: In(children) } },
            relations: { child: true }
          });
        return res;
    }
}

export const downloadPDF: RouteHandlerMethod = async (request, reply) => {
    
    const { id } = request.query as { id: number };

    const reportRepo = request.server.db.getRepository(Report);

    const currentData = await reportRepo.findOne({
        where: {id: id}
      });

    if(currentData?.path) {const stream = fs.readFileSync(currentData.path); return Buffer.from(stream).toString('base64')}
    
      
  
}