import { User } from "entity/User";
import { RouteHandlerMethod } from "fastify";
import { Attendance } from "@entity/Attendance";
import { In } from "typeorm";

type CreateAttendanceData = {
    child_id: number;
    type: number;
    time: string;
    reason: number;
    comment: string;
    start_date: string;
    end_date: string;
}

export const addAttendance: RouteHandlerMethod = async (request, reply) => {

  const { child_id, type, time, reason, comment, start_date, end_date } = request.body as CreateAttendanceData;

  const attendanceRepository = request.server.db.getRepository(Attendance);

  const newData = attendanceRepository.create({
    childId: child_id,
    type: type,
    time: time,
    reason: reason,
    comment: comment,
    start_date: start_date,
    end_date: end_date,
    status: 1
  });

  return await attendanceRepository.save(newData);
};

export const getAttendances: RouteHandlerMethod = async (request, reply) => {
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
        const res = await manager.find(Attendance, {
            where: { child: { id: In(children) } },
            relations: { child: { classroom: true} }
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
        const res = await manager.find(Attendance, {
            where: { child: { id: In(children) } },
            relations: { child: { classroom: true} }
        });
        return res;

    } else {
        for (let i = 0; i < currentUser.children.length; i++) {
            children.push(currentUser.children[i].id);
        }
        const res = await manager.find(Attendance, {
            where: { child: { id: In(children) } },
            relations: { child: { classroom: true} }
          });
        return res;
    }
   
};


//Update
type UpdateAttendanceData = {
    id: number,
    child_id: number;
    type: number;
    time: string;
    reason: number;
    comment: string;
    start_date: string;
    end_date: string;
    status: number;
}

export const updateAttendance: RouteHandlerMethod = async (request, reply) => {
    const { id, child_id, time, reason, comment, status, start_date, end_date, type } = request.body as UpdateAttendanceData;

    console.log(request.body)
    const repository = request.server.db.getRepository(Attendance);

    const updateData = repository.save({
        id: id,
        childId: child_id,
        time: time,
        reason: reason,
        comment: comment,
        status: status,
        start_date: start_date,
        end_date: end_date,
        type: type
      });
      
      return reply.send(updateData);
};



export const deleteAttendance: RouteHandlerMethod = async (request, reply) => {

    const { id } = <{ id: number; }>request.body;
    const userId = request.user.id;
    const userRepository = request.server.db.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      reply.unauthorized("unauthorized");
      return;
    }
  
    const repository = request.server.db.getRepository(Attendance);
    
    const updated = await repository.delete(id);
    reply.send(updated);
};


