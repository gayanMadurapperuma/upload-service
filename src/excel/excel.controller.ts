import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';

@Controller('bulk')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Post('student')
  @UseInterceptors(FileInterceptor('file'))
  async bulkInsertStudent(@UploadedFile() file: Express.Multer.File) {
    return await this.excelService.fileHandler(file);
  }
}
