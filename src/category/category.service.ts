import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'nestjs-prisma';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
    })
  }

  findAll(filter: CategoryFilterDto, userId: string) {

    const filters: Prisma.CategoryWhereInput[] = []

    if (filter.name) {
      filters.push({
        name: filter.name
      })
    }

    if (filter.isIncome) {
      filters.push({
        isIncome: filter.isIncome
      })
    }

    return this.prisma.category.findMany({
      where: {
        userId,
        AND: filters.length > 0 ? filters : undefined,
      }
    })
  }

  async findGrouped(userId: string): Promise<Record<string, any[]>> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
    });

    const grouped = {
      income: categories.filter((category) => category.isIncome),
      expense: categories.filter((category) => !category.isIncome),
    };

    return grouped;
  }

  findOne(id: string, userId: string) {
    return this.prisma.category.findUnique({
      where: {
        userId,
        id,
      },
    })
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    return this.prisma.category.update({
      where: {
        userId,
        id,
      },
      data: updateCategoryDto,
    })
  }

  remove(id: string, userId: string) {
    return this.prisma.category.delete({
      where: {
        userId,
        id,
      },
    })
  }
}
