import { RouteHandlerMethod } from "fastify";
// import MyDocument from "./pdf";
// import * as React from 'react';
// import ReactPDF from '@react-pdf/renderer';
import { randomUUID } from "crypto";
import { Report } from "@entity/Report";
import { User } from "@entity/User";
import { In } from "typeorm";
import * as fs from "fs";
import { MultipartValue, MultipartFile } from "@fastify/multipart";

export const addReport: RouteHandlerMethod = async (request, reply) => {

    const { id, blob_file } = request.body as { id: MultipartValue<string>, blob_file: MultipartFile };

    const buffer = await blob_file.toBuffer();

    const path = `uploads/pdf/reports/${randomUUID()}.pdf`;

    fs.appendFileSync(`storage/${path}`, buffer);

    const repository = request.server.db.getRepository(Report);

    const newData = repository.create({
        child: { id: parseInt(id.value) },
        path: "storage/" + path,
    });
    
    return await repository.save(newData);  
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