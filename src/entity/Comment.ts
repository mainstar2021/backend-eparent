import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Event } from "./Events";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => User)
  poster: User;

  @CreateDateColumn()
  created_at: Date;
}
