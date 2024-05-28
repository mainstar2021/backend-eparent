import { RouteHandlerMethod } from "fastify";
import { User } from "entity/User";
import { DevCategory } from "@entity/DevCategory";
import { DevMatter } from "@entity/DevMatter";
import { DevCheckpoint } from "@entity/DevCheckpoint";
import { Event } from "@entity/Events";

import { MultipartValue } from "@fastify/multipart";

export const getDevCategory: RouteHandlerMethod = async (request, reply) => {

  const id = request.user.id;
  
  const user = await request.server.db.manager.findOne(User, {
    where: { id },
    relations: { children: true },
  });
    
  if (!user) {
    reply.unauthorized("Unauthorized");
    return;
  }

  const repo = await request.server.db.getRepository(DevCategory);
  const devCategories = await repo.find();
  
  return devCategories;
};

export const getDevMatter: RouteHandlerMethod = async (request, reply) => {

  const { checkpointId } = request.query as { checkpointId: number };

  const id = request.user.id;
  
  const user = await request.server.db.manager.findOne(User, {
    where: { id },
    relations: { children: true },
  });
    
  if (!user) {
    reply.unauthorized("Unauthorized");
    return;
  }

  const repo = await request.server.db.getRepository(DevMatter);
  const devMatters = await repo.find({
    where: { devCheckpoint: { id: checkpointId } },
    relations: { devCheckpoint: true },
    order: {
      devCheckpoint: {
          categoryId: "ASC",
          ageId: "asc",
      }
  }
  });
  
  return devMatters;
};

interface CreateIndicatorData {
  childId: MultipartValue<number>;
  infos: MultipartValue<string>;
  indicators: MultipartValue<string>;
  checkpointId: MultipartValue<number>;
}

export const saveIndicator: RouteHandlerMethod = async (request, reply) => {
  const { childId, infos, indicators, checkpointId } = request.body as CreateIndicatorData;

  const repository = request.server.db.getRepository(Event);

  const newEvent = repository.create({
    child: { id: childId.value },
    eventType: { id: 7 },
    infos: JSON.parse(infos.value),
    indicators: JSON.parse(indicators.value),
    poster: { id: request.user.id },
    devCheckpoint: { id: checkpointId.value}
  });

  const { id } = await repository.save(newEvent);

  return await repository.findOne({
    where: { id },
    relations: { poster: true, eventType: true, child: true },
  });
};

/* Checkpoints */

export const getCheckpoints: RouteHandlerMethod = async (request, reply) => {
  const { ageId, categoryId } = request.query as { ageId: number, categoryId: number };
  const manager = request.server.db.manager;

  return await manager.find(DevCheckpoint, {
    where: { ageId: ageId, categoryId: categoryId, isDeleted: 0 },
    order: {month: "asc"},
  });
}

// Add
type CreateCheckpointData = {
  categoryId: number;
  ageId: number;
  month: number;
}

export const addCheckpoints: RouteHandlerMethod = async (request, reply) => {

const { categoryId, ageId, month } = request.body as CreateCheckpointData;

const attendanceRepository = request.server.db.getRepository(DevCheckpoint);

const newData = attendanceRepository.create({
  categoryId: categoryId,
  ageId: ageId,
  month: month
});

return await attendanceRepository.save(newData);
};

// Update
type UpdateCheckpointData = {
  id: number,
  month: number;
}

export const updateCheckpoints: RouteHandlerMethod = async (request, reply) => {
  const { id, month } = request.body as UpdateCheckpointData;

  console.log(request.body)
  const repository = request.server.db.getRepository(DevCheckpoint);

  const updateData = repository.save({
      id: id,
      month: month,
    });
    
    return reply.send(updateData);
};

// Delete
export const deleteCheckpoints: RouteHandlerMethod = async (request, reply) => {

  const { id } = <{ id: number; }>request.body;
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  const repository = request.server.db.getRepository(DevCheckpoint);
  
  const updateData = repository.save({
    id: id,
    isDeleted: 1,
  });
  reply.send(updateData);
};


/* Development Matters */

// Add
type CreateDevMatterData = {
  checkpointId: number;
  description: string;
  instruction: string;
}

export const addDevMatter: RouteHandlerMethod = async (request, reply) => {

const { checkpointId, description, instruction } = request.body as CreateDevMatterData;

const attendanceRepository = request.server.db.getRepository(DevMatter);

const newData = attendanceRepository.create({
  devCheckpoint: { id: checkpointId },
  description: description,
  instruction: instruction
});

return await attendanceRepository.save(newData);
};

// Update
type UpdateDevMatterData = {
  id: number,
  description: string;
  instruction: string;
}

export const updateDevMatter: RouteHandlerMethod = async (request, reply) => {
  const { id, description, instruction } = request.body as UpdateDevMatterData;

  console.log(request.body)
  const repository = request.server.db.getRepository(DevMatter);

  const updateData = repository.save({
      id: id,
      description: description,
      instruction: instruction,
    });
    
    return reply.send(updateData);
};


// Delete
export const deleteDevMatter: RouteHandlerMethod = async (request, reply) => {

  const { id } = <{ id: number; }>request.body;
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  const repository = request.server.db.getRepository(DevMatter);
  
  const updated = await repository.delete(id);
  reply.send(updated);
};