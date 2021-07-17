import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserRolesField1626534369012 implements MigrationInterface {
    name = 'CreateUserRolesField1626534369012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" character varying array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    }

}
