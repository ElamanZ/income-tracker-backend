import { z, type ZodError, type ZodObject, type ZodType } from 'zod';

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
} & {};

// type Impossible<T extends Record<string, any>> = Partial<
//   Record<keyof T, never>
// >;

export interface BaseOptions<TShared extends Record<string, ZodType>> {
  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;
}

export interface LooseOptions<TShared extends Record<string, ZodType>>
  extends BaseOptions<TShared> {
  runtimeEnvStrict?: never;
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
   */
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
> extends BaseOptions<TShared> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
      [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
      ? never
      : TKey;
    }[keyof TServer]
    | {
      [TKey in keyof TShared]: TKey extends string ? TKey : never;
    }[keyof TShared],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

export interface ServerOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends ''
    ? TServer[TKey]
    : TKey extends `${TPrefix}${string}`
    ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
      ? TKey
      : never} should not prefixed with ${TPrefix}.`>
    : TServer[TKey];
  }>;
}

export type ServerClientOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
> = ServerOptions<TPrefix, TServer>;

export type EnvOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
> =
  | (LooseOptions<TShared> & ServerClientOptions<TPrefix, TServer>)
  | (StrictOptions<TPrefix, TServer, TShared> &
    ServerClientOptions<TPrefix, TServer>);

export function createEnv<
  TPrefix extends string = '',
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>,
>(
  opts: EnvOptions<TPrefix, TServer, TShared>,
): Simplify<
  z.infer<ZodObject<TServer>> &
  z.infer<ZodObject<TClient>> &
  z.infer<ZodObject<TShared>>
> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (skip) return runtimeEnv as any;

  const _server = typeof opts.server === 'object' ? opts.server : {};
  const _shared = typeof opts.shared === 'object' ? opts.shared : {};
  const server = z.object(_server);
  const shared = z.object(_shared);

  const allServer = server.merge(shared);
  const parsed = allServer.safeParse(runtimeEnv); // on server we can validate all env vars

  const onValidationError =
    opts.onValidationError ??
    ((error: ZodError) => {
      console.error(
        '❌ Invalid environment variables:',
        error.flatten().fieldErrors,
      );
      throw new Error('Invalid environment variables');
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      return target[prop as keyof typeof target];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return env as any;
}
