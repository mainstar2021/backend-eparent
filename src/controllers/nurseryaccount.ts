import { RouteHandlerMethod } from "fastify";
import { Nurseryaccount } from "@entity/Nurseryaccount";

export const index: RouteHandlerMethod = async (request, reply) => {
  const repository = request.server.db.getRepository(Nurseryaccount);
  const nurserys = await repository.query("select * from nurseryaccount");
  console.log(nurserys)
  return nurserys;
}

type AddNurseryData = {
  name: string;
  tax: string;
  phone: string;
}

export const create: RouteHandlerMethod = async (request, reply) => {
  const { name, tax, phone } = request.body as AddNurseryData;
  console.log(name);

  const repository = request.server.db.getRepository(Nurseryaccount);

  const newNursery = repository.create({
    name: name,
    tax: tax,
    phone: phone,
  });
  
  return await repository.save(newNursery);
};

type DisableNurseryData = {
  nurseryId: number;
  flag: boolean;
}

export const disable: RouteHandlerMethod = async (request, reply) => {
  const { nurseryId, flag } =request.body as DisableNurseryData;
  const repository = request.server.db.getRepository(Nurseryaccount);

  const nursery = await repository.findOne({ where: { id: nurseryId }});
  if (nursery) {
    if(flag) {
      nursery.disable = false;

    } else {
      nursery.disable = true;
    }
    return await repository.save(nursery);
  } else {
    reply.unauthorized();
  }
  
}

