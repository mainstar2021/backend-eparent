import { MigrationInterface, QueryRunner } from "typeorm";

export class addPosterToCommentsTable1676809544499 implements MigrationInterface {
    name = 'addPosterToCommentsTable1676809544499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "posterId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8f64ee593d3709eee7775f9c462" FOREIGN KEY ("posterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8f64ee593d3709eee7775f9c462"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "posterId"`);
    }

}
