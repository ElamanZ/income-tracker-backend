import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/cummon/decorators/current-user.decorator';
import { DebtsFilterDto } from './dto/debts-filter.dto';

@ApiBearerAuth()
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) { }

  @Post()
  create(
    @Body() createDebtDto: CreateDebtDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.debtsService.create(createDebtDto, userId);
  }

  @Get()
  findAll(
    @Query() filter: DebtsFilterDto
  ) {
    return this.debtsService.findAll(filter);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.debtsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @CurrentUser('uid') userId: string
  ) {
    return this.debtsService.update(id, userId, updateDebtDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string
  ) {
    return this.debtsService.remove(id, userId);
  }
}
