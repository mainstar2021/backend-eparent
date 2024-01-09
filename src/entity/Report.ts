import { Child } from "./Child";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";


@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Child, (child) => child.reports)
  child: Child;

  @Column()
  comment: string;

  @Column()
  path: string;

  @CreateDateColumn()
  created_at: Date;
}