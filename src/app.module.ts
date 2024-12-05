import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DebtsModule } from './debts/debts.module';

@Module({
  imports: [TransactionsModule, AuthModule, CategoryModule, DebtsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
