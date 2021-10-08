import { Queue } from 'bull';
import { Test, TestingModule } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
// import { ExcelProcessor } from './excel.processor';

describe('Upload Processor', () => {
  const fakeProcessor = jest.fn();
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'test',
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
      providers: [fakeProcessor],
    }).compile();
  });

  it('should process jobs with the given processors', async () => {
    const queue: Queue = app.get<Queue>(getQueueToken('test'));
    await queue.add(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(fakeProcessor).toHaveBeenCalledTimes(1);
        resolve();
      }, 1000);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
