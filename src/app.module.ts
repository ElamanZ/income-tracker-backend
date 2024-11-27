// import { Module } from '@nestjs/common';
// import { TransactionsModule } from './transactions/transactions.module';
// import { UserModule } from './user/user.module';

// @Module({
//   imports: [TransactionsModule, UserModule],
//   controllers: [],
//   providers: [],
// })
// export class AppModule { }

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from './user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    TransactionsModule,
    UserModule,
  ],
  providers: [PrismaService, UserService],
})
export class AppModule { }
