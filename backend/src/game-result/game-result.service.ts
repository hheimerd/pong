import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGameResultInput } from './dto/create-game-result.input';

@Injectable()
export class GameResultService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGameResultInput) {
    return this.prisma.gameResult.create({
      data: dto
    });
  }

  findAll(userId?: number, take = 15, skip = 0) {
    return this.prisma.gameResult.findMany({
      where: {
        players: {
          some: { id: userId }
        }
      },
      take,
      skip
    });
  }
}
