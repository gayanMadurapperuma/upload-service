import { InjectQueue } from '@nestjs/bull';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Bull, { Queue } from 'bull';

export interface FileResponse {
  id: Bull.JobId;
  name: string;
}

@Injectable()
export class ExcelService {
  constructor(
    @InjectQueue('bulkInsert') private readonly bulkInsertQueue: Queue,
  ) {}

  async fileHandler(file: Express.Multer.File): Promise<FileResponse> {
    try {
      const { id, name } = await this.bulkInsertQueue.add('bulk', {
        file,
      });
      return { id, name };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
