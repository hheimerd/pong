import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { env } from 'process';
import bcryptjs from 'bcryptjs';
const { genSalt, hash, compare } = bcryptjs;
import _sendmail from 'sendmail';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
const sendmail = _sendmail({ silent: true });

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 * * * *')
  async deleteOld() {
    const hourAgo = moment().subtract(1, 'hours');

    this.prisma.authCode.deleteMany({
      where: {
        created_at: {
          lte: hourAgo.toDate(),
        },
      },
    });
  }

  async sendCode(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const code = randomUUID();

    const record = await this.prisma.authCode.create({
      data: {
        user_id: userId,
        codeHash: await hash(code, await genSalt()),
      },
    });

    const link = `${env.LINK2FA}?code=${code}&id=${record.id}`;

    sendmail(
      {
        from: 'login@' + env.MAIL_HOST,
        to: user.email,
        subject: 'Confirm login',
        text: 'Go to this link to login: ' + link,
        html: `
        Click <a href="${link}">here</a> to login
      `,
      },
      function (err) {
        if (err) console.log(err && err.stack);
      },
    );

    return record;
  }

  async delete(id: string) {
    return await this.prisma.authCode.delete({
      where: { id },
    });
  }

  async validate(code: string, id: string) {
    const record = await this.prisma.authCode.findUnique({ where: { id } });
    if (!record) return false;

    const isValid = await compare(code, record.codeHash);
    if (!isValid) return false;

    this.delete(id);

    return await this.prisma.user.findUnique({ where: { id: record.user_id } });
  }
}
