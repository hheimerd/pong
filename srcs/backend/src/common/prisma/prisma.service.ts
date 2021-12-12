import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import PrismaModule from '@prisma/client';
const PrismaClient = PrismaModule.PrismaClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async applySoftDelete(
    modelName: string,
    field: string,
    set: any,
    exclude?: any,
  ) {
    // Use SoftDelete
    this.$use(async (params, next) => {
      if (params.model.toString() == modelName) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { [field]: set };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          params.args['data'] = { [field]: set };
        }
      }
      return next(params);
    });

    if (exclude !== undefined) {
      // Exclude deleted records
      this.$use(async (params, next) => {
        if (
          params.model.toString() == modelName &&
          params.args.where?.[field] === undefined
        ) {
          if (params.action == 'findUnique') {
            params.action = 'findFirst';
            params.args.where[field] = exclude;
          }

          if (params.action == 'findMany') {
            if (params.args.where != undefined) {
              params.args.where[field] = exclude;
            } else {
              params.args['where'] = { [field]: exclude };
            }
          }
        }
        return next(params);
      });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
