import { z } from "zod";

export const parsePhoneNumbersFromText = (val: string) => {
  if (!val) return [];
  const regex =
    /(\+?[0-9]+)[ ]*[-]?[ ]*(\([0-9 -]+\))?((?:[ ]*\-?[ ]*[0-9]+)*)/gm;
  const matches = val.match(regex) ?? [];

  const phones = matches.map<string>((val: string) => {
    const numbers = val.match(/[0-9]/g) ?? [];
    return numbers.join('');
  });

  return phones;
};

export const formatKGPhoneNumber = (phone: string) => {
  return phone.startsWith('996')
    ? phone.slice(0, 12)
    : `996${phone.replace(/^[0]/, '').slice(0, 9)}`;
};

export const parsePhoneNumberSchema = z
  .string()
  .transform((val) => parsePhoneNumbersFromText(val)[0] ?? '')
  .pipe(z.string().min(6, 'Номер телефона должен содержать минимум 6 цифр'));

export const parseKgPhoneNumberSchema = z
  .string()
  .transform((val) => parsePhoneNumbersFromText(val)[0] ?? '')
  .transform((val) => formatKGPhoneNumber(val))
  .pipe(z.string().min(12, 'Номер телефона должен содержать минимум 12 цифр'));
