import { createZodDto } from 'libs/pipes/src';
import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  uid: z.string().min(1),
});


export class JwtPayload extends createZodDto(jwtPayloadSchema) { }
