import Fastify from 'fastify';
import userRoutes from './modules/user/user.routes';
import { userSchemas } from './modules/user/user.schema';
import jwt from '@fastify/jwt';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

export const server = Fastify();

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

server.register(jwt, {
  secret: 'secret',
});

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: '/api/users' });
  try {
    await server.listen({ port: 3000 });
    console.log(`server listening on http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main();
