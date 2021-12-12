import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import { isAbsolute, join } from 'path';
import { PUBLIC_PATH } from './storage.constants';

@Injectable()
export class StorageService {
  async put(data: Buffer | string, path: string): Promise<string> {
    await fs.outputFile(this.convertToAbsolute(path), data);
    return path;
  }

  async get(path: string): Promise<Buffer> {
    return fs.readFile(this.convertToAbsolute(path));
  }

  delete(...paths: string[]): Promise<any> {
    const filesDeleted = [];

    for (const path of paths) {
      filesDeleted.push(fs.remove(path));
    }

    return Promise.all(filesDeleted);
  }

  private convertToAbsolute(path: string) {
    if (isAbsolute(path)) {
      return path;
    } else {
      return join(PUBLIC_PATH, path);
    }
  }
}
