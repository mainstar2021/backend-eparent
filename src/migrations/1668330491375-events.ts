import { MigrationInterface, QueryRunner } from "typeorm";

export class events1668330491375 implements MigrationInterface {
    name = 'events1668330491375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fields" character varying NOT NULL, CONSTRAINT "PK_d968f34984d7d85d96f782872fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "notes" character varying NOT NULL, "additionals" jsonb NOT NULL, "eventTypeId" integer, "childId" integer, "posterId" integer, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_3b674f340d59a5fc144f2229763" FOREIGN KEY ("eventTypeId") REFERENCES "event_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_063564ccdaef6059df4446085a5" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_49330e3cc0c70308e4e91e341c9" FOREIGN KEY ("posterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_49330e3cc0c70308e4e91e341c9"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_063564ccdaef6059df4446085a5"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_3b674f340d59a5fc144f2229763"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "event_type"`);
    }

}
