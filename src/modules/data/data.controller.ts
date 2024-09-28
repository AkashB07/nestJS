import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/passport/jwt/jwt.guard';
import { Messages } from 'src/common/constants/message.constant';
import { DataService } from './data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { UpdateDataDto } from './dto/update-data.dto';

@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('data')
export class DataController {
    constructor(
        private readonly dataService: DataService,
    ) { }

    @Post()
    async createListGroup(
        @Req() req,
        @Res() res,
        @Body() createDataDto: CreateDataDto,
    ) {
        const result = await this.dataService.create(
            createDataDto,
            req.user.id,
        );
        return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            message: Messages.CREATE_SUCCESS,
            data: { ...result },
        });
    }

    @Get(':id')
    async findById(@Res() res, @Param('id') id: number) {
        const result = await this.dataService.findById(id);
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: Messages.DATA_FOUND,
            data: { ...result },
        });
    }

    @Patch(':id')
    async update(
        @Req() req,
        @Res() res,
        @Param('id') id: number,
        @Body() updateDataDto: UpdateDataDto,
    ) {
        const result = await this.dataService.update(
            id,
            updateDataDto,
            req.user?.id,
        );
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: Messages.UPDATED_SUCCESS,
            data: { ...result },
        });
    }
}
