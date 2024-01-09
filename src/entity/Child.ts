import { User } from "./User";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Events";
import { Attendance } from "./Attendance";
import { Classroom } from "./Classroom";
import Transaction from "./Transaction";
import { Report } from "./Report";

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column()
  gender: string;

  @Column()
  DOB: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  photo?: string;

  @Column("simple-json")
  additionals: {
    ethnicity: string;
    religion: string;
    languages: string[];
  };

  @Column()
  parentId: number;

  @Column()
  classroomId: number;

  @Column()
  father_fname: string;

  @Column()
  father_lname: string;

  @Column()
  father_email: string;

  @Column()
  father_mobile: string;

  @Column()
  mother_fname: string;

  @Column()
  mother_lname: string;

  @Column()
  mother_email: string;

  @Column()
  mother_mobile: string;

  @Column()
  third_fname: string;

  @Column()
  third_lname: string;

  @Column()
  third_email: string;

  @Column()
  third_mobile: string;

  @Column()
  attendance_mode: number;

  @ManyToOne(() => User, (user) => user.children)
  parent: User;

  @ManyToOne(() => Classroom, (classroom) => classroom.children)
  classroom: Classroom;

  @OneToMany(() => Event, (event) => event.child)
  events: Event[];

  @OneToMany(() => Report, (report) => report.child)
  reports: Report[];

  @OneToMany(() => Attendance, (attendance) => attendance.child)
  attendance: Attendance[];

  @OneToMany(() => Transaction, (transaction) => transaction.child)
  transactions: Transaction[];
}
