import { MigrationInterface, QueryRunner } from "typeorm";

export class removeAgeFieldFromChildTable1674622994581 implements MigrationInterface {
    name = 'removeAgeFieldFromChildTable1674622994581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "age"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" ADD "age" integer NOT NULL`);
    }

}
