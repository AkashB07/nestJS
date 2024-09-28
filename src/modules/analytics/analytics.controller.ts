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
import { AnalyticsService } from './analytics.service';
import { Messages } from 'src/common/constants/message.constant';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
    ) { }

    @Get('show-hide-column')
    async getShowHideColumn(@Res() res) {
        const result = await this.analyticsService.getShowHideColumn();
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: Messages.DATA_FOUND,
            data: { ...result },
        });
    }

    @Post()
    async create(
        @Res() res,
        @Req() req,
        @Body() createAnalyticsDto: CreateAnalyticsDto,
    ) {
        try {
            const analytics = await this.analyticsService.create(
                req.user,
                createAnalyticsDto,
            );
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: Messages.CREATE_SUCCESS,
                data: { ...analytics },
            });
        } catch (error) {
            console.log(error)
        }
    }

    // @Patch(':id')
    // async update(
    //     @Req() req,
    //     @Res() res,
    //     @Param('id') id: string,
    //     @Body() updateDashboardDto: UpdateDashboardDto,
    // ) {
    //     const dashboard = await this.dashboardService.update(
    //         req.user,
    //         id,
    //         updateDashboardDto,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.UPDATED_SUCCESS,
    //         data: { ...analytics },
    //     });
    // }

    // @Get(':id')
    // async findById(@Res() res, @Param('id') id: string) {
    //     const analytics = await this.analyticsService.findById(id);
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.DATA_FOUND,
    //         data: { ...analytics },
    //     });
    // }

    // @Get()
    // async findAll(
    //     @Res() res,
    //     @Query() findAllAnalyticsQueryDTO: FindAllAnalyticsQueryDTO,
    // ) {
    //     const analytics = await this.analyticsService.findAll(
    //         findAllAnalyticsQueryDTO,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.DATA_FOUND,
    //         data: analytics,
    //     });
    // }

    // @Delete(':id')
    // async remove(@Res() res, @Param('id') id: string) {
    //     await this.analyticsService.remove(id);
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.DELETED_SUCCESS,
    //         data: {},
    //     });
    // }

    // @Post('components')
    // async createComponents(
    //     @Res() res,
    //     @Req() req,
    //     @Body() createComponentsDto: CreateComponentsDto,
    // ) {
    //     const analytics = await this.analyticsService.createComponents(
    //         req.user,
    //         createComponentsDto,
    //     );
    //     return res.status(HttpStatus.CREATED).json({
    //         statusCode: HttpStatus.CREATED,
    //         message: Messages.CREATE_SUCCESS,
    //         data: { ...analytics },
    //     });
    // }

    // @Patch('components/:id')
    // async updateComponents(
    //     @Req() req,
    //     @Res() res,
    //     @Param('id') id: string,
    //     @Body() updateComponentsDto: UpdateComponentsDto,
    // ) {
    //     // try {
    //     const user_guide = await this.analyticsService.updateComponents(
    //         req.user,
    //         id,
    //         updateComponentsDto,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.UPDATED_SUCCESS,
    //         data: { ...user_guide },
    //     });
    // // } catch (error) {
    // //     console.log(error)
    // // }
    // }

    // @Get('components/:id')
    // async findComponentById(@Res() res, @Param('id') id: string) {
    //     const component = await this.analyticsService.findComponentById(id);
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.DATA_FOUND,
    //         data: { ...component },
    //     });
    // }

    // @Delete('components/:id')
    // async removeComponent(@Res() res, @Param('id') id: string) {
    //     await this.analyticsService.removeComponent(id);
    //     return res.status(HttpStatus.OK).json({
    //         statusCode: HttpStatus.OK,
    //         message: Messages.DELETED_SUCCESS,
    //         data: {},
    //     });
    // }

    // @Get('components/dashboard/:id')
    // async findOneDashboardComponent(
    //     @Res() res,
    //     @Param('id') id: string,
    //     @Query() findComponentQueryDTO: FindComponentQueryDTO,
    // ) {
    //     try {
    //         const component = await this.analyticsService.findOneDashboardComponent(id, findComponentQueryDTO);
    //         return res.status(HttpStatus.OK).json({
    //             statusCode: HttpStatus.OK,
    //             message: Messages.DATA_FOUND,
    //             data: { ...component },
    //         });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}
