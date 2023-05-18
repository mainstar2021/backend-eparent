import { MigrationInterface, QueryRunner } from "typeorm";

export class setSettingFieldsNullable1674628323800 implements MigrationInterface {
    name = 'setSettingFieldsNullable1674628323800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "notification" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "session_timeout" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "session_timeout" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "notification" SET NOT NULL`);
    }

}
