import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDefaultValueToUser1627494402241 implements MigrationInterface {
    name = 'AddDefaultValueToUser1627494402241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`);
    }

}
