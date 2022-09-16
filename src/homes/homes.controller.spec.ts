import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomesController } from './homes.controller';
import { HomesService } from './homes.service';

describe('HomesController', () => {
  let controller: HomesController;
  let service: HomesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomesController],
      providers: [{
        provide: HomesService,
        useValue: {
          getAllHomes: jest.fn().mockReturnValue([])
        }
      },
        PrismaService]
    }).compile();

    controller = module.get<HomesController>(HomesController);
    service = module.get(HomesService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('testing homeController/get', () => {
    it('should construct the filters object properly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([])
      jest.spyOn(service , "getAllHomes").mockImplementation(mockGetHomes)
      await controller.getAllHomes('6', PropertyType.RESIDENTIAL, '1', '60000000')

      expect(mockGetHomes).toBeCalledWith({
        type: PropertyType.RESIDENTIAL,
        num_bathrooms: {
          equals: 6
        },
        price: {
          lte: 60000000,
          gte:1 
        }
      })
    })
  })
});
