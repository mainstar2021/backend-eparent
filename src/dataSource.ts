import { DataSource } from "typeorm";
import "reflect-metadata";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "e-parent",
  entities: [__dirname + "/entity/**/*.{ts,js}"],
  migrations: [__dirname + "/migrations/**/*.ts"],
});

export default dataSource;
