import { RouteHandlerMethod } from "fastify";
import { Event } from "@entity/Events";
import { EventType } from "@entity/EventType";
import { MultipartFile, MultipartValue } from "@fastify/multipart";
import { randomUUID } from "crypto";
import * as fs from "fs";
import { Comment } from "@entity/Comment";
import { In } from "typeorm";
import { User } from "@entity/User";

export const index: RouteHandlerMethod = async (request, reply) => {
  const { children = [] } = request.query as { children: number[] };

  const userId = request.user.id;

  const manager = request.server.db.manager;

  if (children.length) {
    const events = await manager.find(Event, {
      where: { child: { id: In(children) } },
      relations: { poster: true, child: true, eventType: true },
      order: { created_at: "desc" },
    });

    return events;
  } else {
    return await manager.find(Event, {
      where: { child: { parent: { id: userId } } },
      relations: { poster: true, child: true, eventType: true, comments: true },
      order: { created_at: "desc" },
    });
  }
};

export const getNurseryEvents: RouteHandlerMethod = async (request, reply) => {
  // const userId = request.user.id;
  const manager = request.server.db.manager;


  return await manager.find(Event, {
    relations: {poster: true, child: true, eventType: true, comments: true},
    order: {created_at: "desc"},
  });
}

interface CreateEventData {
  childId: MultipartValue<number>;
  infos: MultipartValue<string>;
  eventType: MultipartValue<number>;
  images: MultipartFile[];
}

export const create: RouteHandlerMethod = async (request, reply) => {
  const { childId, infos, eventType, images } = request.body as CreateEventData;

  const repository = request.server.db.getRepository(Event);

  let paths = [];
  if (images) {
    for (let image of Array.isArray(images) ? images : [images]) {
      const buffer = await image.toBuffer();

      const path = `uploads/images/gallery/${randomUUID() + "_" + image.filename}`;

      fs.appendFileSync(`storage/${path}`, buffer);

      paths.push("assets/" + path);
    }
  }

  const newEvent = repository.create({
    child: { id: childId.value },
    eventType: { id: eventType.value },
    infos: JSON.parse(infos.value),
    images: paths,
    poster: { id: request.user.id },
  });

  const { id } = await repository.save(newEvent);

  return await repository.findOne({
    where: { id },
    relations: { poster: true, eventType: true, child: true },
  });
};

export const typesIndex: RouteHandlerMethod = async (request, reply) => {
  const manager = request.server.db.manager;

  return await manager.find(EventType);
};

export const createType: RouteHandlerMethod = async (request, reply) => {
  const repository = request.server.db.getRepository(EventType);
  const typeData = request.body as Partial<EventType>;

  const newType = repository.create(typeData);

  return await repository.save(newType);
};

type NewComment = {
  content: string;
};

export const comment: RouteHandlerMethod = async (request, reply) => {
  const { eventId } = request.params as { eventId: number };
  const userId = request.user.id;
  const commentRepository = request.server.db.getRepository(Comment);
  const eventRepository = request.server.db.getRepository(Event);
  const { content } = request.body as NewComment;

  const event = await eventRepository.findOne({
    where: { id: eventId },
    relations: { child: { parent: true } },
  });

  const currentUser = await request.server.db.manager.findOne(User, {
    where: {id: userId}
  });

  if (!event) {
    reply.notFound("Event not found.");
    return;
  }

  if (event?.child.parent.id !== userId && currentUser && currentUser.role === "user") {
    reply.forbidden("You're not authorized for this action.");

    return;
  }

  const newComment = commentRepository.create({ event, content, poster: { id: userId } });

  return await commentRepository.save(newComment);
};

export const getComments: RouteHandlerMethod = async (request, reply) => {
  const { eventId } = request.params as { eventId: string };

  const eventsRepository = await request.server.db.getRepository(Event);

  try {
    const event = await eventsRepository.findOne({
      where: { id: parseInt(eventId) },
      relations: { comments: { poster: true } },
    });

    return event?.comments;
  } catch (error) {
    reply.internalServerError();
  }
};
