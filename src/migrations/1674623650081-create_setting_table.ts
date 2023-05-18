import { MigrationInterface, QueryRunner } from "typeorm";

export class createSettingTable1674623650081 implements MigrationInterface {
    name = 'createSettingTable1674623650081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "setting" ("id" SERIAL NOT NULL, "notification" text NOT NULL, "session_timeout" character varying NOT NULL, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "settingId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a2122bd128c9af8378a378ed6b8" UNIQUE ("settingId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a2122bd128c9af8378a378ed6b8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "settingId"`);
        await queryRunner.query(`DROP TABLE "setting"`);
    }

}
