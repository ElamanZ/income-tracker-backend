import { ApiPropertyOptional } from "@nestjs/swagger";
import { dateString } from "../../utils/schemes/dateString.schema";
import { z } from "zod";

export const transactionFilterSchema = z.object({
    comment: z.string().optional(),
    isIncome: z.enum(['all', 'true', 'false']).default('all'),
    amount: z.number().optional(),
    categoryId: z.string().optional(),
    date: dateString.optional(),
    fromDate: dateString.optional(),
    toDate: dateString.optional(),
})

export class TransactionFilterDto
    implements z.output<typeof transactionFilterSchema> {
    static schema = transactionFilterSchema;
    static isZodDto = true;

    @ApiPropertyOptional()
    comment?: string;
    @ApiPropertyOptional()
    isIncome?: 'all' | 'true' | 'false';
    @ApiPropertyOptional()
    amount?: number;
    @ApiPropertyOptional()
    categoryId?: string;
    @ApiPropertyOptional()
    date?: Date;
    @ApiPropertyOptional()
    fromDate?: Date;
    @ApiPropertyOptional()
    toDate?: Date;
}