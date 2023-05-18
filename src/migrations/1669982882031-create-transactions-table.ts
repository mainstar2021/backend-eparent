import { MigrationInterface, QueryRunner } from "typeorm";

export class createTransactionsTable1669982882031 implements MigrationInterface {
    name = 'createTransactionsTable1669982882031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('bill', 'receipt')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "heading" character varying NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "ref" character varying NOT NULL, "isCredit" boolean NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    }

}
