import { createZodDto } from 'libs/pipes/src';
import { jwtBaseEntitySchema } from './jwt-base.entity';
import { jwtPayloadSchema } from './jwt-payload.entity';

export const jwtUserEntitySchema = jwtBaseEntitySchema.merge(jwtPayloadSchema);

export class JwtUserEntity extends createZodDto(jwtUserEntitySchema) { }
