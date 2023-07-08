import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, NotFoundException, Res} from '@nestjs/common';
import { Response } from 'express';

import { CatsService } from './cats.service';
import { Cat } from './cat.entity';

@Controller('cat')

export class CatsController {

    constructor(private readonly catsService: CatsService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() cat: Cat): Promise<Cat> {
        return this.catsService.create(cat);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Cat> {
        const user = await this.catsService.findOne(id);
        if (!user) {
            throw new NotFoundException('User does not exist!');
        } else {
            return user;
        }
    }


    @Put(':id')
    async update(@Param('id') id: number, @Body() user: Cat): Promise<any> {
        return this.catsService.update(id, user);
    }


    @Delete(':id')
    async delete(@Res() res: Response, @Param('id') id: number): Promise<any> {
        //handle error if user does not exist
        const cat = await this.catsService.findOne(id);
        if (!cat) {
            throw new NotFoundException('Cat does not exist!');
        }
        this.catsService.delete(id)
        return res.status(HttpStatus.OK).json({ message: `Succesfully deleted` });
    }

}