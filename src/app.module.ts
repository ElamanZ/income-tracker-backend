import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [TransactionsModule, AuthModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
