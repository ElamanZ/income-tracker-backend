import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";


export const categoryFilterSchema = z.object({
    name: z.string().optional(),
    isIncome: z.boolean().optional(),
})

export class CategoryFilterDto
    implements z.output<typeof categoryFilterSchema> {
    static schema = categoryFilterSchema;
    static isZodDto = true;

    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    isIncome?: boolean;
}