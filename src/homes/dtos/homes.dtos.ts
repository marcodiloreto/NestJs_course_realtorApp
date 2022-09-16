import { PropertyType } from "@prisma/client"
import {Exclude, Expose, Type} from 'class-transformer'
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested , IsOptional} from "class-validator"

export class CreateHomeDto{
    @IsString()
    @IsNotEmpty()
    address:string

    @IsNumber()
    @IsPositive()
    numBathrooms:number

    @IsNumber()
    @IsPositive()
    numBedrooms:number

    @IsNumber()
    @IsPositive()
    price:number

    @IsNumber()
    @IsPositive()
    landSize:number

    @IsEnum(PropertyType)
    type:PropertyType

    @IsArray()
    @ValidateNested({each:true})
    @Type(() => Image)
    images:Image[]

    //@IsNumber()
    //@IsPositive()
    //realtor_id:number
}

export class UpdateHomeDto{
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?:string

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numBathrooms?:number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numBedrooms?:number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?:number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize?:number

    @IsOptional()
    @IsEnum(PropertyType)
    type?:PropertyType

}

class Image{
    @IsString()
    @IsNotEmpty()
    url:string
}



export class HomeClientDto{

constructor(partial:Partial<HomeClientDto>){
    Object.assign(this,partial);
}

    id:number
    address:string
    
    @Exclude()
    num_bathrooms:number
    @Expose()
    get numBathrooms():number{
        return this.num_bathrooms
    }

    @Exclude()
    num_bedrooms:number
    @Expose()
    get numBedrooms():number{
        return this.num_bedrooms
    }

    price:number
    
    @Exclude()
    land_size:number
    @Expose()
    get landSize(){
        return this.land_size
    }

    type:PropertyType
    image:string
    @Exclude()
    created_at:Date
    @Expose()
    get listedDate(){
        return this.created_at
    }
    @Exclude()
    updated_at:Date
    
    @Exclude()
    user_id:number
    @Expose()
    get realtorId(){
        return this.user_id
    }
}
    export class inquireDto{

        @IsString()
        @IsNotEmpty()
        message:string

    }
