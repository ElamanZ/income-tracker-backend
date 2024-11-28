import { ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";

export const transactionFilterSchema = z.object({
    comment: z.string().optional(),
    isIncome: z.boolean().optional(),
    amount: z.number().optional(),
    date: z.date().optional(),
    category: z.string().optional(),
})

export class TransactionFilterDto
    implements z.output<typeof transactionFilterSchema> {
    static schema = transactionFilterSchema;
    static isZodDto = true;

    @ApiPropertyOptional()
    comment?: string;
    @ApiPropertyOptional()
    isIncome?: boolean;
    @ApiPropertyOptional()
    amount?: number;
    @ApiPropertyOptional()
    date?: Date;
    @ApiPropertyOptional()
    category?: string;
}