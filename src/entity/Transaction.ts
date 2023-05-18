import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Child } from "./Child";

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heading: string;

  @Column()
  type: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  ref: string;

  @Column()
  isCredit: boolean;

  @Column()
  childId: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Child, (child) => child.transactions)
  child: Child;
}
