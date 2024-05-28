import { Nurseryaccount } from "./Nurseryaccount";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";


@Entity()
export class Withdraw {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Nurseryaccount, (nurseryaccount) => nurseryaccount.withdraws)
  nurseryaccount: Nurseryaccount;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  type: number;

  @Column()
  status: number;

  @Column()
  comment: string;

  @Column()
  account_name: string;

  @Column()
  routing_number: string;

  @Column()
  account_number: string;

  @CreateDateColumn()
  created_at: Date;
}