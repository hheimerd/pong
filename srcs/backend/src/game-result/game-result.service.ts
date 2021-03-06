import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class GameResultService {
  constructor(private readonly prisma: PrismaService) {}

  public async upRank(playerId: number, amount: number)
  {
    await this.prisma.user.update({
      where: {
        id: playerId,
      },
      data: {
        rank: {
          increment: amount
        }
      }
    })
  }

  async create(players: number[], score) {
    return await this.prisma.gameResult.create({
      data: {
        players: {
          connect: players.map(id => ({ id })),
        },
        score
      }
    });
  }

  async findAll(userId?: number, take = 15, skip = 0) {
    if (!userId) return [];
    
    const results = (await this.prisma.gameResult.findMany({
      where: {
        players: {
          some: { id: userId }
        }
      },
      take,
      skip,
      include: {
        players: {
          select: { id: true },
        }
      }
    }));

    const normalized = results.map(r => ({
      ...r,
      players: r.players.map(pl => pl.id)
    }))

    return normalized;
  }
}
