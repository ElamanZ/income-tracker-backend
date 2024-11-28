import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

interface ValidatedHeaderOptions {
  header: string;
  required?: boolean;
  default?: string;
}

export const ValidatedHeader = (options: ValidatedHeaderOptions) => {
  return createParamDecorator(
    (options: ValidatedHeaderOptions, ctx: ExecutionContext) => {
      const request: Request = ctx.switchToHttp().getRequest();
      const value = request.headers[options.header];

      if (value) return value;

      if (options.required) {
        throw new BadRequestException(`Header ${options.header} is required`);
      }

      return options.default ?? null;
    },
  )(options);
};

export const CityIdDecarator = (
  options: Omit<ValidatedHeaderOptions, 'header' | 'required'> = {},
) => {
  return ValidatedHeader({
    ...options,
    header: 'x-city-id',
    default: 'bishkek',
  });
};

export const CountryIdDecarator = (
  options: Omit<ValidatedHeaderOptions, 'header' | 'required'> = {},
) => {
  return ValidatedHeader({
    ...options,
    header: 'x-country-id',
    default: 'kyrgyzstan',
  });
};

export const InstitutionIdDecarator = (
  options: Omit<ValidatedHeaderOptions, 'header'> = {},
) => {
  return ValidatedHeader({ ...options, header: 'x-institution-id' });
};
