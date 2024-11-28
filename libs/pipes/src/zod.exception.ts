import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class ZodValidationException extends BadRequestException {
  constructor(private error: ZodError) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: error.errors,
      flattened: error.flatten(),
      formated: error.format(),
    });
  }

  public getZodError() {
    return this.error;
  }
}
