import dayjs from 'dayjs';
import { z } from 'zod';

export const dateString = z
  .string()
  .min(1)
  .or(z.date())
  .transform((val) => (val instanceof Date ? val : new Date(val)))
  .pipe(z.date());

export const onlyDateString = dateString
  .transform((val) => {
    return new Date(val.toISOString().split('T')[0] + 'T00:00:00.000Z');
  })
  .pipe(z.date());

export const HHmmTuple = z
  .string()
  .transform((val) => val.split(':'))
  .pipe(
    z.tuple([z.number().int().min(0).max(23), z.number().int().min(0).max(59)]),
  );

export const HHmmStringToDate = HHmmTuple.or(z.string())
  .or(z.date())
  .transform((val) => {
    const date =
      val instanceof Date
        ? dayjs(val)
        : Array.isArray(val)
          ? dayjs(0).hour(val[0]).minute(val[1])
          : dayjs(val);

    return dayjs(0).hour(date.hour()).minute(date.minute()).toDate();
  })
  .pipe(z.date()); // 24:21 || 2023-01-23T12:23:03.000Z -> 1970-01-01T12:23:00.000Z

export const HHmmStringToDateOptional = HHmmTuple.or(z.string().nullish())
  .or(z.date().nullish())
  .transform((val) => {
    const date =
      val instanceof Date
        ? dayjs(val)
        : Array.isArray(val)
          ? dayjs(0).hour(val[0]).minute(val[1])
          : dayjs(val);

    return dayjs(0).hour(date.hour()).minute(date.minute()).toDate();
  })
  .pipe(z.date().nullish())
  .nullable(); // 24:21 || 2023-01-23T12:23:03.000Z -> 1970-01-01T12:23:00.000Z
