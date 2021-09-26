import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as nodemailer from 'nodemailer';
import { env } from 'process';
import bcryptjs from 'bcryptjs';
const { genSalt, hash, compare } = bcryptjs;

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async sendCode(userId: number)
  {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const code = randomUUID();

    const record = await this.prisma.authCode.create({
      data: {
        user_id :userId,
        codeHash: await hash(code, await genSalt()),
      }
    });

    const transporter = nodemailer.createTransport();
    const link = `${env.LINK2FA}?code=${code}&id=${record.id}`;


    transporter.sendMail({
      from: env.MAIL_HOST,
      to: user.email,
      subject: "Confirm login",
      text: "Go to this link to login: " + link,
      html: `
        Click <a href="${link}">here</a> to login
      `
    });
    
    return record;
  }


  async validate(code: string, id: string){
    const record = await this.prisma.authCode.findUnique({ where: { id } });
    if (!record) return false;

    const isValid = await compare(code, record.codeHash);
    if (!isValid) return false;

    return await this.prisma.user.findUnique({ where: { id: record.user_id }});
  }

}
