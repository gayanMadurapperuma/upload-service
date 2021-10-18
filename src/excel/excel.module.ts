import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelProcessor } from './excel.processor';
import { ExcelGateway } from './excel.gateway';
import { ExcelService } from './excel.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bulkInsert',
    }),
  ],
  providers: [ExcelProcessor, ExcelGateway, ExcelService],
  exports: [],
  controllers: [ExcelController],
})
export class ExcelModule {}
