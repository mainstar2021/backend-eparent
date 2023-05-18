import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Bill {
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
  nurseryaccountId: number;

  @CreateDateColumn()
  date: Date;
}