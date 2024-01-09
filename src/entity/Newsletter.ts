import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// import { Nurseryaccount } from "./Nurseryaccount";

@Entity()
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nursery_id: number;

  @Column()
  year: string;

  @Column()
  month: string;

  @Column()
  content_resume: string;

  @Column()
  content_movement: string;

  @Column()
  content_birthday: string;

  @Column()
  content_event: string;

  @Column()
  content_msg: string;

  @Column("simple-array", { nullable: true })
  images: string[];

//   @ManyToOne(() => Nurseryaccount, (nursery) => nursery.classrooms)
//   nursery: Nurseryaccount;
}