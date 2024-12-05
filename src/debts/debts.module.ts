import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [JwtModule],
  controllers: [DebtsController],
  providers: [DebtsService, PrismaService],
})
export class DebtsModule { }
