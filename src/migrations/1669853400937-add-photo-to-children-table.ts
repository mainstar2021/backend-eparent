import { MigrationInterface, QueryRunner } from "typeorm";

export class addPhotoToChildrenTable1669853400937 implements MigrationInterface {
    name = 'addPhotoToChildrenTable1669853400937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "photo"`);
    }

}
