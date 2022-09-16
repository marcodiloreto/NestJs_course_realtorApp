import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType, User } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

interface SignUp {
    name: string,
    email: string,
    password: string,
    phone: string,
}

interface SingIn {
    email: string,
    password: string
}

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) { }

    async signUp({ name, phone, email, password }: SignUp,type:UserType) {
        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (userExists) throw new PreconditionFailedException('user with that Email already registered');

        const passHash = await bcrypt.hash(password, 4)

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: passHash,
                type,
            }
        })

        return this.generateJWT(user);
    }

    async signIn({email,password}: SingIn) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (!user) throw new PreconditionFailedException('user does not exist')

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) throw new PreconditionFailedException('wrong password')

        return this.generateJWT(user);
    }

    async generateKey(email,type){
        return await bcrypt.hash(`${email}-${type}-${process.env.KEY_SECRET}`,10)
    }

    generateJWT(user:User){
       return jwt.sign({
            id: user.id,
            name: user.name,
            type: user.type,
        },
            process.env.JWT_SECRET, {
            expiresIn: 36000
        })
    }
}
