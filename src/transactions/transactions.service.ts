import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }


  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return this.prisma.transaction.findMany();
    // return [
    //   {
    //     id: 1,
    //     comment: 'Transaction 1',
    //     category: 'Income Boomerang',
    //     isIncome: true,
    //     amount: 100,
    //     date: new Date('2023-05-01'),
    //   },
    //   {
    //     id: 2,
    //     comment: 'Transaction 2',
    //     category: 'Sport',
    //     isIncome: false,
    //     amount: 200,
    //     date: new Date('2023-05-02'),
    //   }
    // ]
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
