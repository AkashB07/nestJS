import { Controller, Get, Query, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Headers, Res } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto.';
import { Response } from 'express';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cat')

export class CatsController {

    constructor(private catsService: CatsService) { }

    @Post()
    @HttpCode(201)
    create(@Res() res: Response, @Body() cat: CreateCatDto,  @Headers() auth: string) {
        this.catsService.create(cat);
        console.log(auth);
        // return `${cat}`;
        res.status(HttpStatus.CREATED).json({ cat });
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }


    // @Get()
    // findAll(@Res() res: Response, @Query() query: any) {
    //     // return `This action returns all cats (limit: ${query.limit} items)`;
    //     res.status(HttpStatus.OK).send(`This action returns all cats (limit: ${query.limit} items)`)
    // }

    @Get(':id')
    findOne(@Res() res: Response, @Param('id') id: string) {
        // return `This action returns a #${id} cat`;
        res.status(HttpStatus.OK).send(`This action returns a #${id} cat`);
    }

    @Put(':id')
    update(@Res() res: Response, @Param('id') id: string, @Body() updateCatDto: CreateCatDto) {
        console.log(updateCatDto)
        // return `This action updates a #${id} cat`;
        res.status(HttpStatus.OK).json({ updateCatDto });
    }

    @Delete(':id')
    remove(@Res() res: Response, @Param('id') id: string) {
        // return `This action removes a #${id} cat`;
        res.status(HttpStatus.OK).send(`This action removes a #${id} cat`);
    }

}
