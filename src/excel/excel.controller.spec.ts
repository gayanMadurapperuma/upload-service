import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

describe('Excel Controller', () => {
  let controller: ExcelController;
  const mockService = {
    fileHandler: jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 0,
        name: 'test',
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
      providers: [ExcelService],
    })
      .overrideProvider(ExcelService)
      .useValue(mockService)
      .compile();
    controller = module.get<ExcelController>(ExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
