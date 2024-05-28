import { Child } from "./Child";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { EventType } from "./EventType";
import { Comment } from "./Comment";
import { DevCheckpoint } from "./DevCheckpoint";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EventType)
  eventType: EventType;

  @Column("simple-array", { nullable: true })
  images: string[];

  @ManyToOne(() => Child, (child) => child.events)
  child: Child;

  @ManyToOne(() => User)
  poster: User;

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];

  @Column("jsonb")
  infos: { [prop: string]: any };

  @CreateDateColumn()
  created_at: Date;

  @Column("jsonb")
  indicators: { [prop: string]: any };

  @ManyToOne(() => DevCheckpoint)
  devCheckpoint: DevCheckpoint;
}
