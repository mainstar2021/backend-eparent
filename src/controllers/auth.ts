import { RouteHandlerMethod } from "fastify";
import { User } from "@entity/User";
import { Nurseryaccount } from "@entity/Nurseryaccount";

type Credentials = {
  email: string;
  password: string;
};

export const login: RouteHandlerMethod = async (request, reply) => {
  const { email, password } = <Credentials>request.body;

  const user = await request.server.db.manager.findOne(User, {
    where: { email },
  });
  if (!user) {
    reply.badRequest("This email is not registered.");
    return;
  }

  if (!(await request.server.bcrypt.compare(password, user?.password))) {
    reply.badRequest("Wrong password");
    return;
  }

  if(user) {

    const nursery = await request.server.db.manager.findOne(Nurseryaccount, {
      where: {id: user.nurseryId}
    })
    if (nursery && nursery.disable) {
      reply.badRequest("Your nursery has been disabled.");
      return;
    }
  }



  const token = await reply.jwtSign({ id: user.id });

  return { token, email, name: user.name, role: user.role };
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
  }
}
