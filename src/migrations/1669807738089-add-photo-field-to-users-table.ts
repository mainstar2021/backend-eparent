import { MigrationInterface, QueryRunner } from "typeorm";

export class addPhotoFieldToUsersTable1669807738089 implements MigrationInterface {
    name = 'addPhotoFieldToUsersTable1669807738089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
    }

}
