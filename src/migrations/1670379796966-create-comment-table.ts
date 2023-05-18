import { MigrationInterface, QueryRunner } from "typeorm";

export class createCommentTable1670379796966 implements MigrationInterface {
    name = 'createCommentTable1670379796966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "eventId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e4f8f71ea00e6eb8fc2fdd4844f" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e4f8f71ea00e6eb8fc2fdd4844f"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
