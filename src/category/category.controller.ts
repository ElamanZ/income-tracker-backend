import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CurrentUser } from 'src/auth/cummon/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(
    @CurrentUser('uid') userId: string,
    @Query() filter: CategoryFilterDto,
  ) {
    return this.categoryService.findAll(filter, userId);
  }

  @Get('grouped')
  findGrouped(
    @CurrentUser('uid') userId: string,
  ): Promise<Record<string, any[]>> {
    return this.categoryService.findGrouped(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.categoryService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.categoryService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.categoryService.remove(id, userId);
  }
}
