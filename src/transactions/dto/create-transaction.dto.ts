import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { dateString } from "src/utils/schemes/dateString.schema";
import { z } from "zod";

export const createTransactionSchema = z.object({
    comment: z.string().optional(),
    isIncome: z.boolean(),
    amount: z.number().min(1),
    date: dateString,
    categoryId: z.string(),
})

export class CreateTransactionDto implements z.output<typeof createTransactionSchema> {
    static schema = createTransactionSchema;
    static isZodDto = true;

    @ApiPropertyOptional()
    comment?: string;
    @ApiProperty()
    isIncome!: boolean;
    @ApiProperty()
    amount!: number;
    @ApiProperty()
    date!: Date;
    @ApiProperty()
    categoryId!: string;
}
