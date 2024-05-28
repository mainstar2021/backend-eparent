import {
Column,
Entity,
PrimaryGeneratedColumn,
ManyToOne
} from "typeorm";
import { DevCheckpoint } from "./DevCheckpoint";

@Entity()
export class DevMatter {
@PrimaryGeneratedColumn()
id: number;

// @Column()
// devCheckpointId: number;

@ManyToOne(() => DevCheckpoint)
  devCheckpoint: DevCheckpoint;

@Column()
description: string;

@Column()
instruction: string;
}