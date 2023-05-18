import { RouteHandlerMethod } from "fastify";
import { User } from "@entity/User";
import { Setting } from "@entity/Setting";

type NotificationBody = {
  [prop: string]: {
    email: boolean;
    app: boolean;
    push: boolean;
  };
};

export const updateNotificationSetting: RouteHandlerMethod = async (request, reply) => {
  const data = <NotificationBody>request.body;
  const userId = request.user.id;

  const userRepository = await request.server.db.getRepository(User);

  const user = await userRepository.findOne({ where: { id: userId }, relations: { setting: true } });

  if (user) {
    if (user.setting) {
      user.setting = { ...user.setting, notification: data };
    } else {
      const setting = new Setting();
      setting.notification = data;

      const result = await request.server.db.manager.create(Setting, setting);

      user.setting = result;
    }

    const newUser = await userRepository.save(user);

    return newUser.setting;
  } else {
    reply.unauthorized();
  }
};

export const getSetting: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;

  const userRepository = await request.server.db.getRepository(User);

  const user = await userRepository.findOne({ where: { id: userId }, relations: { setting: true } });

  if (user) {
    return user.setting;
  } else {
    reply.unauthorized();
  }
};

export const updateSessionTimeout: RouteHandlerMethod = async (request, reply) => {
  const { sessionTimeout } = <{ sessionTimeout: string }>request.body;

  const userId = request.user.id;

  const userRepository = await request.server.db.getRepository(User);

  const user = await userRepository.findOne({ where: { id: userId }, relations: { setting: true } });

  if (user) {
    if (user.setting) {
      user.setting = { ...user.setting, session_timeout: sessionTimeout };
    } else {
      const setting = new Setting();
      setting.session_timeout = sessionTimeout;

      const result = await request.server.db.manager.create(Setting, setting);

      user.setting = result;
    }

    const newUser = await userRepository.save(user);

    return newUser.setting;
  } else {
    reply.unauthorized();
  }
};
