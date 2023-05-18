import { MigrationInterface, QueryRunner } from "typeorm";

export class events1668334012756 implements MigrationInterface {
    name = 'events1668334012756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "additionals"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "infos" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "infos"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "additionals" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "notes" character varying NOT NULL`);
    }

}
