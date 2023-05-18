import { MigrationInterface, QueryRunner } from "typeorm";

export class createRelationBeetweenUserAndTransaction1670035641185 implements MigrationInterface {
    name = 'createRelationBeetweenUserAndTransaction1670035641185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "userId"`);
    }

}
