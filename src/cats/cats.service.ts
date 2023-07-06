import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cat } from './cat.entity';
// import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {

    constructor(
      @InjectRepository(Cat)
      private catRepository: Repository<Cat>,
    ) {}

    async create(cat: Partial<Cat>): Promise<Cat> {
      const newcat = this.catRepository.create(cat);
      return this.catRepository.save(newcat);
    }

    async findAll(): Promise<Cat[]> {
      return this.catRepository.find();
    }

    async findOne(id: number): Promise<Cat> {
      return this.catRepository.findOne({ where: { id } });
    }

    async update(id: number, cat: Partial<Cat>): Promise<Cat> {
      await this.catRepository.update(id, cat);
      return this.catRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
      await this.catRepository.delete(id);
    }
}
