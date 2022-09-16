import {IsString, IsNotEmpty, Matches, IsEmail, MinLength, IsEnum, IsOptional} from 'class-validator'
import{UserType} from '@prisma/client'
/* id                  Int @id @default(autoincrement())
 name                String
 phone               String
 email               String
 password            String*/

 export class UserCreateDto{
    @IsNotEmpty()
    @IsString()
    name:string
    
    @Matches(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {message:'phone must be a valid phone number'})
    phone:string

    @IsEmail()
    email:string

    @MinLength(8)
    password:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    productKey?:string
 }

 export class UserSignInDto{
   @IsEmail()
   email:string
   
   @MinLength(8)
   password:string
 }

 export class keyDto{
   @IsEmail()
   email:string
   @IsEnum(UserType)
   type:UserType
 }