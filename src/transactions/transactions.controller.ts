import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { CurrentUser } from 'src/auth/cummon/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser('uid') userId: string
  ) {
    console.log(userId);

    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Get()
  findAll(
    @Query() filter: TransactionFilterDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.findAll(filter, userId);
  }

  @Get('/expenses')
  findExpenses(
    @Query() filter: TransactionFilterDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.findExpenses(filter, userId);
  }

  @Get('/incomes')
  findIncomes(
    @Query() filter: TransactionFilterDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.findIncomes(filter, userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.update(id, updateTransactionDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.transactionsService.remove(id, userId);
  }
}
