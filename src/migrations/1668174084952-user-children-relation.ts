import { MigrationInterface, QueryRunner } from "typeorm";

export class userChildrenRelation1668174084952 implements MigrationInterface {
    name = 'userChildrenRelation1668174084952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "child" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "gender" character varying NOT NULL, "DOB" character varying NOT NULL, "age" integer NOT NULL, "address" character varying NOT NULL, "additionals" text NOT NULL, "parentId" integer, CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c" FOREIGN KEY ("parentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" DROP CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "child"`);
    }

}
