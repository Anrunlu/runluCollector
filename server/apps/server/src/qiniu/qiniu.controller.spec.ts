import { Test, TestingModule } from '@nestjs/testing';
import { QiniuController } from './qiniu.controller';

describe('Qiniu Controller', () => {
  let controller: QiniuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QiniuController],
    }).compile();

    controller = module.get<QiniuController>(QiniuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
