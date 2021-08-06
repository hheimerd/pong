import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

export interface IModelService<T = any> {
  findOne(id: any): Promise<T> | T;
}

@Injectable()
export abstract class ModelByIdPipe<T = any> implements PipeTransform {
  constructor(private readonly service: IModelService<T>) {}

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<string | T> {
    // if (metadata.type != 'query' && metadata.type != 'param' ) {
    //   return value;
    // }

    const model = await this.service.findOne(value);
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }
}
