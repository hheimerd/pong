import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMessagesAndChatsTable1627489447255 implements MigrationInterface {
    name = 'CreateMessagesAndChatsTable1627489447255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "ownerId" integer, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "chatId" uuid, "userId" integer, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_messages_chat_message" ("chatId" uuid NOT NULL, "chatMessageId" uuid NOT NULL, CONSTRAINT "PK_c9017eaf571832fdf83fbb3c7d7" PRIMARY KEY ("chatId", "chatMessageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6580085e4a017fa3d24f29123a" ON "chat_messages_chat_message" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_610d916b1691a837c5eff8d8a3" ON "chat_messages_chat_message" ("chatMessageId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_ae88d8de23e69a0d57105a5bce5" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" ADD CONSTRAINT "FK_6580085e4a017fa3d24f29123a8" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" ADD CONSTRAINT "FK_610d916b1691a837c5eff8d8a3c" FOREIGN KEY ("chatMessageId") REFERENCES "chat_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" DROP CONSTRAINT "FK_610d916b1691a837c5eff8d8a3c"`);
        await queryRunner.query(`ALTER TABLE "chat_messages_chat_message" DROP CONSTRAINT "FK_6580085e4a017fa3d24f29123a8"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_ae88d8de23e69a0d57105a5bce5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_610d916b1691a837c5eff8d8a3"`);
        await queryRunner.query(`DROP INDEX "IDX_6580085e4a017fa3d24f29123a"`);
        await queryRunner.query(`DROP TABLE "chat_messages_chat_message"`);
        await queryRunner.query(`DROP TABLE "chat_message"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
