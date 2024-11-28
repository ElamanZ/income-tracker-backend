import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodTypeDef } from 'zod';
import { ZodDto, isZodDto } from './zod.dto';
import { ZodValidationException } from './zod.exception';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schemaOrDto?: ZodSchema | ZodDto) { }

  public transform(value: unknown, metadata: ArgumentMetadata) {
    if (this.schemaOrDto) {
      return this.validate(value, this.schemaOrDto);
    }

    const { metatype } = metadata;

    if (!isZodDto(metatype)) {
      return value;
    }

    return this.validate(value, metatype.schema);
  }

  validate<
    TOutput = any,
    TDef extends ZodTypeDef = ZodTypeDef,
    TInput = TOutput,
  >(
    value: unknown,
    schemaOrDto:
      | ZodSchema<TOutput, TDef, TInput>
      | ZodDto<TOutput, TDef, TInput>,
  ) {
    const schema = isZodDto(schemaOrDto) ? schemaOrDto.schema : schemaOrDto;

    const result = schema.safeParse(value);

    if (!result.success) {
      throw new ZodValidationException(result.error);
    }

    return result.data;
  }
}
