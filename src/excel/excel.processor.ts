import { Process, Processor } from '@nestjs/bull';
import { HttpStatus, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Readable } from 'stream';
import * as Excel from 'exceljs';
import * as moment from 'moment';
import { Student } from '../entity/student';
import { ExcelGateway } from './excel.gateway';
import { request, gql } from 'graphql-request';
import { ConfigService } from '@nestjs/config';

@Processor('bulkInsert')
export class ExcelProcessor {
  private readonly logger = new Logger(ExcelProcessor.name);
  constructor(
    private gateway: ExcelGateway,
    private configService: ConfigService,
  ) {}

  @Process('bulk')
  async handleTranscode(job: Job) {
    try {
      this.logger.debug('Start transcoding...');
      const query = gql`
        mutation BulkStudentCreate($students: [StudentBulkCreateDTO!]!) {
          bulkStudentCreate(students: $students)
        }
      `;
      let student: Student[] = [];
      const workbook = new Excel.Workbook();
      const buffer = job.data.file.buffer.data;
      const readable = new Readable();
      readable.push(new Uint8Array(buffer));
      readable.push(null);
      const values = await workbook.xlsx.read(readable);
      const sheet = values.getWorksheet(1);
      sheet.eachRow((row, index) => {
        if (index !== 1) {
          student = [
            ...student,
            {
              firstName: row.values[1],
              middleName: row.values[4],
              lastName: row.values[2],
              email: row.values[3],
              dob: row.values[5],
              age: moment().diff(row.values[5], 'years', false),
            },
          ];
        }
      });
      await request(this.configService.get<string>('gql'), query, {
        students: student,
      });
      this.gateway.server.emit('events', { statusCode: HttpStatus.OK });
      this.logger.debug('Transcoding completed');
    } catch (error) {
      this.logger.debug('Transcoding Failed', error);
      this.gateway.server.emit('events', {
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
