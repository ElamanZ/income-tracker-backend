import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { first } from "rxjs";
import { parsePhoneNumberSchema } from "src/utils/schemes/parsePhoneNumber.schema";
import { z } from "zod";


export const createUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: parsePhoneNumberSchema,
    password: z.string().min(6),
    avatarUrl: z.string().optional(),
})




export class CreateUserDto implements z.output<typeof createUserSchema> {
    static schema = createUserSchema;
    static isZodDto = true;

    @ApiProperty()
    firstName!: string;
    @ApiProperty()
    lastName!: string;
    @ApiProperty()
    phone!: string;
    @ApiProperty()
    password!: string;
    @ApiPropertyOptional()
    avatarUrl?: string;
}
