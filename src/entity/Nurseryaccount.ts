import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "./Classroom";
import { User } from "./User";
import { Bill } from "./Bill";


@Entity()
export class Nurseryaccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tax: string;

  @Column()
  phone: string;

  @Column()
  disable: boolean;

  @OneToMany(() => User, (user) => user.nursery)
  nurserys: User[];

  @OneToMany(() => Classroom, (classroom) => classroom.nursery)
  classrooms: Classroom[];

  @OneToMany(() => Bill, (bill) => bill.nurseryaccount)
  bills: Bill[];
}
