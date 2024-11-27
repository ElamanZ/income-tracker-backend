import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TransactionsModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
