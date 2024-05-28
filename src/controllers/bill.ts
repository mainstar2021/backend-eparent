import { RouteHandlerMethod } from "fastify";
import { Bill } from "@entity/Bill";
import { User } from "@entity/User";
import Transaction from "@entity/Transaction";

import { Stripe } from "stripe";
import axios from 'axios';

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
    bills: bills
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

export const checkoutInvoice: RouteHandlerMethod = async (request, reply) => {

  const { id, type } = request.body as {id: number, type: string};

    console.log(request.body)
    const repository = request.server.db.getRepository(Bill);

    interface Intinvoice  {
      client : string,
      client_email: string,
      amount : number,
      invoice_number : number,
      discount : number,
      mode : "CIB" | "EDAHABIA",
      webhook_url : string,
      back_url : string,
      comment : string,
    }
    
    const create_payement = async(invoice: Intinvoice)=>{
      // adding some validation here 
      // const appKey:string = process.env.REACT_APP_CHARGILY_APP_KEY ? process.env.REACT_APP_CHARGILY_APP_KEY : "
      const config = {headers : {"Access-Control-Allow-Origin": "*", Accept: "application/json",  "X-Authorization": "api_ptiQIoObov1dp3coJLEwNfVO9ubAwxNvR0WKB5KVYYnnK6oLVP2GrdHrC66xDVba"},  timeout: 10000000,}
      try {
        const {data} = await axios.post("http://epay.chargily.com.dz/api/invoice", invoice, config)
        const {checkout_url} = data
        // Redirect;
        return checkout_url;
      } catch (error) {
        console.log(error)
      }
    }
    

    const stripe = new Stripe('sk_test_51OMvjbICVKOX3qt7gkdk593JzYsvnYYqO6pTUqeKauLg7xFfV7KSZsxxw3XVRw9RfjPDtr4hpa99dFy89TYGAXEO00WfRjp6cw');

    const bill = await repository.findOne({ where: {id: id}, relations: {nurseryaccount: true}});

    const handleClick = async(bill: Bill)=>{

      try {
        const checkoutUrl = await create_payement({
          amount: bill.amount,
          invoice_number:bill.id,
          client: bill.nurseryaccount.name, // add a text field to allow the user to enter his name, or get it from a context api (depends on the project architecture)
          mode: "EDAHABIA",
          client_email: "mainstar2021@gmail.com",
          comment: bill.heading,
          webhook_url: "http://admin.eparentspace-uat.com/finance", // here is the webhook url, use beecptor to easly see the post request and it's body, you will use this in backened to save and validate the transactions.
          back_url: "http://admin.eparentspace-uat.com/finance/", // to where the user will be redirected after he finish/cancel the payement 
          discount :0
      })
      console.log(checkoutUrl);
      return checkoutUrl;
      } catch (error) {
        // handle your error here 
        console.log(error)
      }
    }
    

    const createCustomer = async (bill: Bill) => {
      const customer : Stripe.Checkout.Session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: bill.heading,
              },
              unit_amount: bill.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://admin.eparentspace-uat.com/finance',
        cancel_url: 'http://admin.eparentspace-uat.com/finance',
      });

      if (customer.url == null){
      } else { 
        return customer.url;
      }    
    };

    if(bill) {
      if(type == "0") {
        const res = await createCustomer(bill);
        return { res };
      } else {
        const res = await handleClick(bill);
        console.log(res, "PPPP");
        return {res };
      }
    }
}

export const checkoutParentInvoice: RouteHandlerMethod = async (request, reply) => {

  const { id, type } = request.body as {id: number, type: string};

    console.log(request.body)
    const repository = request.server.db.getRepository(Transaction);

    interface Intinvoice  {
      client : string,
      client_email: string,
      amount : number,
      invoice_number : number,
      discount : number,
      mode : "CIB" | "EDAHABIA",
      webhook_url : string,
      back_url : string,
      comment : string,
    }
    
    const create_payement = async(invoice: Intinvoice)=>{
      // adding some validation here 
      // const appKey:string = process.env.REACT_APP_CHARGILY_APP_KEY ? process.env.REACT_APP_CHARGILY_APP_KEY : "
      const config = {headers : {"Access-Control-Allow-Origin": "*", Accept: "application/json",  "X-Authorization": "api_ptiQIoObov1dp3coJLEwNfVO9ubAwxNvR0WKB5KVYYnnK6oLVP2GrdHrC66xDVba"},  timeout: 10000000,}
      try {
        const {data} = await axios.post("http://epay.chargily.com.dz/api/invoice", invoice, config)
        const {checkout_url} = data
        // Redirect;
        return checkout_url;
      } catch (error) {
        console.log(error)
      }
    }
    

    const stripe = new Stripe('sk_test_51OMvjbICVKOX3qt7gkdk593JzYsvnYYqO6pTUqeKauLg7xFfV7KSZsxxw3XVRw9RfjPDtr4hpa99dFy89TYGAXEO00WfRjp6cw');

    const bill = await repository.findOne({ where: {id: id}, relations: {child: true}});

    const handleClick = async(bill: Transaction)=>{

      try {
        const checkoutUrl = await create_payement({
          amount: bill.amount,
          invoice_number:bill.id,
          client: bill.child.name, // add a text field to allow the user to enter his name, or get it from a context api (depends on the project architecture)
          mode: "EDAHABIA",
          client_email: "mainstar2021@gmail.com",
          comment: bill.heading,
          webhook_url: "http://admin.eparentspace-uat.com/finance", // here is the webhook url, use beecptor to easly see the post request and it's body, you will use this in backened to save and validate the transactions.
          back_url: "http://admin.eparentspace-uat.com/finance/", // to where the user will be redirected after he finish/cancel the payement 
          discount :0
      })
      console.log(checkoutUrl);
      return checkoutUrl;
      } catch (error) {
        // handle your error here 
        console.log(error)
      }
    }
    

    const createCustomer = async (bill: Transaction) => {
      const customer : Stripe.Checkout.Session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: bill.heading,
              },
              unit_amount: bill.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://admin.eparentspace-uat.com/finance',
        cancel_url: 'http://admin.eparentspace-uat.com/finance',
      });

      if (customer.url == null){
      } else { 
        return customer.url;
      }    
    };

    if(bill) {
      if(type == "0") {
        const res = await createCustomer(bill);
        return { res };
      } else {
        const res = await handleClick(bill);
        console.log(res, "PPPP");
        return {res };
      }
    }
}


