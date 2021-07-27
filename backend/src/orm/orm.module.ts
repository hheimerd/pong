import { DynamicModule, Module } from '@nestjs/common';
import { IModelService, ModelByIdPipe } from 'src/pipes/ModelById.pipe';

@Module({})
export class OrmModule {
  forFeature(service: IModelService): DynamicModule {
    class Special extends ModelByIdPipe {}
    return {
      module: OrmModule,
      providers: [{
        provide: ModelByIdPipe,
        useClass: Special
      }],
      exports: [ModelByIdPipe]
    }
  }
}
