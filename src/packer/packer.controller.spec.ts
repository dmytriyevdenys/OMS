import { Test, TestingModule } from '@nestjs/testing';
import { PackerController } from './packer.controller';

describe('PackerController', () => {
  let controller: PackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackerController],
    }).compile();

    controller = module.get<PackerController>(PackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
