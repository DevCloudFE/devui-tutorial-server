import { Test, TestingModule } from '@nestjs/testing';
import { IsLoginController } from './is-login.controller';

describe('IsLogin Controller', () => {
  let controller: IsLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IsLoginController],
    }).compile();

    controller = module.get<IsLoginController>(IsLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
