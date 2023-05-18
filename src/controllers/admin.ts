import { RouteHandlerMethod } from "fastify";
import { Admin } from "@entity/Admin";

type Credentials = {
  email: string;
  password: string;
};

export const login: RouteHandlerMethod = async (request, reply) => {
  const { email, password } = <Credentials>request.body;

  const user = await request.server.db.manager.findOne(Admin, {
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
  const serviceToken = await request.server.jwt.sign({ id: user.id });
  console.log(serviceToken)

  return {
    serviceToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
  // return {serviceToken, name: user.name};


};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
  }
}

