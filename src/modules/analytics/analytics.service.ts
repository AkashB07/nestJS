import { 
    HttpException, 
    HttpStatus, 
    Injectable,
 } from '@nestjs/common';
import { Analytics } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Messages } from 'src/common/constants/message.constant';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { componentsShowColumns } from './utils/components.utils';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    getShowHideColumn() {
        return componentsShowColumns;
    }

    async create(user: any, createAnalyticsDto: CreateAnalyticsDto): Promise<Analytics> {
        const createAnalyticsData: any = {
            ...createAnalyticsDto,
            created_by: {
                connect: { id: user.id },
            },
        }

        const analytics = await this.prisma.analytics.create({
            data: createAnalyticsData,
        });

        return await this.findById(analytics.id);
    }

    async update(
        user: any,
        id: string,
        updateAnalyticsDto: UpdateAnalyticsDto,
    ): Promise<Analytics> {
        const updateAnalyticsData: any = {
            ...updateAnalyticsDto,
            updated_by: user.id,
        };

        await this.prisma.analytics.update({
            where: { id },
            data: {
              ...updateAnalyticsData,
            },
          });

        return await this.findById(id);
    }

    async findById(id: string): Promise<Analytics> {
        const analytics = await this.prisma.analytics.findUnique({
            where: { id: id },
            include: {
                components: true,
                created_by: true,
            },
        });

        if (!analytics) {
            throw new HttpException(
                Messages.DATA_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        return analytics;
    }

}
