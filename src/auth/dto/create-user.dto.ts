import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { first } from "rxjs";
import { parsePhoneNumberSchema } from "src/utils/schemes/parsePhoneNumber.schema";
import { z } from "zod";


export const createUserSchema = z.object({
    firstName: z.string().nonempty('Имя не должно быть пустым'),
    lastName: z.string().nonempty('Фамилия не должна быть пустой'),
    phone: parsePhoneNumberSchema,
    avatarUrl: z.string().url('Некорректный URL аватара').optional().nullable(),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    passwordConfirm: z.string().min(6, 'Подтверждение пароля должно содержать минимум 6 символов'),
}).refine(
    (data) => data.password === data.passwordConfirm,
    {
        message: 'Пароли не совпадают',
        path: ['passwordConfirm'],
    }
);




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
    @ApiProperty()
    passwordConfirm!: string;
    @ApiPropertyOptional()
    avatarUrl?: string;
}
