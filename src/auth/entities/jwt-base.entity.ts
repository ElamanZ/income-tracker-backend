import { createZodDto } from 'libs/pipes/src';
import { z } from 'zod';

export const jwtBaseEntitySchema = z.object({
  iss: z.string(),
  sub: z.string(),
  aud: z.string().array().optional(),
  iat: z.number(),
  exp: z.number(),
  nbf: z.number().optional(),
  jti: z.string(),
});

export class JwtBaseEntity extends createZodDto(jwtBaseEntitySchema) { }
