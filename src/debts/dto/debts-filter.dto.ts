import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";


export const debtsFilterSchema = z.object({
    search: z.string().optional(),
    active: z.boolean().optional(),
    isMyDebt: z.boolean().optional(),
    amount: z.number().optional(),
})

export class DebtsFilterDto
    implements z.output<typeof debtsFilterSchema> {
    static schema = debtsFilterSchema;
    static isZodDto = true;

    @ApiPropertyOptional({ example: '' })
    search?: string;
    @ApiPropertyOptional()
    active?: boolean;
    @ApiPropertyOptional()
    isMyDebt?: boolean;
    @ApiPropertyOptional({ example: 0 })
    amount?: number;
}