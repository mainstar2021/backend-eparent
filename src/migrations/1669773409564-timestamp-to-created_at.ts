import { MigrationInterface, QueryRunner } from "typeorm";

export class timestampToCreatedAt1669773409564 implements MigrationInterface {
    name = 'timestampToCreatedAt1669773409564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "created_at"`);
    }

}
