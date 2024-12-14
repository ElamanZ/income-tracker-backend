import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { dateString } from "src/utils/schemes/dateString.schema";
import { z } from "zod";


export const debtsFilterSchema = z.object({
    search: z.string().optional(),
    active: z.enum(['all', 'true', 'false']).default('true'),
    isMyDebt: z.enum(['all', 'true', 'false']).default('true'),
    amount: z.number().optional(),
    date: dateString.optional(),
    fromDate: dateString.optional(),
    toDate: dateString.optional(),
})

export class DebtsFilterDto
    implements z.output<typeof debtsFilterSchema> {
    static schema = debtsFilterSchema;
    static isZodDto = true;

    @ApiPropertyOptional({ example: '' })
    search?: string;
    @ApiPropertyOptional()
    active!: 'all' | 'true' | 'false';
    @ApiPropertyOptional()
    isMyDebt?: 'all' | 'true' | 'false';
    @ApiPropertyOptional({ example: 0 })
    amount?: number;
    @ApiPropertyOptional()
    date?: Date;
    @ApiPropertyOptional()
    fromDate?: Date;
    @ApiPropertyOptional()
    toDate?: Date;
}