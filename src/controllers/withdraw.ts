import { RouteHandlerMethod } from "fastify";
import { User } from "@entity/User";
import { Nurseryaccount } from "@entity/Nurseryaccount";
import { Withdraw } from "@entity/Withdraw";

type WithdrawData = {
    amount: number,
    account_name: string,
    routing_number: string,
    account_number: string,
    comment: string
}

export const addWithdraw: RouteHandlerMethod = async (request, reply) => {

    const { amount, account_name, account_number, comment, routing_number } =request.body as WithdrawData;

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

    const repository = request.server.db.getRepository(Withdraw);

    const newData = repository.create({
        nurseryaccount: { id: currentUser.nurseryId },
        amount: amount,
        currency: 'USD',
        account_name: account_name,
        routing_number: routing_number,
        account_number: account_number,
        comment: comment

    });
    
    return await repository.save(newData);  
}

export const getWithdraws: RouteHandlerMethod = async (request, reply) => {

    const userRepo = request.server.db.getRepository(User);
    const repo = request.server.db.getRepository(Nurseryaccount);
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
        const res = await repo.findOne({
            where: { id: currentUser.nurseryId },
            relations: { withdraws: true }
        });

        if(res)

        return res.withdraws;

    } else {
        return;
    }
}

export const getAdminWithdraws: RouteHandlerMethod = async (request, reply) => {

    const repository = request.server.db.getRepository(Withdraw);
    const bills = await repository.find({ relations: { nurseryaccount: true } });
    
    return bills;
  };


type UpdateWithdrawData = {
    id: number;
    comment: string;
    status: number;
}

export const updateAdminWithdraw: RouteHandlerMethod = async (request, reply) => {

    const { id, comment, status } = request.body as UpdateWithdrawData;

    const repository = request.server.db.getRepository(Withdraw);
    const bill = await repository.findOne({ where: { id: id }});

    if (bill) {
        bill.comment = comment;
        bill.status =  status;
        return await repository.save(bill);
    } else {
        reply.unauthorized();
    }
  };

