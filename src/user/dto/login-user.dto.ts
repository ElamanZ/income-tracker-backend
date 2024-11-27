import { ApiProperty } from "@nestjs/swagger";
import { parseKgPhoneNumberSchema, parsePhoneNumberSchema } from "src/utils/schemes/parsePhoneNumber.schema";
import { z } from "zod";

export const LoginUserSchema = z.object({
    phone: parseKgPhoneNumberSchema,
    password: z.string().min(6),
});

export class LoginUserDto implements z.infer<typeof LoginUserSchema> {
    static schema = LoginUserSchema;
    static isZodDto = true;

    @ApiProperty()
    phone!: string
    @ApiProperty()
    password!: string

}