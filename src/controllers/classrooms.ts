import { RouteHandlerMethod } from "fastify";
import { Classroom } from "@entity/Classroom";
import { User } from "@entity/User";

export const index: RouteHandlerMethod = async (request, reply) => {
  const repository = request.server.db.getRepository(Classroom);
  const userId = request.user.id;
  const currentUser = await request.server.db.manager.findOne(User, {
    where: {id: userId}
  });
  const classrooms = await repository.find({
    where: {nurseryId: currentUser?.nurseryId}
  });
  console.log(classrooms);
  return classrooms;
};

type AddClassroom = {
  name: string;
  description: string;
  range_from: string;
  range_to: string;
}

export const addClassroom: RouteHandlerMethod = async (request, reply) => {
  const { name, description, range_from, range_to } = request.body as AddClassroom;
  const userId = request.user.id;
  const currentUser = await request.server.db.manager.findOne(User, {
    where: {id: userId}
  });

  const repository = request.server.db.getRepository(Classroom);

  const newNursery = repository.create({
    name: name,
    description: description,
    range_from: range_from,
    range_to: range_to,
    nurseryId: currentUser?.nurseryId,
  });
  
  return await repository.save(newNursery);
};

type UpdateClassroom = {
  id: number;
  name: string;
  description: string;
  range_from: string;
  range_to: string;
}

export const updateClassroom: RouteHandlerMethod = async (request, reply) => {
  const { id, name, description, range_from, range_to } = request.body as UpdateClassroom;
  const userId = request.user.id;
  const currentUser = await request.server.db.manager.findOne(User, {
    where: {id: userId}
  });

  const repository = request.server.db.getRepository(Classroom);

  const newNursery = repository.save({
    id: id,
    name: name,
    description: description,
    range_from: range_from,
    range_to: range_to,
    nurseryId: currentUser?.nurseryId,
  });
  
  return reply.send(newNursery);
};


