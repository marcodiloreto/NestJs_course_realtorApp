import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType, UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomesService } from './homes.service';

const mockGetAllHomes = {
  id: 2,
  address: "asd1",
  price: 17900,
  type: PropertyType.RESIDENTIAL,
  images: [{url:"img2"}],
  num_bathrooms: 1,
  num_bedrooms: 1,
  land_size: 39
}

const mockHome = {
  id: 2,
  address: "asd1",
  price: 17900,
  type: PropertyType.RESIDENTIAL,
  images: [{url:"img2"}],
  num_bathrooms: 1,
  num_bedrooms: 1,
  land_size: 39
}
const mockImage ={
  url:"sd",
  home_id:1
}
const filters = {
        type: PropertyType.RESIDENTIAL,
        num_bathrooms: {
            equals: 2
        },
        price: {
            lte: 100000,
            gte: 100
        }}

describe('HomesService', () => {
  let service: HomesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomesService,{
        provide: PrismaService,
        useValue: {
          home:{
            findMany: jest.fn().mockReturnValue(mockGetAllHomes),
            create: jest.fn().mockReturnValue(mockHome)
          },
          image:{
            createMany: jest.fn().mockReturnValue([])
          }
        }
      }],
    }).compile();

    service = module.get(HomesService);
    prisma = module.get(PrismaService)
  });

 /* describe('getAllHomes(filters) test', () => {
    
    it('should call prisma with correct params', async() =>{  
      const mockPrismaFindMAny = jest.fn().mockReturnValue(mockGetAllHomes)
      jest.spyOn(prisma.home, "findMany").mockImplementation(mockPrismaFindMAny)

      await service.getAllHomes(filters)

      expect(mockPrismaFindMAny).toBeCalledWith( 
        {select: {
        id: true,
        address: true,
        price: true,
        type: true,
        num_bathrooms: true,
        num_bedrooms: true,
        land_size: true,
        images: {
            select: {
                url: true
            },
            take: 1
        },

    },
    where: filters}, )
    })

    it('should throw an error', async() =>{ 
      const mockPrismaFindMAny = jest.fn().mockReturnValue([])
      jest.spyOn(prisma.home, "findMany").mockImplementation(mockPrismaFindMAny)

      expect(service.getAllHomes(filters)).rejects.toThrowError(NotFoundException)
    }) 
  })*/

  describe('createHome',() =>{
    const mockCreateHomeParams=  {
    id: 2,
    address: "asd1",
    price: 17900,
    type: PropertyType.RESIDENTIAL,
    numBathrooms: 1,
    numBedrooms: 1,
    landSize: 39,
    images:[{url:"asdf"}]
  }
    it('should call prisma.home.create with correct parameters',async () =>{
      const mockCreateHome = jest.fn().mockReturnValue(mockHome)

      jest.spyOn(prisma.home,'create').mockImplementation(mockCreateHome)
      await service.createHome(mockCreateHomeParams,7,UserType.REALTOR)

      expect(mockCreateHome).toBeCalledWith({
       data:{
        address: "asd1",
        price: 17900,
        type: PropertyType.RESIDENTIAL,
        num_bathrooms: 1,
        num_bedrooms: 1,
        land_size: 39,
        user_id:7
      }
      })
    })
    
    it('should call prisma.image.createMany with correct parameters',async () =>{      
      
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImage)

      jest.spyOn(prisma.image,'createMany').mockImplementation(mockCreateManyImage)

      await service.createHome(mockCreateHomeParams,7,UserType.REALTOR)
      expect(mockCreateManyImage).toBeCalledWith({
        data: [{
          url:"as",
          home_id:1
        }]
      })
    
    })

})


});
