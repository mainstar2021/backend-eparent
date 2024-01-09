import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Child } from "./Child";

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  childId: number;

  @Column()
  reason: number;

  @Column()
  comment: string;

  @Column()
  type: number;

  @Column()
  time: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column()
  status: number;

  @ManyToOne(() => Child, (child) => child.events)
  child: Child;
}