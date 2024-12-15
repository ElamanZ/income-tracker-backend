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

    if (filter.categoryId) {
      filters.push({
        categoryId: filter.categoryId
      })
    }

    if (filter.fromDate) filters.push({ date: { gte: filter.fromDate } });
    if (filter.toDate) filters.push({ date: { lte: filter.toDate } });

    return this.prisma.transaction.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
      },
      orderBy: {
        date: 'desc',
      },
    })
  }


  async getCategorySummary(filter: TransactionFilterDto, userId: string) {
    const filters: Prisma.TransactionWhereInput[] = [];



    if (filter.isIncome) {
      filters.push({ isIncome: filter.isIncome });
    }
    if (filter.categoryId) {
      filters.push({ categoryId: filter.categoryId });
    }
    if (filter.fromDate) {
      filters.push({ date: { gte: filter.fromDate } });
    }
    if (filter.toDate) {
      filters.push({ date: { lte: filter.toDate } });
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
      },
      include: {
        category: true,
      },
    });

    // Группировка транзакций по категориям
    const result = transactions.reduce((acc, transaction) => {
      const { category } = transaction;
      if (!category) return acc;

      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          color: category.color,
          value: 0,
        };
      }

      acc[category.id].value += transaction.amount;
      return acc;
    }, {});

    return Object.values(result);
  }


  async findExpenses(filter: TransactionFilterDto, userId: string) {

    const filters: Prisma.TransactionWhereInput[] = []

    if (filter.categoryId) {
      filters.push({
        categoryId: filter.categoryId
      })
    }

    if (filter.fromDate) filters.push({ date: { gte: filter.fromDate } });
    if (filter.toDate) filters.push({ date: { lte: filter.toDate } });

    const data = await this.prisma.transaction.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
        isIncome: false,
      }
    })

    const expenses = data.reduce((acc, curr) => acc + curr.amount, 0)

    return expenses
  }

  async findIncomes(filter: TransactionFilterDto, userId: string) {

    const filters: Prisma.TransactionWhereInput[] = []

    if (filter.categoryId) {
      filters.push({
        categoryId: filter.categoryId
      })
    }

    if (filter.fromDate) filters.push({ date: { gte: filter.fromDate } });
    if (filter.toDate) filters.push({ date: { lte: filter.toDate } });

    const data = await this.prisma.transaction.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
        isIncome: true,
      }
    })

    const incomes = data.reduce((acc, curr) => acc + curr.amount, 0)

    return incomes
  }

  findOne(id: string, userId: string) {
    return this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    })
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {

    const existingTransaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingTransaction) {
      throw new Error('Транзакция не найдена');
    }

    const amountDifference = updateTransactionDto.amount - existingTransaction.amount;

    const balanceAdjustment = amountDifference * (updateTransactionDto.isIncome ? 1 : -1);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          increment: balanceAdjustment,
        },
      },
    });

    return this.prisma.transaction.update({
      where: {
        id,
        userId,
      },
      data: updateTransactionDto,
    });
  }

  async remove(id: string, userId: string) {

    const existingTransaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingTransaction) {
      throw new Error('Транзакция не найдена');
    }

    const balanceAdjustment = existingTransaction.amount * (existingTransaction.isIncome ? -1 : 1);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          increment: balanceAdjustment,
        },
      },
    });

    return this.prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
