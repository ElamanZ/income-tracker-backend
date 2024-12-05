import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'nestjs-prisma';
import { DebtsFilterDto } from './dto/debts-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createDebtDto: CreateDebtDto, userId: string) {
    return this.prisma.debts.create({
      data: {
        ...createDebtDto,
        userId
      }
    })
  }

  findAll(filter: DebtsFilterDto) {

    const filters: Prisma.DebtsWhereInput[] = []

    if (filter.active) {
      filters.push({
        active: filter.active
      })
    }

    if (filter.amount) {
      filters.push({
        amount: filter.amount
      })
    }

    if (filter.isMyDebt) {
      filters.push({
        isMyDebt: filter.isMyDebt
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

    return this.prisma.debts.findMany({
      where: {
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

  update(id: string, userId: string, updateDebtDto: UpdateDebtDto) {
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
