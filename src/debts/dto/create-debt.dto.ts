import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { dateString } from "src/utils/schemes/dateString.schema";
import { z } from "zod";


export const createDebtSchema = z.object({
    isMyDebt: z.boolean().default(true),
    active: z.boolean().default(true),
    amount: z.number().default(0),
    name: z.string(),
    comment: z.string().optional(),
    date: dateString,
})

export class CreateDebtDto
    implements z.output<typeof createDebtSchema> {
    static schema = createDebtSchema;
    static isZodDto = true;

    @ApiProperty()
    isMyDebt!: boolean;
    @ApiProperty()
    active!: boolean;
    @ApiProperty()
    amount!: number;
    @ApiProperty()
    name!: string;
    @ApiPropertyOptional()
    comment?: string;
    @ApiProperty()
    date!: Date;
}
