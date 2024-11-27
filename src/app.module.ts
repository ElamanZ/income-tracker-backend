import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TransactionsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
