import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Child } from "./Child";
import { Nurseryaccount } from "./Nurseryaccount";
import { User } from "./User";


@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  range_from: string;

  @Column()
  range_to: string;

  @Column()
  nurseryId: number;

  @OneToMany(() => Child, (child) => child.classroom)
  children: Child[];

  @OneToMany(() => User, (user) => user.classroom)
  nurseryusers: User[];

  @ManyToOne(() => Nurseryaccount, (nursery) => nursery.classrooms)
  nursery: Nurseryaccount;
}
