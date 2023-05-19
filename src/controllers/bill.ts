import { RouteHandlerMethod } from "fastify";
import { Bill } from "@entity/Bill";
import { User } from "@entity/User";


// type AddInvoiceData = {
//   title: string;
//   content: string;
//   recieverId: string;
// }

type CreateBillData = {
  title: string;
  content: string;
  type: string;
  currency: string;
  amount: number;
  recieverId: string;
}

export const create: RouteHandlerMethod = async (request, reply) => {
  const { title, content, type, currency, amount, recieverId } = request.body as CreateBillData;
  const repository = request.server.db.getRepository(Bill);
  const newInvoice = repository.create({
    heading: title,
    type: type,
    ref: content,
    nurseryaccountId: parseInt(recieverId),
    currency: currency,
    amount: amount,
  });

  return await repository.save(newInvoice);
}

export const getAdminBills: RouteHandlerMethod = async (request, reply) => {

  const repository = request.server.db.getRepository(Bill);
  const bills = await repository.find({ relations: { nurseryaccount: true } });
  
  return bills;
};

// export const addBill: RouteHandlerMethod = async (request, reply) => {
//   const userId = request.user.id;
//   const { title, content, recieverId } = request.body as AddInvoiceData;

//   const repository = request.server.db.getRepository(Bill);
//   const newInvoice = repository.create({
//     title: title,
//     content: content,
//     senderId: userId,
//     recieverId: parseInt(recieverId),
//   });

//   return await repository.save(newInvoice);
// };

export const getBills: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await userRepository.findOne({where: {id: userId}});
  if ( !currentUser) {
    reply.unauthorized("You can't access to this data.");
    return;
  }
  const bills =  await request.server.db.manager.find(Bill, {
    where: { nurseryaccountId: currentUser.nurseryId },
    order: { date: "desc" },
  });
  const balance = bills.reduce((balance, transaction) => {
    return (
      balance +
      (transaction.type === "bill" ? transaction.amount : -transaction.amount)
    );
  }, 0);
  return {
    balance,
    recentTransactions: bills.slice(0, 3),
    currency: bills[0].currency,
  };

}

export const getTransactions: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await userRepository.findOne({where: {id: userId}});
  if ( !currentUser) {
    reply.unauthorized("You can't access to this data.");
    return;
  }
  const bills =  await request.server.db.manager.find(Bill, {
    where: { nurseryaccountId: currentUser.nurseryId },
  });
  return bills;

}


