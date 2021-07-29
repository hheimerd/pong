import {MigrationInterface, QueryRunner} from "typeorm";

export class ChatEntityChange1627571499108 implements MigrationInterface {
    name = 'ChatEntityChange1627571499108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_members_user" ("chatId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_0659796185219b27cd0d7eadb48" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd7edbaccbb127f22fecd29674" ON "chat_members_user" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8c4e5bfdb28f12dc9a73dd3b5" ON "chat_members_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "chat_admins_user" ("chatId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_aea7c3fe5b04db41b0f80a4aa78" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_310d7125822ccdb673985223a1" ON "chat_admins_user" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_212a828b50618f18e2d378a4f5" ON "chat_admins_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "chat_members_user" ADD CONSTRAINT "FK_cd7edbaccbb127f22fecd296743" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_members_user" ADD CONSTRAINT "FK_c8c4e5bfdb28f12dc9a73dd3b57" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_admins_user" ADD CONSTRAINT "FK_310d7125822ccdb673985223a14" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_admins_user" ADD CONSTRAINT "FK_212a828b50618f18e2d378a4f5f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_admins_user" DROP CONSTRAINT "FK_212a828b50618f18e2d378a4f5f"`);
        await queryRunner.query(`ALTER TABLE "chat_admins_user" DROP CONSTRAINT "FK_310d7125822ccdb673985223a14"`);
        await queryRunner.query(`ALTER TABLE "chat_members_user" DROP CONSTRAINT "FK_c8c4e5bfdb28f12dc9a73dd3b57"`);
        await queryRunner.query(`ALTER TABLE "chat_members_user" DROP CONSTRAINT "FK_cd7edbaccbb127f22fecd296743"`);
        await queryRunner.query(`DROP INDEX "IDX_212a828b50618f18e2d378a4f5"`);
        await queryRunner.query(`DROP INDEX "IDX_310d7125822ccdb673985223a1"`);
        await queryRunner.query(`DROP TABLE "chat_admins_user"`);
        await queryRunner.query(`DROP INDEX "IDX_c8c4e5bfdb28f12dc9a73dd3b5"`);
        await queryRunner.query(`DROP INDEX "IDX_cd7edbaccbb127f22fecd29674"`);
        await queryRunner.query(`DROP TABLE "chat_members_user"`);
    }

}
