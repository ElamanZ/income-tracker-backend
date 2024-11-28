import { createZodDto } from 'libs/pipes/src';
import { jwtUserEntitySchema } from "./jwt-user.entity";

export const jwtRefreshEntitySchema = jwtUserEntitySchema;

export class JwtRefreshEntity extends createZodDto(jwtRefreshEntitySchema) { }
