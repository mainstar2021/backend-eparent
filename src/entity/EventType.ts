import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fields: string;
}
