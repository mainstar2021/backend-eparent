import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class DevCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  areaId: number;

  @Column()
  name: string;

  @Column()
  label: string;
}
