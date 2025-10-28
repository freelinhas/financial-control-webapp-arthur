import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>
  ) {}

  create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({
      select: ['id', 'name', 'type', 'createdAt'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.categoryRepo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.categoryRepo.delete(id);
  }

  async getCategoriesWithTotals(): Promise<{ name: string; type: string; total: number }[]> {
  const categories = await this.categoryRepo.find()

  const result = await Promise.all(
    categories.map(async (category) => {
      const total = await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('SUM(transaction.value)', 'sum')
        .where('transaction.categoryId = :categoryId', { categoryId: category.id })
        .andWhere('transaction.type = :type', { type: category.type })
        .getRawOne()

      return {
        name: category.name,
        type: category.type,
        total: Number(total?.sum) || 0,
      }
    })
  )

  return result
}

}
