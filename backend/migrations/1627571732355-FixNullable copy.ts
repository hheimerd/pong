import {MigrationInterface, QueryRunner} from "typeorm";

export class FixNullable1627571732355 implements MigrationInterface {
    name = 'FixNullable1627571732355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ALTER COLUMN "name" SET NOT NULL`);
    }

}
