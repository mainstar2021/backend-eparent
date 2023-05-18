import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json", { nullable: true })
  notification: {
    [prop: string]: {
      email?: boolean;
      app?: boolean;
      push?: boolean;
    };
  };

  @Column({ nullable: true })
  session_timeout: string;
}
