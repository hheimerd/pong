import {MigrationInterface, QueryRunner} from "typeorm";

export class DropChatMessagesChatMessageTable1627762050978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" DROP CONSTRAINT "FK_610d916b1691a837c5eff8d8a3c"`);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" DROP CONSTRAINT "FK_6580085e4a017fa3d24f29123a8"`);
        await queryRunner.query(`DROP INDEX "IDX_610d916b1691a837c5eff8d8a3"`);
        await queryRunner.query(`DROP INDEX "IDX_6580085e4a017fa3d24f29123a"`);
        await queryRunner.query(`DROP TABLE "chat_messages_chat_message"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_messages_chat_message" ("chatId" uuid NOT NULL, "chatMessageId" uuid NOT NULL, CONSTRAINT "PK_c9017eaf571832fdf83fbb3c7d7" PRIMARY KEY ("chatId", "chatMessageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6580085e4a017fa3d24f29123a" ON "chat_messages_chat_message" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_610d916b1691a837c5eff8d8a3" ON "chat_messages_chat_message" ("chatMessageId") `);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" ADD CONSTRAINT "FK_6580085e4a017fa3d24f29123a8" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" ADD CONSTRAINT "FK_610d916b1691a837c5eff8d8a3c" FOREIGN KEY ("chatMessageId") REFERENCES "chat_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
