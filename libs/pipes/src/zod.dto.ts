import { z, ZodSchema, ZodTypeDef } from 'zod';

export interface ZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
> {
  new(input: unknown): TOutput;
  isZodDto: true;
  schema: ZodSchema<TOutput, TDef, TInput>;
  create(input: unknown): TOutput;
  createTyped(input: TInput): TOutput;
  createAsync(input: unknown): Promise<TOutput>;
  createTypedAsync(input: TInput): Promise<TOutput>;
  // create(input: TInput): TOutput,
}

export function createZodDto<
  TSchema extends ZodSchema,
  TOutput = z.output<TSchema>,
  TDef extends ZodTypeDef = TSchema extends ZodSchema<TOutput, infer _TDef>
  ? _TDef
  : never,
  TInput = z.input<TSchema>,
>(schema: TSchema) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    constructor(input: unknown) {
      Object.assign(this, input);
    }

    public static create(input: unknown) {
      const parsedData = this.schema.parse(input);
      const instance = new this({});
      Object.assign(instance, parsedData);
      return instance;
    }

    public static createTyped(input: TInput) {
      return this.create(input);
    }

    public static async createAsync(input: unknown) {
      const parsed = await this.schema.parseAsync(input);
      return new this(parsed);
    }

    public static async createTypedAsync(input: TInput) {
      return this.createAsync(input);
    }

    toJSON() {
      return schema.parse(this);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput> & {
    toJSON(): TOutput;
  };
}

export function isZodDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isZodDto;
}
