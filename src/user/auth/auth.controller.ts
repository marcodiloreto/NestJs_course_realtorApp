import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { keyDto, UserCreateDto, UserSignInDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import {UserType} from '@prisma/client';
import * as bcrypt from 'bcryptjs'

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }
    
    @Post('/signup/:type')
    async signUp( @Body() body: UserCreateDto,
            @Param('type', new ParseEnumPipe(UserType)) type:UserType
    ){
    if(type === UserType.BUYER) return this.service.signUp(body,type)
    if(!body.productKey) throw new UnauthorizedException()
    const PK = `${body.email}-${type}-${process.env.KEY_SECRET}`
    const isValid =  await bcrypt.compare(PK,body.productKey)

    if(isValid) return this.service.signUp(body,type)
    throw new UnauthorizedException('Invalid Product key')
    }

    @Post('/signin')
    signIn(@Body() body:UserSignInDto){
        return this.service.signIn(body)
    }

    @Post('/key')
    generateProductKey(@Body() {email,type}:keyDto){
        return this.service.generateKey(email,type)
    }
}
