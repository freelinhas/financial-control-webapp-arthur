import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/response-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto, userId: number): Promise<TransactionResponseDto> {
    if (!userId) {
      throw new NotFoundException('Usuário não encontrado');
    }
  
    const transaction = this.transactionRepo.create({
      description: dto.description,
      value: dto.value,
      type: dto.type,
      user: { id: userId },
      category: { id: dto.categoryId },
    });
  
    const saved = await this.transactionRepo.save(transaction);
  
    const result = await this.transactionRepo.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });
  
    if (!result) {
      throw new NotFoundException('Transação não encontrada após salvar');
    }
  
    return {
      id: result.id,
      description: result.description,
      value: result.value,
      type: result.type,
      date: result.date,
      userId,
      category: {
        id: result.category.id,
        name: result.category.name,
      },
    };
  }

  async findAll(
    userId: number,
    month?: number,
    year?: number,
    limit = 10,
    page = 1,
    sortBy = 'date',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{ data: TransactionResponseDto[]; total: number }> {
    const qb = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId })
  
    if (month && year) {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 0, 23, 59, 59, 999)
      qb.andWhere('transaction.date BETWEEN :start AND :end', { start, end })
    }

    const total = await qb.clone().getCount()

    const transactions = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`transaction.${sortBy}`, sortOrder)
      .getMany()
  
    const data = transactions.map((t) => ({
      id: t.id,
      description: t.description,
      value: t.value,
      type: t.type,
      date: t.date,
      userId,
      category: {
        id: t.category.id,
        name: t.category.name,
      },
    }))
  
    return { data, total }
  }

  async findOne(id: number, userId: number): Promise<TransactionResponseDto> { 
    const transaction = await this.transactionRepo.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['category', 'user'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return {
      id: transaction.id,
      description: transaction.description,
      value: transaction.value,
      type: transaction.type,
      date: transaction.date,
      userId: transaction.user.id,
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
      },
    };
  }

  async update(id: number, dto: UpdateTransactionDto, userId: number): Promise<UpdateResult> {
    await this.findOne(id, userId);
    return this.transactionRepo.update(id, dto);
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    await this.findOne(id, userId);
    return this.transactionRepo.delete(id);
  }

  async getBalanceByUser(userId: number, month?: number, year?: number): Promise<{ income: number, expense: number, balance: number }> {
    const qb = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });
  
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      qb.andWhere('transaction.date BETWEEN :start AND :end', { start, end });
    }
  
    const transactions = await qb.getMany();
  
    const balance = transactions.reduce(
      (acc, t) => {
        if (t.type === 'ENTRY') acc.income += t.value;
        if (t.type === 'EXIT') acc.expense += t.value;
        return acc;
      },
      { income: 0, expense: 0 },
    );

    const round = (valor: number) => Math.round(valor * 100) / 100;
  
    return {
      income: round(balance.income),
      expense: round(balance.expense),
      balance: round(balance.income - balance.expense),
    };
  }  
}