import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string(),
    isIncome: z.boolean(),
})

export class CreateCategoryDto
    implements z.output<typeof createCategorySchema> {
    static schema = createCategorySchema;
    static isZodDto = true;

    @ApiProperty()
    name!: string;
    @ApiProperty()
    isIncome!: boolean;
}