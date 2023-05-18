import { MigrationInterface, QueryRunner } from "typeorm";

export class addImagesToEventsTable1669875014933 implements MigrationInterface {
    name = 'addImagesToEventsTable1669875014933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "images" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "images"`);
    }

}
