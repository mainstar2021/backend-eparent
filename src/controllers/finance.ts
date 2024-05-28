import Transaction from "@entity/Transaction";
import { User } from "@entity/User";
// import { Child } from "@entity/Child";
import { RouteHandlerMethod } from "fastify";
import * as mailer from "nodemailer";

export const transactions: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);

  const transactions = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.children", "children")
    .leftJoin("children.transactions", "transactions")
    .select(["transactions.id as id", "transactions.heading as heading", "transactions.type as type", "transactions.amount as amout", "transactions.currency as currency", "transactions.ref as ref", "transactions.isCredit as isCredit", "transactions.date as date", "transactions.childId as childID"])
    .where("user.id = :id", { id: userId })
    .orderBy("transactions.date", "DESC")
    .getRawMany();

  return transactions;
};

export const index: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);

  const transactions = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.children", "children")
    .leftJoin("children.transactions", "transactions")
    .select(["transactions.id as id", "transactions.heading as heading", "transactions.type as type", "transactions.amount as amount", "transactions.currency as currency", "transactions.ref as ref", "transactions.isCredit as isCredit", "transactions.date as date", "transactions.childId as childID"])
    .where("user.id = :id", { id: userId })
    .where("transactions.id > 0")
    .orderBy("transactions.date", "DESC")
    .getRawMany();

  console.log('transaction', transactions);
  const balance = transactions.reduce((balance, transaction) => {
    return (
      balance +
      (transaction.type === "bill" ? transaction.amount : -transaction.amount)
    );
  }, 0);

  return {
    balance,
    recentTransactions: transactions.slice(0, 3),
    transactions: transactions,
    currency: transactions[0].currency,
  };
};

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
  const repository = request.server.db.getRepository(Transaction);
  const userRepository = request.server.db.getRepository(User);
  const newInvoice = repository.create({
    heading: title,
    type: type,
    ref: content,
    childId: parseInt(recieverId),
    currency: currency,
    amount: amount,
    isCredit: false,
  });
  const currentUser = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.children", "children")
    .select("user")
    // .where("events.posterId = :id", { id: userId })
    .where("children.id = :id", {id: parseInt(recieverId)})
    .getOne();
  // sendEmail()
  const smtpProtocol = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "eparent.space.int@gmail.com",
      pass: "AmEnTaNe8719"
    }
  });
  const mailoption = {
    from: "eparent.space.int@gmail.com",
    to: currentUser?.email,
    subject: "Test Mail",
    html: 'Good Morning!'
  }
  await smtpProtocol.sendMail(mailoption, (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log('Message Sent');
    smtpProtocol.close();
  });
  return await repository.save(newInvoice);
}