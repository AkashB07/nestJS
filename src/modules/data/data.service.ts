import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Messages } from 'src/common/constants/message.constant';
import { CreateDataDto } from './dto/create-data.dto';
import { UpdateDataDto } from './dto/update-data.dto';

@Injectable()
export class DataService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(createDataDto: CreateDataDto, user_id: string) {
        const { rule, category_of_law, ...rest } = createDataDto;
        let insertData: any = {
            ...rest,
            ...(rule && { rule: { connect: { id: rule } } }),
            ...(category_of_law && { category_of_law: { connect: { id: category_of_law } } }),
            created_by: {
                connect: { id: user_id },
            },
        };

        const data = await this.prisma.data.create({
            data: insertData,
        });
        return this.findById(data.id);
    }

    async findById(id: number) {
        const data = await this.prisma.data.findUnique({
            where: { id: id },
            include: {
                category_of_law: true,
                rule: true,
                created_by: true,
                updated_by: true,
            },
        });

        if (!data) {
            throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return data;
    }

    async update(
        id: number,
        updateDataDto: UpdateDataDto,
        user_id: string,
    ) {
        await this.findById(id);
        const { rule, category_of_law, ...rest } = updateDataDto;

        const updateData: any = {
            ...rest,
            ...(rule && { rule: { connect: { id: rule } } }),
            ...(category_of_law && { category_of_law: { connect: { id: category_of_law } } }),
            updated_by: {
                connect: { id: user_id },
            },
        }
        await this.prisma.data.update({
            where: { id },
            data: updateData,
        });
        return await this.findById(id);
    }
}
