import { Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeClientDto } from './dtos/homes.dtos';

interface Filters {
    type?: PropertyType
    num_bathrooms?: {
        equals?: number
    }
    price?: {
        lte?: number
        gte?: number
    }
}

interface NewHome {
    address: string
    numBathrooms: number
    numBedrooms: number
    price: number
    landSize: number
    images: { url: string }[]
    type: PropertyType
}

interface UpdateHome {
    address?: string
    numBathrooms?: number
    numBedrooms?: number
    price?: number
    landSize?: number
    type?: PropertyType
}

@Injectable()
export class HomesService {

    constructor(private readonly prisma: PrismaService) { }

    async getAllHomes(filters: Filters): Promise<HomeClientDto[]> {

        const homes = await this.prisma.home.findMany({
            select: {
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
            where: filters
        }).then(array => array.map(home => {
            const parseHome = { ...home, image: home.images[0].url }
            delete parseHome.images;
            return new HomeClientDto(parseHome)
        }))
        if(!homes) throw new NotFoundException()
        return homes
    }

    async getHomeById(id: number): Promise<HomeClientDto> {
        const home = await this.prisma.home.findUnique({
            where: {
                id,
            },
            select: {
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
                }
            }
        }).then(home => {
            const parseHome = { ...home, image: home.images[0].url }
            delete parseHome.images;
            return new HomeClientDto(parseHome)
        })
        return home;
    }

   
    async createHome(body: NewHome,id:number,type:UserType): Promise<HomeClientDto> {
        
        if (type === UserType.BUYER)throw new UnauthorizedException("you're not authorized to perform this action")

        const home = await this.prisma.home.create({
            data: {
                address: body.address,
                price: body.price,
                num_bathrooms: body.numBathrooms,
                num_bedrooms: body.numBedrooms,
                land_size: body.landSize,
                type: body.type,
                user_id: id,
            }
        })
        const imagesData = body.images.map(image => {
            return { url: image.url, home_id: home.id }
        })
        await this.prisma.image.createMany({
            data: imagesData
        })

        return new HomeClientDto(home);
    }

    async updateHome(body: UpdateHome, id: number): Promise<HomeClientDto> {

        const home = await this.getHomeById(id)

        const updatedHome = await this.prisma.home.update({
            where: { id },
            data: body
        })

        return new HomeClientDto(updatedHome)
    }

    async deleteHome(id:number){
    
         await this.prisma.image.deleteMany({where:{
          home_id:id  
        }})

        const home = await this.prisma.home.delete({where: {id}})

        if(!home) throw new NotFoundException()

        return true;
    }

    async validateUserForHome(homeId:number,realtorId:number):Promise<boolean>{

       const userId = await this.prisma.home.findUnique({
            where: {
                id: homeId,
            },
            select:{
                user:{
                    select:{
                        id:true
                    }
                }
            }
        })
        if(!userId) throw new NotFoundException('such home does not exist')
        
        return (userId.user.id === realtorId)
    }

    async inquireMessage(home_id:number,message:string,user_id:number){
        const home = await this.prisma.home.findUnique({where:{
            id: home_id
        },
        select:{
            user_id:true
        }})

        if(!home) throw new NotFoundException()

        return await this.prisma.message.create({
            data:{
              message,
              realtor_id: home.user_id,
              home_id,
              buyer_id:user_id
            }
        })

    }

    async getMessagesByHome(id:number){
        const messages = await this.prisma.message.findMany({
            where:{
                home_id:id,
            },
            select:{
                id:true,
                message:true,
                home:{select:{
                    address:true,
                    type:true,
                }},
                buyer: {select:{
                  name:true,
                  phone:true,
                  email:true,  
                }},

            }
        })
        if(!messages.length) throw new NotFoundException();
        return messages
    }
}



