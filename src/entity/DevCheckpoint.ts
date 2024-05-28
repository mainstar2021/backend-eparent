import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class DevCheckpoint {
@PrimaryGeneratedColumn()
id: number;

@Column()
ageId: number;

@Column()
categoryId: number;

@Column()
month: number;

@Column()
isDeleted: number;
}