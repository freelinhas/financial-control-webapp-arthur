import { Controller, Post, Get, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TransactionResponseDto } from './dto/response-transaction.dto';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @UserId() userId: number): Promise<TransactionResponseDto> {
    return this.transactionService.create(dto, userId);
  }

  @Get()
  findAll(
    @UserId() userId: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('limit') limit?: number,
  ): Promise<TransactionResponseDto[]> {
    const m = month ? parseInt(month, 10) : undefined;
    const y = year ? parseInt(year, 10) : undefined;
    return this.transactionService.findAll(userId, m, y, limit);
  }

  @Get('/balance')
  getBalance(
    @UserId() userId: number,
    @Query('month') month?: string,
    @Query('year') year?: string
  ) {
    const m = month ? parseInt(month, 10) : undefined;
    const y = year ? parseInt(year, 10) : undefined;
    return this.transactionService.getBalanceByUser(userId, m, y);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: number): Promise<TransactionResponseDto> {
    return this.transactionService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto, @UserId() userId: number): Promise<UpdateResult> {
    return this.transactionService.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: number): Promise<DeleteResult> {
    return this.transactionService.remove(+id, userId);
  }
}
