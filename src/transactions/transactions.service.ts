import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }


  async create(createTransactionDto: CreateTransactionDto, userId: string) {

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        balance: {
          increment: createTransactionDto.amount * (createTransactionDto.isIncome ? 1 : -1),
        }
      }
    })

    return this.prisma.transaction.create({
      data: {
        userId,
        ...createTransactionDto,
      },
    })
  }

  findAll(filter: TransactionFilterDto, userId: string) {

    const filters: Prisma.TransactionWhereInput[] = []

    if (filter.comment) {
      filters.push({
        comment: filter.comment
      })
    }

    if (filter.isIncome) {
      filters.push({
        isIncome: filter.isIncome
      })
    }

    if (filter.amount) {
      filters.push({
        amount: filter.amount
      })
    }

    if (filter.date) {
      filters.push({
        date: filter.date
      })
    }

    if (filter.category) {
      filters.push({
        categoryId: filter.category
      })
    }

    return this.prisma.transaction.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
      }
    })
  }

  findOne(id: string, userId: string) {
    return this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    })
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    return this.prisma.transaction.update({
      where: {
        id,
        userId,
      },
      data: updateTransactionDto,
    })
  }

  remove(id: string, userId: string) {
    return this.prisma.transaction.delete({
      where: {
        id,
        userId
      },
    })
  }
}
