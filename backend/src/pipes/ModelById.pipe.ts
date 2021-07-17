import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

interface IModelService<T> {
  findById(id: number): Promise<T> | T;
}

@Injectable()
export abstract class ModelByIdPipe<T> implements PipeTransform {
  constructor(private readonly service: IModelService<T>) {}

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<string | T> {
    // if (metadata.type != 'query' && metadata.type != 'param' ) {
    //   return value;
    // }

    const id = parseInt(value, 10);
    const model = await this.service.findById(id);
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }
}
