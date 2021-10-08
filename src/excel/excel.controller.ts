import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';

@Controller('bulk')
export class ExcelController {
  constructor(
    @InjectQueue('bulkInsert') private readonly bulkInsertQueue: Queue,
  ) {}

  @Post('student')
  @UseInterceptors(FileInterceptor('file'))
  async bulkInsertStudent(@UploadedFile() file: Express.Multer.File) {
    const job = await this.bulkInsertQueue.add('bulk', {
      file,
    });
    return { job };
  }
}
