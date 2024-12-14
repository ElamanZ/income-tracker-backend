import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'nestjs-prisma';
import { DebtsFilterDto } from './dto/debts-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDebtDto: CreateDebtDto, userId: string) {

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        balance: {
          increment: createDebtDto.amount * (createDebtDto.isMyDebt ? 1 : -1),
        }
      }
    })

    return this.prisma.debts.create({
      data: {
        ...createDebtDto,
        userId
      }
    })
  }

  findAll(filter: DebtsFilterDto, userId: string) {

    const filters: Prisma.DebtsWhereInput[] = []



    if (filter.active !== 'all') {
      filters.push({
        active: filter.active === 'true'
      })
    }

    if (filter.amount) {
      filters.push({
        amount: filter.amount
      })
    }

    if (filter.isMyDebt !== 'all') {
      filters.push({
        isMyDebt: filter.isMyDebt === 'true'
      })
    }

    if (filter.search) {
      filters.push({
        OR: [
          { name: { contains: filter.search } },
          { comment: { contains: filter.search } },
        ],
      });
    }

    if (filter.fromDate) filters.push({ date: { gte: filter.fromDate } });
    if (filter.toDate) filters.push({ date: { lte: filter.toDate } });


    return this.prisma.debts.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
      }
    })
  }

  findOne(id: string, userId: string) {
    return this.prisma.debts.findUnique({
      where: {
        userId,
        id
      }
    })
  }

  async update(id: string, userId: string, updateDebtDto: UpdateDebtDto) {

    const existingDebt = await this.prisma.debts.findUnique({
      where: {
        id,
      },
    });

    if (!existingDebt) {
      throw new Error('Долг не найден');
    }

    const isBecomingInactive = existingDebt.active && updateDebtDto.active === false;
    const isBecomingActive = !existingDebt.active && updateDebtDto.active === true;

    if (isBecomingInactive) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: existingDebt.amount * (existingDebt.isMyDebt ? -1 : 1),
          },
        },
      });
    } else if (isBecomingActive) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: existingDebt.amount * (existingDebt.isMyDebt ? 1 : -1),
          },
        },
      });
    }

    return this.prisma.debts.update({
      where: {
        userId,
        id,
      },
      data: updateDebtDto
    })
  }

  remove(id: string, userId: string) {
    return this.prisma.debts.delete({
      where: {
        userId,
        id,
      },
    })
  }
}
