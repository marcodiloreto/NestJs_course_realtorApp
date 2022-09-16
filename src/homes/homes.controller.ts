import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { HomesService } from './homes.service';
import { CreateHomeDto, HomeClientDto, inquireDto, UpdateHomeDto } from './dtos/homes.dtos';
import { PropertyType, UserType } from '@prisma/client';
import { User, IUser } from 'src/user/decorator/user.decorator';
import { Roles } from 'src/decorator/roles.decorator';
@Controller('homes')
export class HomesController {

    constructor(private readonly service: HomesService) { }

    @Get('')
    getAllHomes(
        @Query('numBathrooms') num_bathrooms?: string,
        @Query('type') type?: PropertyType,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string
    ): Promise<HomeClientDto[]> {

        const price = minPrice || maxPrice ? {
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
            ...(minPrice && { gte: parseFloat(minPrice) }),
        } : undefined

        const filters = {
            ...(num_bathrooms && { num_bathrooms: { equals: parseInt(num_bathrooms) } }),
            ...(type && { type }),
            ...(price && { price })
        }

        return this.service.getAllHomes(filters);
    }

    @Get('/:id')
    getHomeById(@Param('id', ParseIntPipe) id: number): Promise<HomeClientDto> {
        return this.service.getHomeById(id);
    }

    @Post('')
    @Roles(UserType.REALTOR)
    createHome(@Body() body: CreateHomeDto, @User() user: IUser): Promise<HomeClientDto> {
        return this.service.createHome(body, user.id, user.type)
    }


    @Roles(UserType.REALTOR)
    @Put('/:id')
    updateHome(@Body() body: UpdateHomeDto, @Param('id', ParseIntPipe) id: number, @User() user: IUser): Promise<HomeClientDto> {
        if (!this.service.validateUserForHome(id, user.id)) throw new UnauthorizedException("you're not the owner of such home post")
        return this.service.updateHome(body, id)
    }


    @Roles(UserType.REALTOR)
    @Delete('/:id')
    deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: IUser) {
        if (!this.service.validateUserForHome(id, user.id)) throw new UnauthorizedException("you're not the owner of such home post")
        const isTrue = this.service.deleteHome(id)
        if (isTrue) return HttpStatus.OK
    }

    @Roles(UserType.BUYER, UserType.REALTOR, UserType.ADMIN)
    @Post('/:id/inquire')
    inquireMessage(@Param('id', ParseIntPipe) homeId: number, @Body() { message }: inquireDto, @User() user: IUser) {
        return this.service.inquireMessage(homeId, message, user.id);
    }

    @Get('/:id/messages')
    getMessages(@Param('id', ParseIntPipe) id: number) {
        return this.service.getMessagesByHome(id);
    }

    @Get('hola')
    asd() {
        return 'hola'
    }
}


