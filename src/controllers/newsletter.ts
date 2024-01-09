import { User } from "entity/User";
import { RouteHandlerMethod } from "fastify";
import { MultipartFile, MultipartValue } from "@fastify/multipart";
import { randomUUID } from "crypto";
import * as fs from "fs";
import { Newsletter } from "@entity/Newsletter";

type CreateNewsletter = {
  year: MultipartValue<string>;
  month: MultipartValue<string>;
  content_resume: MultipartValue<string>;
  content_birthday: MultipartValue<string>;
  content_movement: MultipartValue<string>;
  content_event: MultipartValue<string>;
  content_msg: MultipartValue<string>;
  nursery_id: MultipartValue<string>;
  images: MultipartFile[];
}

export const addNewsletterAdmin: RouteHandlerMethod = async (request, reply) => {

  const { year, month, content_resume, content_birthday, content_movement, content_event, content_msg, nursery_id, images } = request.body as CreateNewsletter;

  let paths = [];

  if (images) {
    for (let image of Array.isArray(images) ? images : [images]) {
      const buffer = await image.toBuffer();

      const path = `uploads/images/newsletter/${randomUUID() + "_" + image.filename}`;

      fs.appendFileSync(`storage/${path}`, buffer);

      paths.push("assets/" + path);
    }
  }

  const newsletterRepository = request.server.db.getRepository(Newsletter);

  const newData = newsletterRepository.create({
    year: year.value,
    month: month.value,
    content_resume: content_resume.value,
    content_birthday: content_birthday.value,
    content_movement: content_movement.value,
    content_event: content_event.value,
    content_msg: content_msg.value,
    nursery_id: parseInt(nursery_id.value),
    images: paths
  });

  const { id } = await newsletterRepository.save(newData);
  return reply.send({id});
};

type UpdateNewsletterData = {
    id: number;
    year: string;
    month: string;
    content_resume: string;
    content_birthday: string;
    content_movement: string;
    content_event: string;
    content_msg: string;
    nursery_id: number;
}

export const updateNewsletter: RouteHandlerMethod = async (request, reply) => {
    const { id, year, month, content_resume, content_birthday, content_movement, content_event, content_msg, nursery_id } = request.body as UpdateNewsletterData;
    const repository = request.server.db.getRepository(Newsletter);
    const newData = repository.save({
        id: id,
        year: year,
        month: month,
        content_resume: content_resume,
        content_birthday: content_birthday,
        content_movement: content_movement,
        content_event: content_event,
        content_msg: content_msg,
        nursery_id: nursery_id,
      });
      
      return reply.send(newData);
};

export const getNewsletters: RouteHandlerMethod = async (request, reply) => {
    const repository = request.server.db.getRepository(Newsletter);
    const userId = request.user.id;
    const currentUser = await request.server.db.manager.findOne(User, {
      where: {id: userId}
    });
    const newsletters = await repository.find({
      where: {nursery_id: currentUser?.nurseryId}
    });
    console.log(newsletters);
    return newsletters;
};

export const deleteNewsletter: RouteHandlerMethod = async (request, reply) => {

    const { id } = <{ id: number; }>request.body;
    const userId = request.user.id;
    const userRepository = request.server.db.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      reply.unauthorized("unauthorized");
      return;
    }
  
    const repository = request.server.db.getRepository(Newsletter);
    
    const updated = await repository.delete(id);
    reply.send(updated);
};


