import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Child } from "./Child";
import { Classroom } from "./Classroom";
import { Nurseryaccount } from "./Nurseryaccount";
import { Setting } from "./Setting";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  fname: string;

  @Column({ nullable: true })
  lname: string;

  @Column({ nullable: true })
  DOB: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  photo: string;

  @Column("simple-json")
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
    postcode: string;
  };

  @Column()
  role: string;

  @Column()
  nurseryId: number;

  @Column()
  userCount: number;
  
  @Column()
  adminCount: number;

  @Column()
  classroomId: number;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];

  @ManyToOne(() => Nurseryaccount, (nursery) => nursery.nurserys)
  nursery: Nurseryaccount;

  @ManyToOne(() => Classroom, (classroom) => classroom.nurseryusers)
  classroom: Classroom;

  @OneToOne(() => Setting, { cascade: true })
  @JoinColumn()
  setting: Setting;
}
