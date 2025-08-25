
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Author
 * 
 */
export type Author = $Result.DefaultSelection<Prisma.$AuthorPayload>
/**
 * Model Manuscript
 * 
 */
export type Manuscript = $Result.DefaultSelection<Prisma.$ManuscriptPayload>
/**
 * Model ManuscriptVersion
 * 
 */
export type ManuscriptVersion = $Result.DefaultSelection<Prisma.$ManuscriptVersionPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model Reviewer
 * 
 */
export type Reviewer = $Result.DefaultSelection<Prisma.$ReviewerPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ManuscriptStatus: {
  DRAFT: 'DRAFT',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REVISED: 'REVISED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED'
};

export type ManuscriptStatus = (typeof ManuscriptStatus)[keyof typeof ManuscriptStatus]


export const DocumentType: {
  WORD: 'WORD',
  PDF: 'PDF',
  TEXT: 'TEXT',
  FREE_TEXT: 'FREE_TEXT'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const ReviewType: {
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL'
};

export type ReviewType = (typeof ReviewType)[keyof typeof ReviewType]

}

export type ManuscriptStatus = $Enums.ManuscriptStatus

export const ManuscriptStatus: typeof $Enums.ManuscriptStatus

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type ReviewType = $Enums.ReviewType

export const ReviewType: typeof $Enums.ReviewType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Authors
 * const authors = await prisma.author.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Authors
   * const authors = await prisma.author.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.author`: Exposes CRUD operations for the **Author** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Authors
    * const authors = await prisma.author.findMany()
    * ```
    */
  get author(): Prisma.AuthorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manuscript`: Exposes CRUD operations for the **Manuscript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Manuscripts
    * const manuscripts = await prisma.manuscript.findMany()
    * ```
    */
  get manuscript(): Prisma.ManuscriptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manuscriptVersion`: Exposes CRUD operations for the **ManuscriptVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ManuscriptVersions
    * const manuscriptVersions = await prisma.manuscriptVersion.findMany()
    * ```
    */
  get manuscriptVersion(): Prisma.ManuscriptVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reviewer`: Exposes CRUD operations for the **Reviewer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviewers
    * const reviewers = await prisma.reviewer.findMany()
    * ```
    */
  get reviewer(): Prisma.ReviewerDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Author: 'Author',
    Manuscript: 'Manuscript',
    ManuscriptVersion: 'ManuscriptVersion',
    Review: 'Review',
    Reviewer: 'Reviewer'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "author" | "manuscript" | "manuscriptVersion" | "review" | "reviewer"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Author: {
        payload: Prisma.$AuthorPayload<ExtArgs>
        fields: Prisma.AuthorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          findFirst: {
            args: Prisma.AuthorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          findMany: {
            args: Prisma.AuthorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          create: {
            args: Prisma.AuthorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          createMany: {
            args: Prisma.AuthorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          delete: {
            args: Prisma.AuthorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          update: {
            args: Prisma.AuthorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          deleteMany: {
            args: Prisma.AuthorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          upsert: {
            args: Prisma.AuthorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          aggregate: {
            args: Prisma.AuthorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthor>
          }
          groupBy: {
            args: Prisma.AuthorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthorGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthorCountArgs<ExtArgs>
            result: $Utils.Optional<AuthorCountAggregateOutputType> | number
          }
        }
      }
      Manuscript: {
        payload: Prisma.$ManuscriptPayload<ExtArgs>
        fields: Prisma.ManuscriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManuscriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManuscriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          findFirst: {
            args: Prisma.ManuscriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManuscriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          findMany: {
            args: Prisma.ManuscriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>[]
          }
          create: {
            args: Prisma.ManuscriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          createMany: {
            args: Prisma.ManuscriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ManuscriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>[]
          }
          delete: {
            args: Prisma.ManuscriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          update: {
            args: Prisma.ManuscriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          deleteMany: {
            args: Prisma.ManuscriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManuscriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ManuscriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>[]
          }
          upsert: {
            args: Prisma.ManuscriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptPayload>
          }
          aggregate: {
            args: Prisma.ManuscriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManuscript>
          }
          groupBy: {
            args: Prisma.ManuscriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManuscriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManuscriptCountArgs<ExtArgs>
            result: $Utils.Optional<ManuscriptCountAggregateOutputType> | number
          }
        }
      }
      ManuscriptVersion: {
        payload: Prisma.$ManuscriptVersionPayload<ExtArgs>
        fields: Prisma.ManuscriptVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManuscriptVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManuscriptVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          findFirst: {
            args: Prisma.ManuscriptVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManuscriptVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          findMany: {
            args: Prisma.ManuscriptVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>[]
          }
          create: {
            args: Prisma.ManuscriptVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          createMany: {
            args: Prisma.ManuscriptVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ManuscriptVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>[]
          }
          delete: {
            args: Prisma.ManuscriptVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          update: {
            args: Prisma.ManuscriptVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          deleteMany: {
            args: Prisma.ManuscriptVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManuscriptVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ManuscriptVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>[]
          }
          upsert: {
            args: Prisma.ManuscriptVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManuscriptVersionPayload>
          }
          aggregate: {
            args: Prisma.ManuscriptVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManuscriptVersion>
          }
          groupBy: {
            args: Prisma.ManuscriptVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManuscriptVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManuscriptVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ManuscriptVersionCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      Reviewer: {
        payload: Prisma.$ReviewerPayload<ExtArgs>
        fields: Prisma.ReviewerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          findFirst: {
            args: Prisma.ReviewerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          findMany: {
            args: Prisma.ReviewerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>[]
          }
          create: {
            args: Prisma.ReviewerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          createMany: {
            args: Prisma.ReviewerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>[]
          }
          delete: {
            args: Prisma.ReviewerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          update: {
            args: Prisma.ReviewerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          deleteMany: {
            args: Prisma.ReviewerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>[]
          }
          upsert: {
            args: Prisma.ReviewerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerPayload>
          }
          aggregate: {
            args: Prisma.ReviewerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReviewer>
          }
          groupBy: {
            args: Prisma.ReviewerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewerCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewerCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    author?: AuthorOmit
    manuscript?: ManuscriptOmit
    manuscriptVersion?: ManuscriptVersionOmit
    review?: ReviewOmit
    reviewer?: ReviewerOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuthorCountOutputType
   */

  export type AuthorCountOutputType = {
    manuscripts: number
  }

  export type AuthorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manuscripts?: boolean | AuthorCountOutputTypeCountManuscriptsArgs
  }

  // Custom InputTypes
  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthorCountOutputType
     */
    select?: AuthorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeCountManuscriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManuscriptWhereInput
  }


  /**
   * Count Type ManuscriptCountOutputType
   */

  export type ManuscriptCountOutputType = {
    authors: number
    versions: number
  }

  export type ManuscriptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authors?: boolean | ManuscriptCountOutputTypeCountAuthorsArgs
    versions?: boolean | ManuscriptCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * ManuscriptCountOutputType without action
   */
  export type ManuscriptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptCountOutputType
     */
    select?: ManuscriptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ManuscriptCountOutputType without action
   */
  export type ManuscriptCountOutputTypeCountAuthorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthorWhereInput
  }

  /**
   * ManuscriptCountOutputType without action
   */
  export type ManuscriptCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManuscriptVersionWhereInput
  }


  /**
   * Count Type ManuscriptVersionCountOutputType
   */

  export type ManuscriptVersionCountOutputType = {
    reviews: number
  }

  export type ManuscriptVersionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | ManuscriptVersionCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * ManuscriptVersionCountOutputType without action
   */
  export type ManuscriptVersionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersionCountOutputType
     */
    select?: ManuscriptVersionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ManuscriptVersionCountOutputType without action
   */
  export type ManuscriptVersionCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }


  /**
   * Count Type ReviewerCountOutputType
   */

  export type ReviewerCountOutputType = {
    reviews: number
  }

  export type ReviewerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | ReviewerCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * ReviewerCountOutputType without action
   */
  export type ReviewerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerCountOutputType
     */
    select?: ReviewerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReviewerCountOutputType without action
   */
  export type ReviewerCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Author
   */

  export type AggregateAuthor = {
    _count: AuthorCountAggregateOutputType | null
    _min: AuthorMinAggregateOutputType | null
    _max: AuthorMaxAggregateOutputType | null
  }

  export type AuthorMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    affiliation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthorMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    affiliation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthorCountAggregateOutputType = {
    id: number
    name: number
    email: number
    affiliation: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthorMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthorMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthorCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Author to aggregate.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Authors
    **/
    _count?: true | AuthorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthorMaxAggregateInputType
  }

  export type GetAuthorAggregateType<T extends AuthorAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthor[P]>
      : GetScalarType<T[P], AggregateAuthor[P]>
  }




  export type AuthorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthorWhereInput
    orderBy?: AuthorOrderByWithAggregationInput | AuthorOrderByWithAggregationInput[]
    by: AuthorScalarFieldEnum[] | AuthorScalarFieldEnum
    having?: AuthorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthorCountAggregateInputType | true
    _min?: AuthorMinAggregateInputType
    _max?: AuthorMaxAggregateInputType
  }

  export type AuthorGroupByOutputType = {
    id: string
    name: string
    email: string | null
    affiliation: string | null
    createdAt: Date
    updatedAt: Date
    _count: AuthorCountAggregateOutputType | null
    _min: AuthorMinAggregateOutputType | null
    _max: AuthorMaxAggregateOutputType | null
  }

  type GetAuthorGroupByPayload<T extends AuthorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthorGroupByOutputType[P]>
            : GetScalarType<T[P], AuthorGroupByOutputType[P]>
        }
      >
    >


  export type AuthorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    manuscripts?: boolean | Author$manuscriptsArgs<ExtArgs>
    _count?: boolean | AuthorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "affiliation" | "createdAt" | "updatedAt", ExtArgs["result"]["author"]>
  export type AuthorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manuscripts?: boolean | Author$manuscriptsArgs<ExtArgs>
    _count?: boolean | AuthorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Author"
    objects: {
      manuscripts: Prisma.$ManuscriptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      affiliation: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["author"]>
    composites: {}
  }

  type AuthorGetPayload<S extends boolean | null | undefined | AuthorDefaultArgs> = $Result.GetResult<Prisma.$AuthorPayload, S>

  type AuthorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthorCountAggregateInputType | true
    }

  export interface AuthorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Author'], meta: { name: 'Author' } }
    /**
     * Find zero or one Author that matches the filter.
     * @param {AuthorFindUniqueArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthorFindUniqueArgs>(args: SelectSubset<T, AuthorFindUniqueArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Author that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthorFindUniqueOrThrowArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthorFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Author that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindFirstArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthorFindFirstArgs>(args?: SelectSubset<T, AuthorFindFirstArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Author that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindFirstOrThrowArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthorFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Authors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Authors
     * const authors = await prisma.author.findMany()
     * 
     * // Get first 10 Authors
     * const authors = await prisma.author.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authorWithIdOnly = await prisma.author.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthorFindManyArgs>(args?: SelectSubset<T, AuthorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Author.
     * @param {AuthorCreateArgs} args - Arguments to create a Author.
     * @example
     * // Create one Author
     * const Author = await prisma.author.create({
     *   data: {
     *     // ... data to create a Author
     *   }
     * })
     * 
     */
    create<T extends AuthorCreateArgs>(args: SelectSubset<T, AuthorCreateArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Authors.
     * @param {AuthorCreateManyArgs} args - Arguments to create many Authors.
     * @example
     * // Create many Authors
     * const author = await prisma.author.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthorCreateManyArgs>(args?: SelectSubset<T, AuthorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Authors and returns the data saved in the database.
     * @param {AuthorCreateManyAndReturnArgs} args - Arguments to create many Authors.
     * @example
     * // Create many Authors
     * const author = await prisma.author.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Authors and only return the `id`
     * const authorWithIdOnly = await prisma.author.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthorCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Author.
     * @param {AuthorDeleteArgs} args - Arguments to delete one Author.
     * @example
     * // Delete one Author
     * const Author = await prisma.author.delete({
     *   where: {
     *     // ... filter to delete one Author
     *   }
     * })
     * 
     */
    delete<T extends AuthorDeleteArgs>(args: SelectSubset<T, AuthorDeleteArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Author.
     * @param {AuthorUpdateArgs} args - Arguments to update one Author.
     * @example
     * // Update one Author
     * const author = await prisma.author.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthorUpdateArgs>(args: SelectSubset<T, AuthorUpdateArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Authors.
     * @param {AuthorDeleteManyArgs} args - Arguments to filter Authors to delete.
     * @example
     * // Delete a few Authors
     * const { count } = await prisma.author.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthorDeleteManyArgs>(args?: SelectSubset<T, AuthorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Authors
     * const author = await prisma.author.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthorUpdateManyArgs>(args: SelectSubset<T, AuthorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authors and returns the data updated in the database.
     * @param {AuthorUpdateManyAndReturnArgs} args - Arguments to update many Authors.
     * @example
     * // Update many Authors
     * const author = await prisma.author.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Authors and only return the `id`
     * const authorWithIdOnly = await prisma.author.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthorUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Author.
     * @param {AuthorUpsertArgs} args - Arguments to update or create a Author.
     * @example
     * // Update or create a Author
     * const author = await prisma.author.upsert({
     *   create: {
     *     // ... data to create a Author
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Author we want to update
     *   }
     * })
     */
    upsert<T extends AuthorUpsertArgs>(args: SelectSubset<T, AuthorUpsertArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Authors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorCountArgs} args - Arguments to filter Authors to count.
     * @example
     * // Count the number of Authors
     * const count = await prisma.author.count({
     *   where: {
     *     // ... the filter for the Authors we want to count
     *   }
     * })
    **/
    count<T extends AuthorCountArgs>(
      args?: Subset<T, AuthorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Author.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthorAggregateArgs>(args: Subset<T, AuthorAggregateArgs>): Prisma.PrismaPromise<GetAuthorAggregateType<T>>

    /**
     * Group by Author.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthorGroupByArgs['orderBy'] }
        : { orderBy?: AuthorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Author model
   */
  readonly fields: AuthorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Author.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    manuscripts<T extends Author$manuscriptsArgs<ExtArgs> = {}>(args?: Subset<T, Author$manuscriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Author model
   */
  interface AuthorFieldRefs {
    readonly id: FieldRef<"Author", 'String'>
    readonly name: FieldRef<"Author", 'String'>
    readonly email: FieldRef<"Author", 'String'>
    readonly affiliation: FieldRef<"Author", 'String'>
    readonly createdAt: FieldRef<"Author", 'DateTime'>
    readonly updatedAt: FieldRef<"Author", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Author findUnique
   */
  export type AuthorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author findUniqueOrThrow
   */
  export type AuthorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author findFirst
   */
  export type AuthorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authors.
     */
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author findFirstOrThrow
   */
  export type AuthorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authors.
     */
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author findMany
   */
  export type AuthorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Authors to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author create
   */
  export type AuthorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The data needed to create a Author.
     */
    data: XOR<AuthorCreateInput, AuthorUncheckedCreateInput>
  }

  /**
   * Author createMany
   */
  export type AuthorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Authors.
     */
    data: AuthorCreateManyInput | AuthorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Author createManyAndReturn
   */
  export type AuthorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * The data used to create many Authors.
     */
    data: AuthorCreateManyInput | AuthorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Author update
   */
  export type AuthorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The data needed to update a Author.
     */
    data: XOR<AuthorUpdateInput, AuthorUncheckedUpdateInput>
    /**
     * Choose, which Author to update.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author updateMany
   */
  export type AuthorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Authors.
     */
    data: XOR<AuthorUpdateManyMutationInput, AuthorUncheckedUpdateManyInput>
    /**
     * Filter which Authors to update
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to update.
     */
    limit?: number
  }

  /**
   * Author updateManyAndReturn
   */
  export type AuthorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * The data used to update Authors.
     */
    data: XOR<AuthorUpdateManyMutationInput, AuthorUncheckedUpdateManyInput>
    /**
     * Filter which Authors to update
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to update.
     */
    limit?: number
  }

  /**
   * Author upsert
   */
  export type AuthorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The filter to search for the Author to update in case it exists.
     */
    where: AuthorWhereUniqueInput
    /**
     * In case the Author found by the `where` argument doesn't exist, create a new Author with this data.
     */
    create: XOR<AuthorCreateInput, AuthorUncheckedCreateInput>
    /**
     * In case the Author was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthorUpdateInput, AuthorUncheckedUpdateInput>
  }

  /**
   * Author delete
   */
  export type AuthorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter which Author to delete.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author deleteMany
   */
  export type AuthorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authors to delete
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to delete.
     */
    limit?: number
  }

  /**
   * Author.manuscripts
   */
  export type Author$manuscriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    where?: ManuscriptWhereInput
    orderBy?: ManuscriptOrderByWithRelationInput | ManuscriptOrderByWithRelationInput[]
    cursor?: ManuscriptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ManuscriptScalarFieldEnum | ManuscriptScalarFieldEnum[]
  }

  /**
   * Author without action
   */
  export type AuthorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
  }


  /**
   * Model Manuscript
   */

  export type AggregateManuscript = {
    _count: ManuscriptCountAggregateOutputType | null
    _min: ManuscriptMinAggregateOutputType | null
    _max: ManuscriptMaxAggregateOutputType | null
  }

  export type ManuscriptMinAggregateOutputType = {
    id: string | null
    title: string | null
    abstract: string | null
    status: $Enums.ManuscriptStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    pubmedUrl: string | null
    f1000Url: string | null
  }

  export type ManuscriptMaxAggregateOutputType = {
    id: string | null
    title: string | null
    abstract: string | null
    status: $Enums.ManuscriptStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    pubmedUrl: string | null
    f1000Url: string | null
  }

  export type ManuscriptCountAggregateOutputType = {
    id: number
    title: number
    abstract: number
    keywords: number
    status: number
    createdAt: number
    updatedAt: number
    pubmedUrl: number
    f1000Url: number
    _all: number
  }


  export type ManuscriptMinAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    pubmedUrl?: true
    f1000Url?: true
  }

  export type ManuscriptMaxAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    pubmedUrl?: true
    f1000Url?: true
  }

  export type ManuscriptCountAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    keywords?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    pubmedUrl?: true
    f1000Url?: true
    _all?: true
  }

  export type ManuscriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Manuscript to aggregate.
     */
    where?: ManuscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manuscripts to fetch.
     */
    orderBy?: ManuscriptOrderByWithRelationInput | ManuscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManuscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manuscripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manuscripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Manuscripts
    **/
    _count?: true | ManuscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManuscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManuscriptMaxAggregateInputType
  }

  export type GetManuscriptAggregateType<T extends ManuscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateManuscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManuscript[P]>
      : GetScalarType<T[P], AggregateManuscript[P]>
  }




  export type ManuscriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManuscriptWhereInput
    orderBy?: ManuscriptOrderByWithAggregationInput | ManuscriptOrderByWithAggregationInput[]
    by: ManuscriptScalarFieldEnum[] | ManuscriptScalarFieldEnum
    having?: ManuscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManuscriptCountAggregateInputType | true
    _min?: ManuscriptMinAggregateInputType
    _max?: ManuscriptMaxAggregateInputType
  }

  export type ManuscriptGroupByOutputType = {
    id: string
    title: string
    abstract: string | null
    keywords: string[]
    status: $Enums.ManuscriptStatus
    createdAt: Date
    updatedAt: Date
    pubmedUrl: string | null
    f1000Url: string | null
    _count: ManuscriptCountAggregateOutputType | null
    _min: ManuscriptMinAggregateOutputType | null
    _max: ManuscriptMaxAggregateOutputType | null
  }

  type GetManuscriptGroupByPayload<T extends ManuscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManuscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManuscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManuscriptGroupByOutputType[P]>
            : GetScalarType<T[P], ManuscriptGroupByOutputType[P]>
        }
      >
    >


  export type ManuscriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    keywords?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pubmedUrl?: boolean
    f1000Url?: boolean
    authors?: boolean | Manuscript$authorsArgs<ExtArgs>
    versions?: boolean | Manuscript$versionsArgs<ExtArgs>
    _count?: boolean | ManuscriptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manuscript"]>

  export type ManuscriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    keywords?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pubmedUrl?: boolean
    f1000Url?: boolean
  }, ExtArgs["result"]["manuscript"]>

  export type ManuscriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    keywords?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pubmedUrl?: boolean
    f1000Url?: boolean
  }, ExtArgs["result"]["manuscript"]>

  export type ManuscriptSelectScalar = {
    id?: boolean
    title?: boolean
    abstract?: boolean
    keywords?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pubmedUrl?: boolean
    f1000Url?: boolean
  }

  export type ManuscriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "abstract" | "keywords" | "status" | "createdAt" | "updatedAt" | "pubmedUrl" | "f1000Url", ExtArgs["result"]["manuscript"]>
  export type ManuscriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authors?: boolean | Manuscript$authorsArgs<ExtArgs>
    versions?: boolean | Manuscript$versionsArgs<ExtArgs>
    _count?: boolean | ManuscriptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ManuscriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ManuscriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ManuscriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Manuscript"
    objects: {
      authors: Prisma.$AuthorPayload<ExtArgs>[]
      versions: Prisma.$ManuscriptVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      abstract: string | null
      keywords: string[]
      status: $Enums.ManuscriptStatus
      createdAt: Date
      updatedAt: Date
      pubmedUrl: string | null
      f1000Url: string | null
    }, ExtArgs["result"]["manuscript"]>
    composites: {}
  }

  type ManuscriptGetPayload<S extends boolean | null | undefined | ManuscriptDefaultArgs> = $Result.GetResult<Prisma.$ManuscriptPayload, S>

  type ManuscriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManuscriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManuscriptCountAggregateInputType | true
    }

  export interface ManuscriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Manuscript'], meta: { name: 'Manuscript' } }
    /**
     * Find zero or one Manuscript that matches the filter.
     * @param {ManuscriptFindUniqueArgs} args - Arguments to find a Manuscript
     * @example
     * // Get one Manuscript
     * const manuscript = await prisma.manuscript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManuscriptFindUniqueArgs>(args: SelectSubset<T, ManuscriptFindUniqueArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Manuscript that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManuscriptFindUniqueOrThrowArgs} args - Arguments to find a Manuscript
     * @example
     * // Get one Manuscript
     * const manuscript = await prisma.manuscript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManuscriptFindUniqueOrThrowArgs>(args: SelectSubset<T, ManuscriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manuscript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptFindFirstArgs} args - Arguments to find a Manuscript
     * @example
     * // Get one Manuscript
     * const manuscript = await prisma.manuscript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManuscriptFindFirstArgs>(args?: SelectSubset<T, ManuscriptFindFirstArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manuscript that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptFindFirstOrThrowArgs} args - Arguments to find a Manuscript
     * @example
     * // Get one Manuscript
     * const manuscript = await prisma.manuscript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManuscriptFindFirstOrThrowArgs>(args?: SelectSubset<T, ManuscriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Manuscripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Manuscripts
     * const manuscripts = await prisma.manuscript.findMany()
     * 
     * // Get first 10 Manuscripts
     * const manuscripts = await prisma.manuscript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const manuscriptWithIdOnly = await prisma.manuscript.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManuscriptFindManyArgs>(args?: SelectSubset<T, ManuscriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Manuscript.
     * @param {ManuscriptCreateArgs} args - Arguments to create a Manuscript.
     * @example
     * // Create one Manuscript
     * const Manuscript = await prisma.manuscript.create({
     *   data: {
     *     // ... data to create a Manuscript
     *   }
     * })
     * 
     */
    create<T extends ManuscriptCreateArgs>(args: SelectSubset<T, ManuscriptCreateArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Manuscripts.
     * @param {ManuscriptCreateManyArgs} args - Arguments to create many Manuscripts.
     * @example
     * // Create many Manuscripts
     * const manuscript = await prisma.manuscript.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManuscriptCreateManyArgs>(args?: SelectSubset<T, ManuscriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Manuscripts and returns the data saved in the database.
     * @param {ManuscriptCreateManyAndReturnArgs} args - Arguments to create many Manuscripts.
     * @example
     * // Create many Manuscripts
     * const manuscript = await prisma.manuscript.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Manuscripts and only return the `id`
     * const manuscriptWithIdOnly = await prisma.manuscript.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ManuscriptCreateManyAndReturnArgs>(args?: SelectSubset<T, ManuscriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Manuscript.
     * @param {ManuscriptDeleteArgs} args - Arguments to delete one Manuscript.
     * @example
     * // Delete one Manuscript
     * const Manuscript = await prisma.manuscript.delete({
     *   where: {
     *     // ... filter to delete one Manuscript
     *   }
     * })
     * 
     */
    delete<T extends ManuscriptDeleteArgs>(args: SelectSubset<T, ManuscriptDeleteArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Manuscript.
     * @param {ManuscriptUpdateArgs} args - Arguments to update one Manuscript.
     * @example
     * // Update one Manuscript
     * const manuscript = await prisma.manuscript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManuscriptUpdateArgs>(args: SelectSubset<T, ManuscriptUpdateArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Manuscripts.
     * @param {ManuscriptDeleteManyArgs} args - Arguments to filter Manuscripts to delete.
     * @example
     * // Delete a few Manuscripts
     * const { count } = await prisma.manuscript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManuscriptDeleteManyArgs>(args?: SelectSubset<T, ManuscriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Manuscripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Manuscripts
     * const manuscript = await prisma.manuscript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManuscriptUpdateManyArgs>(args: SelectSubset<T, ManuscriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Manuscripts and returns the data updated in the database.
     * @param {ManuscriptUpdateManyAndReturnArgs} args - Arguments to update many Manuscripts.
     * @example
     * // Update many Manuscripts
     * const manuscript = await prisma.manuscript.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Manuscripts and only return the `id`
     * const manuscriptWithIdOnly = await prisma.manuscript.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ManuscriptUpdateManyAndReturnArgs>(args: SelectSubset<T, ManuscriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Manuscript.
     * @param {ManuscriptUpsertArgs} args - Arguments to update or create a Manuscript.
     * @example
     * // Update or create a Manuscript
     * const manuscript = await prisma.manuscript.upsert({
     *   create: {
     *     // ... data to create a Manuscript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Manuscript we want to update
     *   }
     * })
     */
    upsert<T extends ManuscriptUpsertArgs>(args: SelectSubset<T, ManuscriptUpsertArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Manuscripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptCountArgs} args - Arguments to filter Manuscripts to count.
     * @example
     * // Count the number of Manuscripts
     * const count = await prisma.manuscript.count({
     *   where: {
     *     // ... the filter for the Manuscripts we want to count
     *   }
     * })
    **/
    count<T extends ManuscriptCountArgs>(
      args?: Subset<T, ManuscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManuscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Manuscript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ManuscriptAggregateArgs>(args: Subset<T, ManuscriptAggregateArgs>): Prisma.PrismaPromise<GetManuscriptAggregateType<T>>

    /**
     * Group by Manuscript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ManuscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManuscriptGroupByArgs['orderBy'] }
        : { orderBy?: ManuscriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ManuscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManuscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Manuscript model
   */
  readonly fields: ManuscriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Manuscript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManuscriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authors<T extends Manuscript$authorsArgs<ExtArgs> = {}>(args?: Subset<T, Manuscript$authorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    versions<T extends Manuscript$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Manuscript$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Manuscript model
   */
  interface ManuscriptFieldRefs {
    readonly id: FieldRef<"Manuscript", 'String'>
    readonly title: FieldRef<"Manuscript", 'String'>
    readonly abstract: FieldRef<"Manuscript", 'String'>
    readonly keywords: FieldRef<"Manuscript", 'String[]'>
    readonly status: FieldRef<"Manuscript", 'ManuscriptStatus'>
    readonly createdAt: FieldRef<"Manuscript", 'DateTime'>
    readonly updatedAt: FieldRef<"Manuscript", 'DateTime'>
    readonly pubmedUrl: FieldRef<"Manuscript", 'String'>
    readonly f1000Url: FieldRef<"Manuscript", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Manuscript findUnique
   */
  export type ManuscriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter, which Manuscript to fetch.
     */
    where: ManuscriptWhereUniqueInput
  }

  /**
   * Manuscript findUniqueOrThrow
   */
  export type ManuscriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter, which Manuscript to fetch.
     */
    where: ManuscriptWhereUniqueInput
  }

  /**
   * Manuscript findFirst
   */
  export type ManuscriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter, which Manuscript to fetch.
     */
    where?: ManuscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manuscripts to fetch.
     */
    orderBy?: ManuscriptOrderByWithRelationInput | ManuscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Manuscripts.
     */
    cursor?: ManuscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manuscripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manuscripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Manuscripts.
     */
    distinct?: ManuscriptScalarFieldEnum | ManuscriptScalarFieldEnum[]
  }

  /**
   * Manuscript findFirstOrThrow
   */
  export type ManuscriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter, which Manuscript to fetch.
     */
    where?: ManuscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manuscripts to fetch.
     */
    orderBy?: ManuscriptOrderByWithRelationInput | ManuscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Manuscripts.
     */
    cursor?: ManuscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manuscripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manuscripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Manuscripts.
     */
    distinct?: ManuscriptScalarFieldEnum | ManuscriptScalarFieldEnum[]
  }

  /**
   * Manuscript findMany
   */
  export type ManuscriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter, which Manuscripts to fetch.
     */
    where?: ManuscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manuscripts to fetch.
     */
    orderBy?: ManuscriptOrderByWithRelationInput | ManuscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Manuscripts.
     */
    cursor?: ManuscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manuscripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manuscripts.
     */
    skip?: number
    distinct?: ManuscriptScalarFieldEnum | ManuscriptScalarFieldEnum[]
  }

  /**
   * Manuscript create
   */
  export type ManuscriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Manuscript.
     */
    data: XOR<ManuscriptCreateInput, ManuscriptUncheckedCreateInput>
  }

  /**
   * Manuscript createMany
   */
  export type ManuscriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Manuscripts.
     */
    data: ManuscriptCreateManyInput | ManuscriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Manuscript createManyAndReturn
   */
  export type ManuscriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * The data used to create many Manuscripts.
     */
    data: ManuscriptCreateManyInput | ManuscriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Manuscript update
   */
  export type ManuscriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Manuscript.
     */
    data: XOR<ManuscriptUpdateInput, ManuscriptUncheckedUpdateInput>
    /**
     * Choose, which Manuscript to update.
     */
    where: ManuscriptWhereUniqueInput
  }

  /**
   * Manuscript updateMany
   */
  export type ManuscriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Manuscripts.
     */
    data: XOR<ManuscriptUpdateManyMutationInput, ManuscriptUncheckedUpdateManyInput>
    /**
     * Filter which Manuscripts to update
     */
    where?: ManuscriptWhereInput
    /**
     * Limit how many Manuscripts to update.
     */
    limit?: number
  }

  /**
   * Manuscript updateManyAndReturn
   */
  export type ManuscriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * The data used to update Manuscripts.
     */
    data: XOR<ManuscriptUpdateManyMutationInput, ManuscriptUncheckedUpdateManyInput>
    /**
     * Filter which Manuscripts to update
     */
    where?: ManuscriptWhereInput
    /**
     * Limit how many Manuscripts to update.
     */
    limit?: number
  }

  /**
   * Manuscript upsert
   */
  export type ManuscriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Manuscript to update in case it exists.
     */
    where: ManuscriptWhereUniqueInput
    /**
     * In case the Manuscript found by the `where` argument doesn't exist, create a new Manuscript with this data.
     */
    create: XOR<ManuscriptCreateInput, ManuscriptUncheckedCreateInput>
    /**
     * In case the Manuscript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManuscriptUpdateInput, ManuscriptUncheckedUpdateInput>
  }

  /**
   * Manuscript delete
   */
  export type ManuscriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
    /**
     * Filter which Manuscript to delete.
     */
    where: ManuscriptWhereUniqueInput
  }

  /**
   * Manuscript deleteMany
   */
  export type ManuscriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Manuscripts to delete
     */
    where?: ManuscriptWhereInput
    /**
     * Limit how many Manuscripts to delete.
     */
    limit?: number
  }

  /**
   * Manuscript.authors
   */
  export type Manuscript$authorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    where?: AuthorWhereInput
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    cursor?: AuthorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Manuscript.versions
   */
  export type Manuscript$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    where?: ManuscriptVersionWhereInput
    orderBy?: ManuscriptVersionOrderByWithRelationInput | ManuscriptVersionOrderByWithRelationInput[]
    cursor?: ManuscriptVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ManuscriptVersionScalarFieldEnum | ManuscriptVersionScalarFieldEnum[]
  }

  /**
   * Manuscript without action
   */
  export type ManuscriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manuscript
     */
    select?: ManuscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manuscript
     */
    omit?: ManuscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptInclude<ExtArgs> | null
  }


  /**
   * Model ManuscriptVersion
   */

  export type AggregateManuscriptVersion = {
    _count: ManuscriptVersionCountAggregateOutputType | null
    _avg: ManuscriptVersionAvgAggregateOutputType | null
    _sum: ManuscriptVersionSumAggregateOutputType | null
    _min: ManuscriptVersionMinAggregateOutputType | null
    _max: ManuscriptVersionMaxAggregateOutputType | null
  }

  export type ManuscriptVersionAvgAggregateOutputType = {
    versionNumber: number | null
  }

  export type ManuscriptVersionSumAggregateOutputType = {
    versionNumber: number | null
  }

  export type ManuscriptVersionMinAggregateOutputType = {
    id: string | null
    versionNumber: number | null
    manuscriptId: string | null
    documentUrl: string | null
    documentType: $Enums.DocumentType | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ManuscriptVersionMaxAggregateOutputType = {
    id: string | null
    versionNumber: number | null
    manuscriptId: string | null
    documentUrl: string | null
    documentType: $Enums.DocumentType | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ManuscriptVersionCountAggregateOutputType = {
    id: number
    versionNumber: number
    manuscriptId: number
    documentUrl: number
    documentType: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ManuscriptVersionAvgAggregateInputType = {
    versionNumber?: true
  }

  export type ManuscriptVersionSumAggregateInputType = {
    versionNumber?: true
  }

  export type ManuscriptVersionMinAggregateInputType = {
    id?: true
    versionNumber?: true
    manuscriptId?: true
    documentUrl?: true
    documentType?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ManuscriptVersionMaxAggregateInputType = {
    id?: true
    versionNumber?: true
    manuscriptId?: true
    documentUrl?: true
    documentType?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ManuscriptVersionCountAggregateInputType = {
    id?: true
    versionNumber?: true
    manuscriptId?: true
    documentUrl?: true
    documentType?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ManuscriptVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManuscriptVersion to aggregate.
     */
    where?: ManuscriptVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManuscriptVersions to fetch.
     */
    orderBy?: ManuscriptVersionOrderByWithRelationInput | ManuscriptVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManuscriptVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManuscriptVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManuscriptVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ManuscriptVersions
    **/
    _count?: true | ManuscriptVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManuscriptVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManuscriptVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManuscriptVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManuscriptVersionMaxAggregateInputType
  }

  export type GetManuscriptVersionAggregateType<T extends ManuscriptVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateManuscriptVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManuscriptVersion[P]>
      : GetScalarType<T[P], AggregateManuscriptVersion[P]>
  }




  export type ManuscriptVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManuscriptVersionWhereInput
    orderBy?: ManuscriptVersionOrderByWithAggregationInput | ManuscriptVersionOrderByWithAggregationInput[]
    by: ManuscriptVersionScalarFieldEnum[] | ManuscriptVersionScalarFieldEnum
    having?: ManuscriptVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManuscriptVersionCountAggregateInputType | true
    _avg?: ManuscriptVersionAvgAggregateInputType
    _sum?: ManuscriptVersionSumAggregateInputType
    _min?: ManuscriptVersionMinAggregateInputType
    _max?: ManuscriptVersionMaxAggregateInputType
  }

  export type ManuscriptVersionGroupByOutputType = {
    id: string
    versionNumber: number
    manuscriptId: string
    documentUrl: string | null
    documentType: $Enums.DocumentType
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ManuscriptVersionCountAggregateOutputType | null
    _avg: ManuscriptVersionAvgAggregateOutputType | null
    _sum: ManuscriptVersionSumAggregateOutputType | null
    _min: ManuscriptVersionMinAggregateOutputType | null
    _max: ManuscriptVersionMaxAggregateOutputType | null
  }

  type GetManuscriptVersionGroupByPayload<T extends ManuscriptVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManuscriptVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManuscriptVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManuscriptVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ManuscriptVersionGroupByOutputType[P]>
        }
      >
    >


  export type ManuscriptVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    manuscriptId?: boolean
    documentUrl?: boolean
    documentType?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
    reviews?: boolean | ManuscriptVersion$reviewsArgs<ExtArgs>
    _count?: boolean | ManuscriptVersionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manuscriptVersion"]>

  export type ManuscriptVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    manuscriptId?: boolean
    documentUrl?: boolean
    documentType?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manuscriptVersion"]>

  export type ManuscriptVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    manuscriptId?: boolean
    documentUrl?: boolean
    documentType?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manuscriptVersion"]>

  export type ManuscriptVersionSelectScalar = {
    id?: boolean
    versionNumber?: boolean
    manuscriptId?: boolean
    documentUrl?: boolean
    documentType?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ManuscriptVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "versionNumber" | "manuscriptId" | "documentUrl" | "documentType" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["manuscriptVersion"]>
  export type ManuscriptVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
    reviews?: boolean | ManuscriptVersion$reviewsArgs<ExtArgs>
    _count?: boolean | ManuscriptVersionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ManuscriptVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
  }
  export type ManuscriptVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manuscript?: boolean | ManuscriptDefaultArgs<ExtArgs>
  }

  export type $ManuscriptVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ManuscriptVersion"
    objects: {
      manuscript: Prisma.$ManuscriptPayload<ExtArgs>
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      versionNumber: number
      manuscriptId: string
      documentUrl: string | null
      documentType: $Enums.DocumentType
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["manuscriptVersion"]>
    composites: {}
  }

  type ManuscriptVersionGetPayload<S extends boolean | null | undefined | ManuscriptVersionDefaultArgs> = $Result.GetResult<Prisma.$ManuscriptVersionPayload, S>

  type ManuscriptVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManuscriptVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManuscriptVersionCountAggregateInputType | true
    }

  export interface ManuscriptVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ManuscriptVersion'], meta: { name: 'ManuscriptVersion' } }
    /**
     * Find zero or one ManuscriptVersion that matches the filter.
     * @param {ManuscriptVersionFindUniqueArgs} args - Arguments to find a ManuscriptVersion
     * @example
     * // Get one ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManuscriptVersionFindUniqueArgs>(args: SelectSubset<T, ManuscriptVersionFindUniqueArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ManuscriptVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManuscriptVersionFindUniqueOrThrowArgs} args - Arguments to find a ManuscriptVersion
     * @example
     * // Get one ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManuscriptVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ManuscriptVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManuscriptVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionFindFirstArgs} args - Arguments to find a ManuscriptVersion
     * @example
     * // Get one ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManuscriptVersionFindFirstArgs>(args?: SelectSubset<T, ManuscriptVersionFindFirstArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManuscriptVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionFindFirstOrThrowArgs} args - Arguments to find a ManuscriptVersion
     * @example
     * // Get one ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManuscriptVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ManuscriptVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ManuscriptVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ManuscriptVersions
     * const manuscriptVersions = await prisma.manuscriptVersion.findMany()
     * 
     * // Get first 10 ManuscriptVersions
     * const manuscriptVersions = await prisma.manuscriptVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const manuscriptVersionWithIdOnly = await prisma.manuscriptVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManuscriptVersionFindManyArgs>(args?: SelectSubset<T, ManuscriptVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ManuscriptVersion.
     * @param {ManuscriptVersionCreateArgs} args - Arguments to create a ManuscriptVersion.
     * @example
     * // Create one ManuscriptVersion
     * const ManuscriptVersion = await prisma.manuscriptVersion.create({
     *   data: {
     *     // ... data to create a ManuscriptVersion
     *   }
     * })
     * 
     */
    create<T extends ManuscriptVersionCreateArgs>(args: SelectSubset<T, ManuscriptVersionCreateArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ManuscriptVersions.
     * @param {ManuscriptVersionCreateManyArgs} args - Arguments to create many ManuscriptVersions.
     * @example
     * // Create many ManuscriptVersions
     * const manuscriptVersion = await prisma.manuscriptVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManuscriptVersionCreateManyArgs>(args?: SelectSubset<T, ManuscriptVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ManuscriptVersions and returns the data saved in the database.
     * @param {ManuscriptVersionCreateManyAndReturnArgs} args - Arguments to create many ManuscriptVersions.
     * @example
     * // Create many ManuscriptVersions
     * const manuscriptVersion = await prisma.manuscriptVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ManuscriptVersions and only return the `id`
     * const manuscriptVersionWithIdOnly = await prisma.manuscriptVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ManuscriptVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ManuscriptVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ManuscriptVersion.
     * @param {ManuscriptVersionDeleteArgs} args - Arguments to delete one ManuscriptVersion.
     * @example
     * // Delete one ManuscriptVersion
     * const ManuscriptVersion = await prisma.manuscriptVersion.delete({
     *   where: {
     *     // ... filter to delete one ManuscriptVersion
     *   }
     * })
     * 
     */
    delete<T extends ManuscriptVersionDeleteArgs>(args: SelectSubset<T, ManuscriptVersionDeleteArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ManuscriptVersion.
     * @param {ManuscriptVersionUpdateArgs} args - Arguments to update one ManuscriptVersion.
     * @example
     * // Update one ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManuscriptVersionUpdateArgs>(args: SelectSubset<T, ManuscriptVersionUpdateArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ManuscriptVersions.
     * @param {ManuscriptVersionDeleteManyArgs} args - Arguments to filter ManuscriptVersions to delete.
     * @example
     * // Delete a few ManuscriptVersions
     * const { count } = await prisma.manuscriptVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManuscriptVersionDeleteManyArgs>(args?: SelectSubset<T, ManuscriptVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManuscriptVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ManuscriptVersions
     * const manuscriptVersion = await prisma.manuscriptVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManuscriptVersionUpdateManyArgs>(args: SelectSubset<T, ManuscriptVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManuscriptVersions and returns the data updated in the database.
     * @param {ManuscriptVersionUpdateManyAndReturnArgs} args - Arguments to update many ManuscriptVersions.
     * @example
     * // Update many ManuscriptVersions
     * const manuscriptVersion = await prisma.manuscriptVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ManuscriptVersions and only return the `id`
     * const manuscriptVersionWithIdOnly = await prisma.manuscriptVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ManuscriptVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ManuscriptVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ManuscriptVersion.
     * @param {ManuscriptVersionUpsertArgs} args - Arguments to update or create a ManuscriptVersion.
     * @example
     * // Update or create a ManuscriptVersion
     * const manuscriptVersion = await prisma.manuscriptVersion.upsert({
     *   create: {
     *     // ... data to create a ManuscriptVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ManuscriptVersion we want to update
     *   }
     * })
     */
    upsert<T extends ManuscriptVersionUpsertArgs>(args: SelectSubset<T, ManuscriptVersionUpsertArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ManuscriptVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionCountArgs} args - Arguments to filter ManuscriptVersions to count.
     * @example
     * // Count the number of ManuscriptVersions
     * const count = await prisma.manuscriptVersion.count({
     *   where: {
     *     // ... the filter for the ManuscriptVersions we want to count
     *   }
     * })
    **/
    count<T extends ManuscriptVersionCountArgs>(
      args?: Subset<T, ManuscriptVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManuscriptVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ManuscriptVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ManuscriptVersionAggregateArgs>(args: Subset<T, ManuscriptVersionAggregateArgs>): Prisma.PrismaPromise<GetManuscriptVersionAggregateType<T>>

    /**
     * Group by ManuscriptVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManuscriptVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ManuscriptVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManuscriptVersionGroupByArgs['orderBy'] }
        : { orderBy?: ManuscriptVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ManuscriptVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManuscriptVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ManuscriptVersion model
   */
  readonly fields: ManuscriptVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ManuscriptVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManuscriptVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    manuscript<T extends ManuscriptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ManuscriptDefaultArgs<ExtArgs>>): Prisma__ManuscriptClient<$Result.GetResult<Prisma.$ManuscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviews<T extends ManuscriptVersion$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, ManuscriptVersion$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ManuscriptVersion model
   */
  interface ManuscriptVersionFieldRefs {
    readonly id: FieldRef<"ManuscriptVersion", 'String'>
    readonly versionNumber: FieldRef<"ManuscriptVersion", 'Int'>
    readonly manuscriptId: FieldRef<"ManuscriptVersion", 'String'>
    readonly documentUrl: FieldRef<"ManuscriptVersion", 'String'>
    readonly documentType: FieldRef<"ManuscriptVersion", 'DocumentType'>
    readonly notes: FieldRef<"ManuscriptVersion", 'String'>
    readonly createdAt: FieldRef<"ManuscriptVersion", 'DateTime'>
    readonly updatedAt: FieldRef<"ManuscriptVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ManuscriptVersion findUnique
   */
  export type ManuscriptVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter, which ManuscriptVersion to fetch.
     */
    where: ManuscriptVersionWhereUniqueInput
  }

  /**
   * ManuscriptVersion findUniqueOrThrow
   */
  export type ManuscriptVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter, which ManuscriptVersion to fetch.
     */
    where: ManuscriptVersionWhereUniqueInput
  }

  /**
   * ManuscriptVersion findFirst
   */
  export type ManuscriptVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter, which ManuscriptVersion to fetch.
     */
    where?: ManuscriptVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManuscriptVersions to fetch.
     */
    orderBy?: ManuscriptVersionOrderByWithRelationInput | ManuscriptVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManuscriptVersions.
     */
    cursor?: ManuscriptVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManuscriptVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManuscriptVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManuscriptVersions.
     */
    distinct?: ManuscriptVersionScalarFieldEnum | ManuscriptVersionScalarFieldEnum[]
  }

  /**
   * ManuscriptVersion findFirstOrThrow
   */
  export type ManuscriptVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter, which ManuscriptVersion to fetch.
     */
    where?: ManuscriptVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManuscriptVersions to fetch.
     */
    orderBy?: ManuscriptVersionOrderByWithRelationInput | ManuscriptVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManuscriptVersions.
     */
    cursor?: ManuscriptVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManuscriptVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManuscriptVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManuscriptVersions.
     */
    distinct?: ManuscriptVersionScalarFieldEnum | ManuscriptVersionScalarFieldEnum[]
  }

  /**
   * ManuscriptVersion findMany
   */
  export type ManuscriptVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter, which ManuscriptVersions to fetch.
     */
    where?: ManuscriptVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManuscriptVersions to fetch.
     */
    orderBy?: ManuscriptVersionOrderByWithRelationInput | ManuscriptVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ManuscriptVersions.
     */
    cursor?: ManuscriptVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManuscriptVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManuscriptVersions.
     */
    skip?: number
    distinct?: ManuscriptVersionScalarFieldEnum | ManuscriptVersionScalarFieldEnum[]
  }

  /**
   * ManuscriptVersion create
   */
  export type ManuscriptVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ManuscriptVersion.
     */
    data: XOR<ManuscriptVersionCreateInput, ManuscriptVersionUncheckedCreateInput>
  }

  /**
   * ManuscriptVersion createMany
   */
  export type ManuscriptVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ManuscriptVersions.
     */
    data: ManuscriptVersionCreateManyInput | ManuscriptVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ManuscriptVersion createManyAndReturn
   */
  export type ManuscriptVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ManuscriptVersions.
     */
    data: ManuscriptVersionCreateManyInput | ManuscriptVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ManuscriptVersion update
   */
  export type ManuscriptVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ManuscriptVersion.
     */
    data: XOR<ManuscriptVersionUpdateInput, ManuscriptVersionUncheckedUpdateInput>
    /**
     * Choose, which ManuscriptVersion to update.
     */
    where: ManuscriptVersionWhereUniqueInput
  }

  /**
   * ManuscriptVersion updateMany
   */
  export type ManuscriptVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ManuscriptVersions.
     */
    data: XOR<ManuscriptVersionUpdateManyMutationInput, ManuscriptVersionUncheckedUpdateManyInput>
    /**
     * Filter which ManuscriptVersions to update
     */
    where?: ManuscriptVersionWhereInput
    /**
     * Limit how many ManuscriptVersions to update.
     */
    limit?: number
  }

  /**
   * ManuscriptVersion updateManyAndReturn
   */
  export type ManuscriptVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * The data used to update ManuscriptVersions.
     */
    data: XOR<ManuscriptVersionUpdateManyMutationInput, ManuscriptVersionUncheckedUpdateManyInput>
    /**
     * Filter which ManuscriptVersions to update
     */
    where?: ManuscriptVersionWhereInput
    /**
     * Limit how many ManuscriptVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ManuscriptVersion upsert
   */
  export type ManuscriptVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ManuscriptVersion to update in case it exists.
     */
    where: ManuscriptVersionWhereUniqueInput
    /**
     * In case the ManuscriptVersion found by the `where` argument doesn't exist, create a new ManuscriptVersion with this data.
     */
    create: XOR<ManuscriptVersionCreateInput, ManuscriptVersionUncheckedCreateInput>
    /**
     * In case the ManuscriptVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManuscriptVersionUpdateInput, ManuscriptVersionUncheckedUpdateInput>
  }

  /**
   * ManuscriptVersion delete
   */
  export type ManuscriptVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
    /**
     * Filter which ManuscriptVersion to delete.
     */
    where: ManuscriptVersionWhereUniqueInput
  }

  /**
   * ManuscriptVersion deleteMany
   */
  export type ManuscriptVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManuscriptVersions to delete
     */
    where?: ManuscriptVersionWhereInput
    /**
     * Limit how many ManuscriptVersions to delete.
     */
    limit?: number
  }

  /**
   * ManuscriptVersion.reviews
   */
  export type ManuscriptVersion$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * ManuscriptVersion without action
   */
  export type ManuscriptVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManuscriptVersion
     */
    select?: ManuscriptVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManuscriptVersion
     */
    omit?: ManuscriptVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManuscriptVersionInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    versionId: string | null
    reviewerId: string | null
    reviewType: $Enums.ReviewType | null
    content: string | null
    documentUrl: string | null
    documentType: $Enums.DocumentType | null
    isSharedExternally: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    versionId: string | null
    reviewerId: string | null
    reviewType: $Enums.ReviewType | null
    content: string | null
    documentUrl: string | null
    documentType: $Enums.DocumentType | null
    isSharedExternally: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    versionId: number
    reviewerId: number
    reviewType: number
    content: number
    documentUrl: number
    documentType: number
    isSharedExternally: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReviewMinAggregateInputType = {
    id?: true
    versionId?: true
    reviewerId?: true
    reviewType?: true
    content?: true
    documentUrl?: true
    documentType?: true
    isSharedExternally?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    versionId?: true
    reviewerId?: true
    reviewType?: true
    content?: true
    documentUrl?: true
    documentType?: true
    isSharedExternally?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    versionId?: true
    reviewerId?: true
    reviewType?: true
    content?: true
    documentUrl?: true
    documentType?: true
    isSharedExternally?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    versionId: string
    reviewerId: string
    reviewType: $Enums.ReviewType
    content: string
    documentUrl: string | null
    documentType: $Enums.DocumentType | null
    isSharedExternally: boolean
    createdAt: Date
    updatedAt: Date
    _count: ReviewCountAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    reviewerId?: boolean
    reviewType?: boolean
    content?: boolean
    documentUrl?: boolean
    documentType?: boolean
    isSharedExternally?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    reviewerId?: boolean
    reviewType?: boolean
    content?: boolean
    documentUrl?: boolean
    documentType?: boolean
    isSharedExternally?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    reviewerId?: boolean
    reviewType?: boolean
    content?: boolean
    documentUrl?: boolean
    documentType?: boolean
    isSharedExternally?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    versionId?: boolean
    reviewerId?: boolean
    reviewType?: boolean
    content?: boolean
    documentUrl?: boolean
    documentType?: boolean
    isSharedExternally?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "versionId" | "reviewerId" | "reviewType" | "content" | "documentUrl" | "documentType" | "isSharedExternally" | "createdAt" | "updatedAt", ExtArgs["result"]["review"]>
  export type ReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | ManuscriptVersionDefaultArgs<ExtArgs>
    reviewer?: boolean | ReviewerDefaultArgs<ExtArgs>
  }

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {
      version: Prisma.$ManuscriptVersionPayload<ExtArgs>
      reviewer: Prisma.$ReviewerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      versionId: string
      reviewerId: string
      reviewType: $Enums.ReviewType
      content: string
      documentUrl: string | null
      documentType: $Enums.DocumentType | null
      isSharedExternally: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews and returns the data updated in the database.
     * @param {ReviewUpdateManyAndReturnArgs} args - Arguments to update many Reviews.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    version<T extends ManuscriptVersionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ManuscriptVersionDefaultArgs<ExtArgs>>): Prisma__ManuscriptVersionClient<$Result.GetResult<Prisma.$ManuscriptVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewer<T extends ReviewerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReviewerDefaultArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly versionId: FieldRef<"Review", 'String'>
    readonly reviewerId: FieldRef<"Review", 'String'>
    readonly reviewType: FieldRef<"Review", 'ReviewType'>
    readonly content: FieldRef<"Review", 'String'>
    readonly documentUrl: FieldRef<"Review", 'String'>
    readonly documentType: FieldRef<"Review", 'DocumentType'>
    readonly isSharedExternally: FieldRef<"Review", 'Boolean'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
    readonly updatedAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review updateManyAndReturn
   */
  export type ReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to delete.
     */
    limit?: number
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
  }


  /**
   * Model Reviewer
   */

  export type AggregateReviewer = {
    _count: ReviewerCountAggregateOutputType | null
    _min: ReviewerMinAggregateOutputType | null
    _max: ReviewerMaxAggregateOutputType | null
  }

  export type ReviewerMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    code: string | null
    affiliation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    code: string | null
    affiliation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewerCountAggregateOutputType = {
    id: number
    name: number
    email: number
    code: number
    affiliation: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReviewerMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    code?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewerMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    code?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewerCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    code?: true
    affiliation?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReviewerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviewer to aggregate.
     */
    where?: ReviewerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviewers to fetch.
     */
    orderBy?: ReviewerOrderByWithRelationInput | ReviewerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviewers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviewers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviewers
    **/
    _count?: true | ReviewerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewerMaxAggregateInputType
  }

  export type GetReviewerAggregateType<T extends ReviewerAggregateArgs> = {
        [P in keyof T & keyof AggregateReviewer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReviewer[P]>
      : GetScalarType<T[P], AggregateReviewer[P]>
  }




  export type ReviewerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewerWhereInput
    orderBy?: ReviewerOrderByWithAggregationInput | ReviewerOrderByWithAggregationInput[]
    by: ReviewerScalarFieldEnum[] | ReviewerScalarFieldEnum
    having?: ReviewerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewerCountAggregateInputType | true
    _min?: ReviewerMinAggregateInputType
    _max?: ReviewerMaxAggregateInputType
  }

  export type ReviewerGroupByOutputType = {
    id: string
    name: string
    email: string | null
    code: string
    affiliation: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReviewerCountAggregateOutputType | null
    _min: ReviewerMinAggregateOutputType | null
    _max: ReviewerMaxAggregateOutputType | null
  }

  type GetReviewerGroupByPayload<T extends ReviewerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewerGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewerGroupByOutputType[P]>
        }
      >
    >


  export type ReviewerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    code?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviews?: boolean | Reviewer$reviewsArgs<ExtArgs>
    _count?: boolean | ReviewerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reviewer"]>

  export type ReviewerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    code?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reviewer"]>

  export type ReviewerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    code?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reviewer"]>

  export type ReviewerSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    code?: boolean
    affiliation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReviewerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "code" | "affiliation" | "createdAt" | "updatedAt", ExtArgs["result"]["reviewer"]>
  export type ReviewerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | Reviewer$reviewsArgs<ExtArgs>
    _count?: boolean | ReviewerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReviewerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ReviewerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ReviewerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reviewer"
    objects: {
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      code: string
      affiliation: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reviewer"]>
    composites: {}
  }

  type ReviewerGetPayload<S extends boolean | null | undefined | ReviewerDefaultArgs> = $Result.GetResult<Prisma.$ReviewerPayload, S>

  type ReviewerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewerCountAggregateInputType | true
    }

  export interface ReviewerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reviewer'], meta: { name: 'Reviewer' } }
    /**
     * Find zero or one Reviewer that matches the filter.
     * @param {ReviewerFindUniqueArgs} args - Arguments to find a Reviewer
     * @example
     * // Get one Reviewer
     * const reviewer = await prisma.reviewer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewerFindUniqueArgs>(args: SelectSubset<T, ReviewerFindUniqueArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reviewer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewerFindUniqueOrThrowArgs} args - Arguments to find a Reviewer
     * @example
     * // Get one Reviewer
     * const reviewer = await prisma.reviewer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewerFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reviewer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerFindFirstArgs} args - Arguments to find a Reviewer
     * @example
     * // Get one Reviewer
     * const reviewer = await prisma.reviewer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewerFindFirstArgs>(args?: SelectSubset<T, ReviewerFindFirstArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reviewer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerFindFirstOrThrowArgs} args - Arguments to find a Reviewer
     * @example
     * // Get one Reviewer
     * const reviewer = await prisma.reviewer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewerFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviewers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviewers
     * const reviewers = await prisma.reviewer.findMany()
     * 
     * // Get first 10 Reviewers
     * const reviewers = await prisma.reviewer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewerWithIdOnly = await prisma.reviewer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewerFindManyArgs>(args?: SelectSubset<T, ReviewerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reviewer.
     * @param {ReviewerCreateArgs} args - Arguments to create a Reviewer.
     * @example
     * // Create one Reviewer
     * const Reviewer = await prisma.reviewer.create({
     *   data: {
     *     // ... data to create a Reviewer
     *   }
     * })
     * 
     */
    create<T extends ReviewerCreateArgs>(args: SelectSubset<T, ReviewerCreateArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviewers.
     * @param {ReviewerCreateManyArgs} args - Arguments to create many Reviewers.
     * @example
     * // Create many Reviewers
     * const reviewer = await prisma.reviewer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewerCreateManyArgs>(args?: SelectSubset<T, ReviewerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviewers and returns the data saved in the database.
     * @param {ReviewerCreateManyAndReturnArgs} args - Arguments to create many Reviewers.
     * @example
     * // Create many Reviewers
     * const reviewer = await prisma.reviewer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviewers and only return the `id`
     * const reviewerWithIdOnly = await prisma.reviewer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewerCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reviewer.
     * @param {ReviewerDeleteArgs} args - Arguments to delete one Reviewer.
     * @example
     * // Delete one Reviewer
     * const Reviewer = await prisma.reviewer.delete({
     *   where: {
     *     // ... filter to delete one Reviewer
     *   }
     * })
     * 
     */
    delete<T extends ReviewerDeleteArgs>(args: SelectSubset<T, ReviewerDeleteArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reviewer.
     * @param {ReviewerUpdateArgs} args - Arguments to update one Reviewer.
     * @example
     * // Update one Reviewer
     * const reviewer = await prisma.reviewer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewerUpdateArgs>(args: SelectSubset<T, ReviewerUpdateArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviewers.
     * @param {ReviewerDeleteManyArgs} args - Arguments to filter Reviewers to delete.
     * @example
     * // Delete a few Reviewers
     * const { count } = await prisma.reviewer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewerDeleteManyArgs>(args?: SelectSubset<T, ReviewerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviewers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviewers
     * const reviewer = await prisma.reviewer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewerUpdateManyArgs>(args: SelectSubset<T, ReviewerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviewers and returns the data updated in the database.
     * @param {ReviewerUpdateManyAndReturnArgs} args - Arguments to update many Reviewers.
     * @example
     * // Update many Reviewers
     * const reviewer = await prisma.reviewer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviewers and only return the `id`
     * const reviewerWithIdOnly = await prisma.reviewer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewerUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reviewer.
     * @param {ReviewerUpsertArgs} args - Arguments to update or create a Reviewer.
     * @example
     * // Update or create a Reviewer
     * const reviewer = await prisma.reviewer.upsert({
     *   create: {
     *     // ... data to create a Reviewer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reviewer we want to update
     *   }
     * })
     */
    upsert<T extends ReviewerUpsertArgs>(args: SelectSubset<T, ReviewerUpsertArgs<ExtArgs>>): Prisma__ReviewerClient<$Result.GetResult<Prisma.$ReviewerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviewers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerCountArgs} args - Arguments to filter Reviewers to count.
     * @example
     * // Count the number of Reviewers
     * const count = await prisma.reviewer.count({
     *   where: {
     *     // ... the filter for the Reviewers we want to count
     *   }
     * })
    **/
    count<T extends ReviewerCountArgs>(
      args?: Subset<T, ReviewerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reviewer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewerAggregateArgs>(args: Subset<T, ReviewerAggregateArgs>): Prisma.PrismaPromise<GetReviewerAggregateType<T>>

    /**
     * Group by Reviewer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewerGroupByArgs['orderBy'] }
        : { orderBy?: ReviewerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reviewer model
   */
  readonly fields: ReviewerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reviewer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviews<T extends Reviewer$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Reviewer$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reviewer model
   */
  interface ReviewerFieldRefs {
    readonly id: FieldRef<"Reviewer", 'String'>
    readonly name: FieldRef<"Reviewer", 'String'>
    readonly email: FieldRef<"Reviewer", 'String'>
    readonly code: FieldRef<"Reviewer", 'String'>
    readonly affiliation: FieldRef<"Reviewer", 'String'>
    readonly createdAt: FieldRef<"Reviewer", 'DateTime'>
    readonly updatedAt: FieldRef<"Reviewer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reviewer findUnique
   */
  export type ReviewerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter, which Reviewer to fetch.
     */
    where: ReviewerWhereUniqueInput
  }

  /**
   * Reviewer findUniqueOrThrow
   */
  export type ReviewerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter, which Reviewer to fetch.
     */
    where: ReviewerWhereUniqueInput
  }

  /**
   * Reviewer findFirst
   */
  export type ReviewerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter, which Reviewer to fetch.
     */
    where?: ReviewerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviewers to fetch.
     */
    orderBy?: ReviewerOrderByWithRelationInput | ReviewerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviewers.
     */
    cursor?: ReviewerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviewers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviewers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviewers.
     */
    distinct?: ReviewerScalarFieldEnum | ReviewerScalarFieldEnum[]
  }

  /**
   * Reviewer findFirstOrThrow
   */
  export type ReviewerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter, which Reviewer to fetch.
     */
    where?: ReviewerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviewers to fetch.
     */
    orderBy?: ReviewerOrderByWithRelationInput | ReviewerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviewers.
     */
    cursor?: ReviewerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviewers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviewers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviewers.
     */
    distinct?: ReviewerScalarFieldEnum | ReviewerScalarFieldEnum[]
  }

  /**
   * Reviewer findMany
   */
  export type ReviewerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter, which Reviewers to fetch.
     */
    where?: ReviewerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviewers to fetch.
     */
    orderBy?: ReviewerOrderByWithRelationInput | ReviewerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviewers.
     */
    cursor?: ReviewerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviewers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviewers.
     */
    skip?: number
    distinct?: ReviewerScalarFieldEnum | ReviewerScalarFieldEnum[]
  }

  /**
   * Reviewer create
   */
  export type ReviewerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * The data needed to create a Reviewer.
     */
    data: XOR<ReviewerCreateInput, ReviewerUncheckedCreateInput>
  }

  /**
   * Reviewer createMany
   */
  export type ReviewerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviewers.
     */
    data: ReviewerCreateManyInput | ReviewerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reviewer createManyAndReturn
   */
  export type ReviewerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * The data used to create many Reviewers.
     */
    data: ReviewerCreateManyInput | ReviewerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reviewer update
   */
  export type ReviewerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * The data needed to update a Reviewer.
     */
    data: XOR<ReviewerUpdateInput, ReviewerUncheckedUpdateInput>
    /**
     * Choose, which Reviewer to update.
     */
    where: ReviewerWhereUniqueInput
  }

  /**
   * Reviewer updateMany
   */
  export type ReviewerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviewers.
     */
    data: XOR<ReviewerUpdateManyMutationInput, ReviewerUncheckedUpdateManyInput>
    /**
     * Filter which Reviewers to update
     */
    where?: ReviewerWhereInput
    /**
     * Limit how many Reviewers to update.
     */
    limit?: number
  }

  /**
   * Reviewer updateManyAndReturn
   */
  export type ReviewerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * The data used to update Reviewers.
     */
    data: XOR<ReviewerUpdateManyMutationInput, ReviewerUncheckedUpdateManyInput>
    /**
     * Filter which Reviewers to update
     */
    where?: ReviewerWhereInput
    /**
     * Limit how many Reviewers to update.
     */
    limit?: number
  }

  /**
   * Reviewer upsert
   */
  export type ReviewerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * The filter to search for the Reviewer to update in case it exists.
     */
    where: ReviewerWhereUniqueInput
    /**
     * In case the Reviewer found by the `where` argument doesn't exist, create a new Reviewer with this data.
     */
    create: XOR<ReviewerCreateInput, ReviewerUncheckedCreateInput>
    /**
     * In case the Reviewer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewerUpdateInput, ReviewerUncheckedUpdateInput>
  }

  /**
   * Reviewer delete
   */
  export type ReviewerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
    /**
     * Filter which Reviewer to delete.
     */
    where: ReviewerWhereUniqueInput
  }

  /**
   * Reviewer deleteMany
   */
  export type ReviewerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviewers to delete
     */
    where?: ReviewerWhereInput
    /**
     * Limit how many Reviewers to delete.
     */
    limit?: number
  }

  /**
   * Reviewer.reviews
   */
  export type Reviewer$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Reviewer without action
   */
  export type ReviewerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reviewer
     */
    select?: ReviewerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reviewer
     */
    omit?: ReviewerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuthorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    affiliation: 'affiliation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthorScalarFieldEnum = (typeof AuthorScalarFieldEnum)[keyof typeof AuthorScalarFieldEnum]


  export const ManuscriptScalarFieldEnum: {
    id: 'id',
    title: 'title',
    abstract: 'abstract',
    keywords: 'keywords',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    pubmedUrl: 'pubmedUrl',
    f1000Url: 'f1000Url'
  };

  export type ManuscriptScalarFieldEnum = (typeof ManuscriptScalarFieldEnum)[keyof typeof ManuscriptScalarFieldEnum]


  export const ManuscriptVersionScalarFieldEnum: {
    id: 'id',
    versionNumber: 'versionNumber',
    manuscriptId: 'manuscriptId',
    documentUrl: 'documentUrl',
    documentType: 'documentType',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ManuscriptVersionScalarFieldEnum = (typeof ManuscriptVersionScalarFieldEnum)[keyof typeof ManuscriptVersionScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    versionId: 'versionId',
    reviewerId: 'reviewerId',
    reviewType: 'reviewType',
    content: 'content',
    documentUrl: 'documentUrl',
    documentType: 'documentType',
    isSharedExternally: 'isSharedExternally',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const ReviewerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    code: 'code',
    affiliation: 'affiliation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReviewerScalarFieldEnum = (typeof ReviewerScalarFieldEnum)[keyof typeof ReviewerScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ManuscriptStatus'
   */
  export type EnumManuscriptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ManuscriptStatus'>
    


  /**
   * Reference to a field of type 'ManuscriptStatus[]'
   */
  export type ListEnumManuscriptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ManuscriptStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'ReviewType'
   */
  export type EnumReviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReviewType'>
    


  /**
   * Reference to a field of type 'ReviewType[]'
   */
  export type ListEnumReviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReviewType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuthorWhereInput = {
    AND?: AuthorWhereInput | AuthorWhereInput[]
    OR?: AuthorWhereInput[]
    NOT?: AuthorWhereInput | AuthorWhereInput[]
    id?: StringFilter<"Author"> | string
    name?: StringFilter<"Author"> | string
    email?: StringNullableFilter<"Author"> | string | null
    affiliation?: StringNullableFilter<"Author"> | string | null
    createdAt?: DateTimeFilter<"Author"> | Date | string
    updatedAt?: DateTimeFilter<"Author"> | Date | string
    manuscripts?: ManuscriptListRelationFilter
  }

  export type AuthorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    affiliation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    manuscripts?: ManuscriptOrderByRelationAggregateInput
  }

  export type AuthorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuthorWhereInput | AuthorWhereInput[]
    OR?: AuthorWhereInput[]
    NOT?: AuthorWhereInput | AuthorWhereInput[]
    name?: StringFilter<"Author"> | string
    email?: StringNullableFilter<"Author"> | string | null
    affiliation?: StringNullableFilter<"Author"> | string | null
    createdAt?: DateTimeFilter<"Author"> | Date | string
    updatedAt?: DateTimeFilter<"Author"> | Date | string
    manuscripts?: ManuscriptListRelationFilter
  }, "id">

  export type AuthorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    affiliation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthorCountOrderByAggregateInput
    _max?: AuthorMaxOrderByAggregateInput
    _min?: AuthorMinOrderByAggregateInput
  }

  export type AuthorScalarWhereWithAggregatesInput = {
    AND?: AuthorScalarWhereWithAggregatesInput | AuthorScalarWhereWithAggregatesInput[]
    OR?: AuthorScalarWhereWithAggregatesInput[]
    NOT?: AuthorScalarWhereWithAggregatesInput | AuthorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Author"> | string
    name?: StringWithAggregatesFilter<"Author"> | string
    email?: StringNullableWithAggregatesFilter<"Author"> | string | null
    affiliation?: StringNullableWithAggregatesFilter<"Author"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Author"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Author"> | Date | string
  }

  export type ManuscriptWhereInput = {
    AND?: ManuscriptWhereInput | ManuscriptWhereInput[]
    OR?: ManuscriptWhereInput[]
    NOT?: ManuscriptWhereInput | ManuscriptWhereInput[]
    id?: StringFilter<"Manuscript"> | string
    title?: StringFilter<"Manuscript"> | string
    abstract?: StringNullableFilter<"Manuscript"> | string | null
    keywords?: StringNullableListFilter<"Manuscript">
    status?: EnumManuscriptStatusFilter<"Manuscript"> | $Enums.ManuscriptStatus
    createdAt?: DateTimeFilter<"Manuscript"> | Date | string
    updatedAt?: DateTimeFilter<"Manuscript"> | Date | string
    pubmedUrl?: StringNullableFilter<"Manuscript"> | string | null
    f1000Url?: StringNullableFilter<"Manuscript"> | string | null
    authors?: AuthorListRelationFilter
    versions?: ManuscriptVersionListRelationFilter
  }

  export type ManuscriptOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrderInput | SortOrder
    keywords?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pubmedUrl?: SortOrderInput | SortOrder
    f1000Url?: SortOrderInput | SortOrder
    authors?: AuthorOrderByRelationAggregateInput
    versions?: ManuscriptVersionOrderByRelationAggregateInput
  }

  export type ManuscriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ManuscriptWhereInput | ManuscriptWhereInput[]
    OR?: ManuscriptWhereInput[]
    NOT?: ManuscriptWhereInput | ManuscriptWhereInput[]
    title?: StringFilter<"Manuscript"> | string
    abstract?: StringNullableFilter<"Manuscript"> | string | null
    keywords?: StringNullableListFilter<"Manuscript">
    status?: EnumManuscriptStatusFilter<"Manuscript"> | $Enums.ManuscriptStatus
    createdAt?: DateTimeFilter<"Manuscript"> | Date | string
    updatedAt?: DateTimeFilter<"Manuscript"> | Date | string
    pubmedUrl?: StringNullableFilter<"Manuscript"> | string | null
    f1000Url?: StringNullableFilter<"Manuscript"> | string | null
    authors?: AuthorListRelationFilter
    versions?: ManuscriptVersionListRelationFilter
  }, "id">

  export type ManuscriptOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrderInput | SortOrder
    keywords?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pubmedUrl?: SortOrderInput | SortOrder
    f1000Url?: SortOrderInput | SortOrder
    _count?: ManuscriptCountOrderByAggregateInput
    _max?: ManuscriptMaxOrderByAggregateInput
    _min?: ManuscriptMinOrderByAggregateInput
  }

  export type ManuscriptScalarWhereWithAggregatesInput = {
    AND?: ManuscriptScalarWhereWithAggregatesInput | ManuscriptScalarWhereWithAggregatesInput[]
    OR?: ManuscriptScalarWhereWithAggregatesInput[]
    NOT?: ManuscriptScalarWhereWithAggregatesInput | ManuscriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Manuscript"> | string
    title?: StringWithAggregatesFilter<"Manuscript"> | string
    abstract?: StringNullableWithAggregatesFilter<"Manuscript"> | string | null
    keywords?: StringNullableListFilter<"Manuscript">
    status?: EnumManuscriptStatusWithAggregatesFilter<"Manuscript"> | $Enums.ManuscriptStatus
    createdAt?: DateTimeWithAggregatesFilter<"Manuscript"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Manuscript"> | Date | string
    pubmedUrl?: StringNullableWithAggregatesFilter<"Manuscript"> | string | null
    f1000Url?: StringNullableWithAggregatesFilter<"Manuscript"> | string | null
  }

  export type ManuscriptVersionWhereInput = {
    AND?: ManuscriptVersionWhereInput | ManuscriptVersionWhereInput[]
    OR?: ManuscriptVersionWhereInput[]
    NOT?: ManuscriptVersionWhereInput | ManuscriptVersionWhereInput[]
    id?: StringFilter<"ManuscriptVersion"> | string
    versionNumber?: IntFilter<"ManuscriptVersion"> | number
    manuscriptId?: StringFilter<"ManuscriptVersion"> | string
    documentUrl?: StringNullableFilter<"ManuscriptVersion"> | string | null
    documentType?: EnumDocumentTypeFilter<"ManuscriptVersion"> | $Enums.DocumentType
    notes?: StringNullableFilter<"ManuscriptVersion"> | string | null
    createdAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
    updatedAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
    manuscript?: XOR<ManuscriptScalarRelationFilter, ManuscriptWhereInput>
    reviews?: ReviewListRelationFilter
  }

  export type ManuscriptVersionOrderByWithRelationInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    manuscriptId?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentType?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    manuscript?: ManuscriptOrderByWithRelationInput
    reviews?: ReviewOrderByRelationAggregateInput
  }

  export type ManuscriptVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    manuscriptId_versionNumber?: ManuscriptVersionManuscriptIdVersionNumberCompoundUniqueInput
    AND?: ManuscriptVersionWhereInput | ManuscriptVersionWhereInput[]
    OR?: ManuscriptVersionWhereInput[]
    NOT?: ManuscriptVersionWhereInput | ManuscriptVersionWhereInput[]
    versionNumber?: IntFilter<"ManuscriptVersion"> | number
    manuscriptId?: StringFilter<"ManuscriptVersion"> | string
    documentUrl?: StringNullableFilter<"ManuscriptVersion"> | string | null
    documentType?: EnumDocumentTypeFilter<"ManuscriptVersion"> | $Enums.DocumentType
    notes?: StringNullableFilter<"ManuscriptVersion"> | string | null
    createdAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
    updatedAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
    manuscript?: XOR<ManuscriptScalarRelationFilter, ManuscriptWhereInput>
    reviews?: ReviewListRelationFilter
  }, "id" | "manuscriptId_versionNumber">

  export type ManuscriptVersionOrderByWithAggregationInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    manuscriptId?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentType?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ManuscriptVersionCountOrderByAggregateInput
    _avg?: ManuscriptVersionAvgOrderByAggregateInput
    _max?: ManuscriptVersionMaxOrderByAggregateInput
    _min?: ManuscriptVersionMinOrderByAggregateInput
    _sum?: ManuscriptVersionSumOrderByAggregateInput
  }

  export type ManuscriptVersionScalarWhereWithAggregatesInput = {
    AND?: ManuscriptVersionScalarWhereWithAggregatesInput | ManuscriptVersionScalarWhereWithAggregatesInput[]
    OR?: ManuscriptVersionScalarWhereWithAggregatesInput[]
    NOT?: ManuscriptVersionScalarWhereWithAggregatesInput | ManuscriptVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ManuscriptVersion"> | string
    versionNumber?: IntWithAggregatesFilter<"ManuscriptVersion"> | number
    manuscriptId?: StringWithAggregatesFilter<"ManuscriptVersion"> | string
    documentUrl?: StringNullableWithAggregatesFilter<"ManuscriptVersion"> | string | null
    documentType?: EnumDocumentTypeWithAggregatesFilter<"ManuscriptVersion"> | $Enums.DocumentType
    notes?: StringNullableWithAggregatesFilter<"ManuscriptVersion"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ManuscriptVersion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ManuscriptVersion"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    versionId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    reviewType?: EnumReviewTypeFilter<"Review"> | $Enums.ReviewType
    content?: StringFilter<"Review"> | string
    documentUrl?: StringNullableFilter<"Review"> | string | null
    documentType?: EnumDocumentTypeNullableFilter<"Review"> | $Enums.DocumentType | null
    isSharedExternally?: BoolFilter<"Review"> | boolean
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
    version?: XOR<ManuscriptVersionScalarRelationFilter, ManuscriptVersionWhereInput>
    reviewer?: XOR<ReviewerScalarRelationFilter, ReviewerWhereInput>
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    versionId?: SortOrder
    reviewerId?: SortOrder
    reviewType?: SortOrder
    content?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentType?: SortOrderInput | SortOrder
    isSharedExternally?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: ManuscriptVersionOrderByWithRelationInput
    reviewer?: ReviewerOrderByWithRelationInput
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    versionId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    reviewType?: EnumReviewTypeFilter<"Review"> | $Enums.ReviewType
    content?: StringFilter<"Review"> | string
    documentUrl?: StringNullableFilter<"Review"> | string | null
    documentType?: EnumDocumentTypeNullableFilter<"Review"> | $Enums.DocumentType | null
    isSharedExternally?: BoolFilter<"Review"> | boolean
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
    version?: XOR<ManuscriptVersionScalarRelationFilter, ManuscriptVersionWhereInput>
    reviewer?: XOR<ReviewerScalarRelationFilter, ReviewerWhereInput>
  }, "id">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    versionId?: SortOrder
    reviewerId?: SortOrder
    reviewType?: SortOrder
    content?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentType?: SortOrderInput | SortOrder
    isSharedExternally?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    versionId?: StringWithAggregatesFilter<"Review"> | string
    reviewerId?: StringWithAggregatesFilter<"Review"> | string
    reviewType?: EnumReviewTypeWithAggregatesFilter<"Review"> | $Enums.ReviewType
    content?: StringWithAggregatesFilter<"Review"> | string
    documentUrl?: StringNullableWithAggregatesFilter<"Review"> | string | null
    documentType?: EnumDocumentTypeNullableWithAggregatesFilter<"Review"> | $Enums.DocumentType | null
    isSharedExternally?: BoolWithAggregatesFilter<"Review"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type ReviewerWhereInput = {
    AND?: ReviewerWhereInput | ReviewerWhereInput[]
    OR?: ReviewerWhereInput[]
    NOT?: ReviewerWhereInput | ReviewerWhereInput[]
    id?: StringFilter<"Reviewer"> | string
    name?: StringFilter<"Reviewer"> | string
    email?: StringNullableFilter<"Reviewer"> | string | null
    code?: StringFilter<"Reviewer"> | string
    affiliation?: StringNullableFilter<"Reviewer"> | string | null
    createdAt?: DateTimeFilter<"Reviewer"> | Date | string
    updatedAt?: DateTimeFilter<"Reviewer"> | Date | string
    reviews?: ReviewListRelationFilter
  }

  export type ReviewerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    code?: SortOrder
    affiliation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviews?: ReviewOrderByRelationAggregateInput
  }

  export type ReviewerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: ReviewerWhereInput | ReviewerWhereInput[]
    OR?: ReviewerWhereInput[]
    NOT?: ReviewerWhereInput | ReviewerWhereInput[]
    name?: StringFilter<"Reviewer"> | string
    email?: StringNullableFilter<"Reviewer"> | string | null
    affiliation?: StringNullableFilter<"Reviewer"> | string | null
    createdAt?: DateTimeFilter<"Reviewer"> | Date | string
    updatedAt?: DateTimeFilter<"Reviewer"> | Date | string
    reviews?: ReviewListRelationFilter
  }, "id" | "code">

  export type ReviewerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    code?: SortOrder
    affiliation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReviewerCountOrderByAggregateInput
    _max?: ReviewerMaxOrderByAggregateInput
    _min?: ReviewerMinOrderByAggregateInput
  }

  export type ReviewerScalarWhereWithAggregatesInput = {
    AND?: ReviewerScalarWhereWithAggregatesInput | ReviewerScalarWhereWithAggregatesInput[]
    OR?: ReviewerScalarWhereWithAggregatesInput[]
    NOT?: ReviewerScalarWhereWithAggregatesInput | ReviewerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reviewer"> | string
    name?: StringWithAggregatesFilter<"Reviewer"> | string
    email?: StringNullableWithAggregatesFilter<"Reviewer"> | string | null
    code?: StringWithAggregatesFilter<"Reviewer"> | string
    affiliation?: StringNullableWithAggregatesFilter<"Reviewer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Reviewer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reviewer"> | Date | string
  }

  export type AuthorCreateInput = {
    id?: string
    name: string
    email?: string | null
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    manuscripts?: ManuscriptCreateNestedManyWithoutAuthorsInput
  }

  export type AuthorUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    manuscripts?: ManuscriptUncheckedCreateNestedManyWithoutAuthorsInput
  }

  export type AuthorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    manuscripts?: ManuscriptUpdateManyWithoutAuthorsNestedInput
  }

  export type AuthorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    manuscripts?: ManuscriptUncheckedUpdateManyWithoutAuthorsNestedInput
  }

  export type AuthorCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManuscriptCreateInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    authors?: AuthorCreateNestedManyWithoutManuscriptsInput
    versions?: ManuscriptVersionCreateNestedManyWithoutManuscriptInput
  }

  export type ManuscriptUncheckedCreateInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    authors?: AuthorUncheckedCreateNestedManyWithoutManuscriptsInput
    versions?: ManuscriptVersionUncheckedCreateNestedManyWithoutManuscriptInput
  }

  export type ManuscriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: AuthorUpdateManyWithoutManuscriptsNestedInput
    versions?: ManuscriptVersionUpdateManyWithoutManuscriptNestedInput
  }

  export type ManuscriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: AuthorUncheckedUpdateManyWithoutManuscriptsNestedInput
    versions?: ManuscriptVersionUncheckedUpdateManyWithoutManuscriptNestedInput
  }

  export type ManuscriptCreateManyInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
  }

  export type ManuscriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ManuscriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ManuscriptVersionCreateInput = {
    id?: string
    versionNumber: number
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    manuscript: ManuscriptCreateNestedOneWithoutVersionsInput
    reviews?: ReviewCreateNestedManyWithoutVersionInput
  }

  export type ManuscriptVersionUncheckedCreateInput = {
    id?: string
    versionNumber: number
    manuscriptId: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutVersionInput
  }

  export type ManuscriptVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    manuscript?: ManuscriptUpdateOneRequiredWithoutVersionsNestedInput
    reviews?: ReviewUpdateManyWithoutVersionNestedInput
  }

  export type ManuscriptVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    manuscriptId?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutVersionNestedInput
  }

  export type ManuscriptVersionCreateManyInput = {
    id?: string
    versionNumber: number
    manuscriptId: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManuscriptVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManuscriptVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    manuscriptId?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    id?: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    version: ManuscriptVersionCreateNestedOneWithoutReviewsInput
    reviewer: ReviewerCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    versionId: string
    reviewerId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: ManuscriptVersionUpdateOneRequiredWithoutReviewsNestedInput
    reviewer?: ReviewerUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    versionId: string
    reviewerId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewerCreateInput = {
    id?: string
    name: string
    email?: string | null
    code: string
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutReviewerInput
  }

  export type ReviewerUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    code: string
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutReviewerInput
  }

  export type ReviewerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutReviewerNestedInput
  }

  export type ReviewerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutReviewerNestedInput
  }

  export type ReviewerCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    code: string
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ManuscriptListRelationFilter = {
    every?: ManuscriptWhereInput
    some?: ManuscriptWhereInput
    none?: ManuscriptWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ManuscriptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumManuscriptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ManuscriptStatus | EnumManuscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumManuscriptStatusFilter<$PrismaModel> | $Enums.ManuscriptStatus
  }

  export type AuthorListRelationFilter = {
    every?: AuthorWhereInput
    some?: AuthorWhereInput
    none?: AuthorWhereInput
  }

  export type ManuscriptVersionListRelationFilter = {
    every?: ManuscriptVersionWhereInput
    some?: ManuscriptVersionWhereInput
    none?: ManuscriptVersionWhereInput
  }

  export type AuthorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ManuscriptVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ManuscriptCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    keywords?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pubmedUrl?: SortOrder
    f1000Url?: SortOrder
  }

  export type ManuscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pubmedUrl?: SortOrder
    f1000Url?: SortOrder
  }

  export type ManuscriptMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pubmedUrl?: SortOrder
    f1000Url?: SortOrder
  }

  export type EnumManuscriptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ManuscriptStatus | EnumManuscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumManuscriptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ManuscriptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumManuscriptStatusFilter<$PrismaModel>
    _max?: NestedEnumManuscriptStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type ManuscriptScalarRelationFilter = {
    is?: ManuscriptWhereInput
    isNot?: ManuscriptWhereInput
  }

  export type ReviewListRelationFilter = {
    every?: ReviewWhereInput
    some?: ReviewWhereInput
    none?: ReviewWhereInput
  }

  export type ReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ManuscriptVersionManuscriptIdVersionNumberCompoundUniqueInput = {
    manuscriptId: string
    versionNumber: number
  }

  export type ManuscriptVersionCountOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    manuscriptId?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManuscriptVersionAvgOrderByAggregateInput = {
    versionNumber?: SortOrder
  }

  export type ManuscriptVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    manuscriptId?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManuscriptVersionMinOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    manuscriptId?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManuscriptVersionSumOrderByAggregateInput = {
    versionNumber?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type EnumReviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewType | EnumReviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewTypeFilter<$PrismaModel> | $Enums.ReviewType
  }

  export type EnumDocumentTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDocumentTypeNullableFilter<$PrismaModel> | $Enums.DocumentType | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ManuscriptVersionScalarRelationFilter = {
    is?: ManuscriptVersionWhereInput
    isNot?: ManuscriptVersionWhereInput
  }

  export type ReviewerScalarRelationFilter = {
    is?: ReviewerWhereInput
    isNot?: ReviewerWhereInput
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    reviewerId?: SortOrder
    reviewType?: SortOrder
    content?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    isSharedExternally?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    reviewerId?: SortOrder
    reviewType?: SortOrder
    content?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    isSharedExternally?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    reviewerId?: SortOrder
    reviewType?: SortOrder
    content?: SortOrder
    documentUrl?: SortOrder
    documentType?: SortOrder
    isSharedExternally?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumReviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewType | EnumReviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReviewType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewTypeFilter<$PrismaModel>
    _max?: NestedEnumReviewTypeFilter<$PrismaModel>
  }

  export type EnumDocumentTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDocumentTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ReviewerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    code?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    code?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    code?: SortOrder
    affiliation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManuscriptCreateNestedManyWithoutAuthorsInput = {
    create?: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput> | ManuscriptCreateWithoutAuthorsInput[] | ManuscriptUncheckedCreateWithoutAuthorsInput[]
    connectOrCreate?: ManuscriptCreateOrConnectWithoutAuthorsInput | ManuscriptCreateOrConnectWithoutAuthorsInput[]
    connect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
  }

  export type ManuscriptUncheckedCreateNestedManyWithoutAuthorsInput = {
    create?: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput> | ManuscriptCreateWithoutAuthorsInput[] | ManuscriptUncheckedCreateWithoutAuthorsInput[]
    connectOrCreate?: ManuscriptCreateOrConnectWithoutAuthorsInput | ManuscriptCreateOrConnectWithoutAuthorsInput[]
    connect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ManuscriptUpdateManyWithoutAuthorsNestedInput = {
    create?: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput> | ManuscriptCreateWithoutAuthorsInput[] | ManuscriptUncheckedCreateWithoutAuthorsInput[]
    connectOrCreate?: ManuscriptCreateOrConnectWithoutAuthorsInput | ManuscriptCreateOrConnectWithoutAuthorsInput[]
    upsert?: ManuscriptUpsertWithWhereUniqueWithoutAuthorsInput | ManuscriptUpsertWithWhereUniqueWithoutAuthorsInput[]
    set?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    disconnect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    delete?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    connect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    update?: ManuscriptUpdateWithWhereUniqueWithoutAuthorsInput | ManuscriptUpdateWithWhereUniqueWithoutAuthorsInput[]
    updateMany?: ManuscriptUpdateManyWithWhereWithoutAuthorsInput | ManuscriptUpdateManyWithWhereWithoutAuthorsInput[]
    deleteMany?: ManuscriptScalarWhereInput | ManuscriptScalarWhereInput[]
  }

  export type ManuscriptUncheckedUpdateManyWithoutAuthorsNestedInput = {
    create?: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput> | ManuscriptCreateWithoutAuthorsInput[] | ManuscriptUncheckedCreateWithoutAuthorsInput[]
    connectOrCreate?: ManuscriptCreateOrConnectWithoutAuthorsInput | ManuscriptCreateOrConnectWithoutAuthorsInput[]
    upsert?: ManuscriptUpsertWithWhereUniqueWithoutAuthorsInput | ManuscriptUpsertWithWhereUniqueWithoutAuthorsInput[]
    set?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    disconnect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    delete?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    connect?: ManuscriptWhereUniqueInput | ManuscriptWhereUniqueInput[]
    update?: ManuscriptUpdateWithWhereUniqueWithoutAuthorsInput | ManuscriptUpdateWithWhereUniqueWithoutAuthorsInput[]
    updateMany?: ManuscriptUpdateManyWithWhereWithoutAuthorsInput | ManuscriptUpdateManyWithWhereWithoutAuthorsInput[]
    deleteMany?: ManuscriptScalarWhereInput | ManuscriptScalarWhereInput[]
  }

  export type ManuscriptCreatekeywordsInput = {
    set: string[]
  }

  export type AuthorCreateNestedManyWithoutManuscriptsInput = {
    create?: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput> | AuthorCreateWithoutManuscriptsInput[] | AuthorUncheckedCreateWithoutManuscriptsInput[]
    connectOrCreate?: AuthorCreateOrConnectWithoutManuscriptsInput | AuthorCreateOrConnectWithoutManuscriptsInput[]
    connect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
  }

  export type ManuscriptVersionCreateNestedManyWithoutManuscriptInput = {
    create?: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput> | ManuscriptVersionCreateWithoutManuscriptInput[] | ManuscriptVersionUncheckedCreateWithoutManuscriptInput[]
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutManuscriptInput | ManuscriptVersionCreateOrConnectWithoutManuscriptInput[]
    createMany?: ManuscriptVersionCreateManyManuscriptInputEnvelope
    connect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
  }

  export type AuthorUncheckedCreateNestedManyWithoutManuscriptsInput = {
    create?: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput> | AuthorCreateWithoutManuscriptsInput[] | AuthorUncheckedCreateWithoutManuscriptsInput[]
    connectOrCreate?: AuthorCreateOrConnectWithoutManuscriptsInput | AuthorCreateOrConnectWithoutManuscriptsInput[]
    connect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
  }

  export type ManuscriptVersionUncheckedCreateNestedManyWithoutManuscriptInput = {
    create?: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput> | ManuscriptVersionCreateWithoutManuscriptInput[] | ManuscriptVersionUncheckedCreateWithoutManuscriptInput[]
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutManuscriptInput | ManuscriptVersionCreateOrConnectWithoutManuscriptInput[]
    createMany?: ManuscriptVersionCreateManyManuscriptInputEnvelope
    connect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
  }

  export type ManuscriptUpdatekeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumManuscriptStatusFieldUpdateOperationsInput = {
    set?: $Enums.ManuscriptStatus
  }

  export type AuthorUpdateManyWithoutManuscriptsNestedInput = {
    create?: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput> | AuthorCreateWithoutManuscriptsInput[] | AuthorUncheckedCreateWithoutManuscriptsInput[]
    connectOrCreate?: AuthorCreateOrConnectWithoutManuscriptsInput | AuthorCreateOrConnectWithoutManuscriptsInput[]
    upsert?: AuthorUpsertWithWhereUniqueWithoutManuscriptsInput | AuthorUpsertWithWhereUniqueWithoutManuscriptsInput[]
    set?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    disconnect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    delete?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    connect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    update?: AuthorUpdateWithWhereUniqueWithoutManuscriptsInput | AuthorUpdateWithWhereUniqueWithoutManuscriptsInput[]
    updateMany?: AuthorUpdateManyWithWhereWithoutManuscriptsInput | AuthorUpdateManyWithWhereWithoutManuscriptsInput[]
    deleteMany?: AuthorScalarWhereInput | AuthorScalarWhereInput[]
  }

  export type ManuscriptVersionUpdateManyWithoutManuscriptNestedInput = {
    create?: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput> | ManuscriptVersionCreateWithoutManuscriptInput[] | ManuscriptVersionUncheckedCreateWithoutManuscriptInput[]
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutManuscriptInput | ManuscriptVersionCreateOrConnectWithoutManuscriptInput[]
    upsert?: ManuscriptVersionUpsertWithWhereUniqueWithoutManuscriptInput | ManuscriptVersionUpsertWithWhereUniqueWithoutManuscriptInput[]
    createMany?: ManuscriptVersionCreateManyManuscriptInputEnvelope
    set?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    disconnect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    delete?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    connect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    update?: ManuscriptVersionUpdateWithWhereUniqueWithoutManuscriptInput | ManuscriptVersionUpdateWithWhereUniqueWithoutManuscriptInput[]
    updateMany?: ManuscriptVersionUpdateManyWithWhereWithoutManuscriptInput | ManuscriptVersionUpdateManyWithWhereWithoutManuscriptInput[]
    deleteMany?: ManuscriptVersionScalarWhereInput | ManuscriptVersionScalarWhereInput[]
  }

  export type AuthorUncheckedUpdateManyWithoutManuscriptsNestedInput = {
    create?: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput> | AuthorCreateWithoutManuscriptsInput[] | AuthorUncheckedCreateWithoutManuscriptsInput[]
    connectOrCreate?: AuthorCreateOrConnectWithoutManuscriptsInput | AuthorCreateOrConnectWithoutManuscriptsInput[]
    upsert?: AuthorUpsertWithWhereUniqueWithoutManuscriptsInput | AuthorUpsertWithWhereUniqueWithoutManuscriptsInput[]
    set?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    disconnect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    delete?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    connect?: AuthorWhereUniqueInput | AuthorWhereUniqueInput[]
    update?: AuthorUpdateWithWhereUniqueWithoutManuscriptsInput | AuthorUpdateWithWhereUniqueWithoutManuscriptsInput[]
    updateMany?: AuthorUpdateManyWithWhereWithoutManuscriptsInput | AuthorUpdateManyWithWhereWithoutManuscriptsInput[]
    deleteMany?: AuthorScalarWhereInput | AuthorScalarWhereInput[]
  }

  export type ManuscriptVersionUncheckedUpdateManyWithoutManuscriptNestedInput = {
    create?: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput> | ManuscriptVersionCreateWithoutManuscriptInput[] | ManuscriptVersionUncheckedCreateWithoutManuscriptInput[]
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutManuscriptInput | ManuscriptVersionCreateOrConnectWithoutManuscriptInput[]
    upsert?: ManuscriptVersionUpsertWithWhereUniqueWithoutManuscriptInput | ManuscriptVersionUpsertWithWhereUniqueWithoutManuscriptInput[]
    createMany?: ManuscriptVersionCreateManyManuscriptInputEnvelope
    set?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    disconnect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    delete?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    connect?: ManuscriptVersionWhereUniqueInput | ManuscriptVersionWhereUniqueInput[]
    update?: ManuscriptVersionUpdateWithWhereUniqueWithoutManuscriptInput | ManuscriptVersionUpdateWithWhereUniqueWithoutManuscriptInput[]
    updateMany?: ManuscriptVersionUpdateManyWithWhereWithoutManuscriptInput | ManuscriptVersionUpdateManyWithWhereWithoutManuscriptInput[]
    deleteMany?: ManuscriptVersionScalarWhereInput | ManuscriptVersionScalarWhereInput[]
  }

  export type ManuscriptCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ManuscriptCreateWithoutVersionsInput, ManuscriptUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ManuscriptCreateOrConnectWithoutVersionsInput
    connect?: ManuscriptWhereUniqueInput
  }

  export type ReviewCreateNestedManyWithoutVersionInput = {
    create?: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput> | ReviewCreateWithoutVersionInput[] | ReviewUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutVersionInput | ReviewCreateOrConnectWithoutVersionInput[]
    createMany?: ReviewCreateManyVersionInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutVersionInput = {
    create?: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput> | ReviewCreateWithoutVersionInput[] | ReviewUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutVersionInput | ReviewCreateOrConnectWithoutVersionInput[]
    createMany?: ReviewCreateManyVersionInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type ManuscriptUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ManuscriptCreateWithoutVersionsInput, ManuscriptUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ManuscriptCreateOrConnectWithoutVersionsInput
    upsert?: ManuscriptUpsertWithoutVersionsInput
    connect?: ManuscriptWhereUniqueInput
    update?: XOR<XOR<ManuscriptUpdateToOneWithWhereWithoutVersionsInput, ManuscriptUpdateWithoutVersionsInput>, ManuscriptUncheckedUpdateWithoutVersionsInput>
  }

  export type ReviewUpdateManyWithoutVersionNestedInput = {
    create?: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput> | ReviewCreateWithoutVersionInput[] | ReviewUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutVersionInput | ReviewCreateOrConnectWithoutVersionInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutVersionInput | ReviewUpsertWithWhereUniqueWithoutVersionInput[]
    createMany?: ReviewCreateManyVersionInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutVersionInput | ReviewUpdateWithWhereUniqueWithoutVersionInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutVersionInput | ReviewUpdateManyWithWhereWithoutVersionInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutVersionNestedInput = {
    create?: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput> | ReviewCreateWithoutVersionInput[] | ReviewUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutVersionInput | ReviewCreateOrConnectWithoutVersionInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutVersionInput | ReviewUpsertWithWhereUniqueWithoutVersionInput[]
    createMany?: ReviewCreateManyVersionInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutVersionInput | ReviewUpdateWithWhereUniqueWithoutVersionInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutVersionInput | ReviewUpdateManyWithWhereWithoutVersionInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type ManuscriptVersionCreateNestedOneWithoutReviewsInput = {
    create?: XOR<ManuscriptVersionCreateWithoutReviewsInput, ManuscriptVersionUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutReviewsInput
    connect?: ManuscriptVersionWhereUniqueInput
  }

  export type ReviewerCreateNestedOneWithoutReviewsInput = {
    create?: XOR<ReviewerCreateWithoutReviewsInput, ReviewerUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ReviewerCreateOrConnectWithoutReviewsInput
    connect?: ReviewerWhereUniqueInput
  }

  export type EnumReviewTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReviewType
  }

  export type NullableEnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ManuscriptVersionUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<ManuscriptVersionCreateWithoutReviewsInput, ManuscriptVersionUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ManuscriptVersionCreateOrConnectWithoutReviewsInput
    upsert?: ManuscriptVersionUpsertWithoutReviewsInput
    connect?: ManuscriptVersionWhereUniqueInput
    update?: XOR<XOR<ManuscriptVersionUpdateToOneWithWhereWithoutReviewsInput, ManuscriptVersionUpdateWithoutReviewsInput>, ManuscriptVersionUncheckedUpdateWithoutReviewsInput>
  }

  export type ReviewerUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<ReviewerCreateWithoutReviewsInput, ReviewerUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ReviewerCreateOrConnectWithoutReviewsInput
    upsert?: ReviewerUpsertWithoutReviewsInput
    connect?: ReviewerWhereUniqueInput
    update?: XOR<XOR<ReviewerUpdateToOneWithWhereWithoutReviewsInput, ReviewerUpdateWithoutReviewsInput>, ReviewerUncheckedUpdateWithoutReviewsInput>
  }

  export type ReviewCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type ReviewUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutReviewerInput | ReviewUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutReviewerInput | ReviewUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutReviewerInput | ReviewUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutReviewerInput | ReviewUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutReviewerInput | ReviewUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutReviewerInput | ReviewUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumManuscriptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ManuscriptStatus | EnumManuscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumManuscriptStatusFilter<$PrismaModel> | $Enums.ManuscriptStatus
  }

  export type NestedEnumManuscriptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ManuscriptStatus | EnumManuscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ManuscriptStatus[] | ListEnumManuscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumManuscriptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ManuscriptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumManuscriptStatusFilter<$PrismaModel>
    _max?: NestedEnumManuscriptStatusFilter<$PrismaModel>
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumReviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewType | EnumReviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewTypeFilter<$PrismaModel> | $Enums.ReviewType
  }

  export type NestedEnumDocumentTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDocumentTypeNullableFilter<$PrismaModel> | $Enums.DocumentType | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumReviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewType | EnumReviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReviewType[] | ListEnumReviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReviewType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewTypeFilter<$PrismaModel>
    _max?: NestedEnumReviewTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDocumentTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ManuscriptCreateWithoutAuthorsInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    versions?: ManuscriptVersionCreateNestedManyWithoutManuscriptInput
  }

  export type ManuscriptUncheckedCreateWithoutAuthorsInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    versions?: ManuscriptVersionUncheckedCreateNestedManyWithoutManuscriptInput
  }

  export type ManuscriptCreateOrConnectWithoutAuthorsInput = {
    where: ManuscriptWhereUniqueInput
    create: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput>
  }

  export type ManuscriptUpsertWithWhereUniqueWithoutAuthorsInput = {
    where: ManuscriptWhereUniqueInput
    update: XOR<ManuscriptUpdateWithoutAuthorsInput, ManuscriptUncheckedUpdateWithoutAuthorsInput>
    create: XOR<ManuscriptCreateWithoutAuthorsInput, ManuscriptUncheckedCreateWithoutAuthorsInput>
  }

  export type ManuscriptUpdateWithWhereUniqueWithoutAuthorsInput = {
    where: ManuscriptWhereUniqueInput
    data: XOR<ManuscriptUpdateWithoutAuthorsInput, ManuscriptUncheckedUpdateWithoutAuthorsInput>
  }

  export type ManuscriptUpdateManyWithWhereWithoutAuthorsInput = {
    where: ManuscriptScalarWhereInput
    data: XOR<ManuscriptUpdateManyMutationInput, ManuscriptUncheckedUpdateManyWithoutAuthorsInput>
  }

  export type ManuscriptScalarWhereInput = {
    AND?: ManuscriptScalarWhereInput | ManuscriptScalarWhereInput[]
    OR?: ManuscriptScalarWhereInput[]
    NOT?: ManuscriptScalarWhereInput | ManuscriptScalarWhereInput[]
    id?: StringFilter<"Manuscript"> | string
    title?: StringFilter<"Manuscript"> | string
    abstract?: StringNullableFilter<"Manuscript"> | string | null
    keywords?: StringNullableListFilter<"Manuscript">
    status?: EnumManuscriptStatusFilter<"Manuscript"> | $Enums.ManuscriptStatus
    createdAt?: DateTimeFilter<"Manuscript"> | Date | string
    updatedAt?: DateTimeFilter<"Manuscript"> | Date | string
    pubmedUrl?: StringNullableFilter<"Manuscript"> | string | null
    f1000Url?: StringNullableFilter<"Manuscript"> | string | null
  }

  export type AuthorCreateWithoutManuscriptsInput = {
    id?: string
    name: string
    email?: string | null
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthorUncheckedCreateWithoutManuscriptsInput = {
    id?: string
    name: string
    email?: string | null
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthorCreateOrConnectWithoutManuscriptsInput = {
    where: AuthorWhereUniqueInput
    create: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput>
  }

  export type ManuscriptVersionCreateWithoutManuscriptInput = {
    id?: string
    versionNumber: number
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutVersionInput
  }

  export type ManuscriptVersionUncheckedCreateWithoutManuscriptInput = {
    id?: string
    versionNumber: number
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutVersionInput
  }

  export type ManuscriptVersionCreateOrConnectWithoutManuscriptInput = {
    where: ManuscriptVersionWhereUniqueInput
    create: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput>
  }

  export type ManuscriptVersionCreateManyManuscriptInputEnvelope = {
    data: ManuscriptVersionCreateManyManuscriptInput | ManuscriptVersionCreateManyManuscriptInput[]
    skipDuplicates?: boolean
  }

  export type AuthorUpsertWithWhereUniqueWithoutManuscriptsInput = {
    where: AuthorWhereUniqueInput
    update: XOR<AuthorUpdateWithoutManuscriptsInput, AuthorUncheckedUpdateWithoutManuscriptsInput>
    create: XOR<AuthorCreateWithoutManuscriptsInput, AuthorUncheckedCreateWithoutManuscriptsInput>
  }

  export type AuthorUpdateWithWhereUniqueWithoutManuscriptsInput = {
    where: AuthorWhereUniqueInput
    data: XOR<AuthorUpdateWithoutManuscriptsInput, AuthorUncheckedUpdateWithoutManuscriptsInput>
  }

  export type AuthorUpdateManyWithWhereWithoutManuscriptsInput = {
    where: AuthorScalarWhereInput
    data: XOR<AuthorUpdateManyMutationInput, AuthorUncheckedUpdateManyWithoutManuscriptsInput>
  }

  export type AuthorScalarWhereInput = {
    AND?: AuthorScalarWhereInput | AuthorScalarWhereInput[]
    OR?: AuthorScalarWhereInput[]
    NOT?: AuthorScalarWhereInput | AuthorScalarWhereInput[]
    id?: StringFilter<"Author"> | string
    name?: StringFilter<"Author"> | string
    email?: StringNullableFilter<"Author"> | string | null
    affiliation?: StringNullableFilter<"Author"> | string | null
    createdAt?: DateTimeFilter<"Author"> | Date | string
    updatedAt?: DateTimeFilter<"Author"> | Date | string
  }

  export type ManuscriptVersionUpsertWithWhereUniqueWithoutManuscriptInput = {
    where: ManuscriptVersionWhereUniqueInput
    update: XOR<ManuscriptVersionUpdateWithoutManuscriptInput, ManuscriptVersionUncheckedUpdateWithoutManuscriptInput>
    create: XOR<ManuscriptVersionCreateWithoutManuscriptInput, ManuscriptVersionUncheckedCreateWithoutManuscriptInput>
  }

  export type ManuscriptVersionUpdateWithWhereUniqueWithoutManuscriptInput = {
    where: ManuscriptVersionWhereUniqueInput
    data: XOR<ManuscriptVersionUpdateWithoutManuscriptInput, ManuscriptVersionUncheckedUpdateWithoutManuscriptInput>
  }

  export type ManuscriptVersionUpdateManyWithWhereWithoutManuscriptInput = {
    where: ManuscriptVersionScalarWhereInput
    data: XOR<ManuscriptVersionUpdateManyMutationInput, ManuscriptVersionUncheckedUpdateManyWithoutManuscriptInput>
  }

  export type ManuscriptVersionScalarWhereInput = {
    AND?: ManuscriptVersionScalarWhereInput | ManuscriptVersionScalarWhereInput[]
    OR?: ManuscriptVersionScalarWhereInput[]
    NOT?: ManuscriptVersionScalarWhereInput | ManuscriptVersionScalarWhereInput[]
    id?: StringFilter<"ManuscriptVersion"> | string
    versionNumber?: IntFilter<"ManuscriptVersion"> | number
    manuscriptId?: StringFilter<"ManuscriptVersion"> | string
    documentUrl?: StringNullableFilter<"ManuscriptVersion"> | string | null
    documentType?: EnumDocumentTypeFilter<"ManuscriptVersion"> | $Enums.DocumentType
    notes?: StringNullableFilter<"ManuscriptVersion"> | string | null
    createdAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
    updatedAt?: DateTimeFilter<"ManuscriptVersion"> | Date | string
  }

  export type ManuscriptCreateWithoutVersionsInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    authors?: AuthorCreateNestedManyWithoutManuscriptsInput
  }

  export type ManuscriptUncheckedCreateWithoutVersionsInput = {
    id?: string
    title: string
    abstract?: string | null
    keywords?: ManuscriptCreatekeywordsInput | string[]
    status?: $Enums.ManuscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    pubmedUrl?: string | null
    f1000Url?: string | null
    authors?: AuthorUncheckedCreateNestedManyWithoutManuscriptsInput
  }

  export type ManuscriptCreateOrConnectWithoutVersionsInput = {
    where: ManuscriptWhereUniqueInput
    create: XOR<ManuscriptCreateWithoutVersionsInput, ManuscriptUncheckedCreateWithoutVersionsInput>
  }

  export type ReviewCreateWithoutVersionInput = {
    id?: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewer: ReviewerCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateWithoutVersionInput = {
    id?: string
    reviewerId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutVersionInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput>
  }

  export type ReviewCreateManyVersionInputEnvelope = {
    data: ReviewCreateManyVersionInput | ReviewCreateManyVersionInput[]
    skipDuplicates?: boolean
  }

  export type ManuscriptUpsertWithoutVersionsInput = {
    update: XOR<ManuscriptUpdateWithoutVersionsInput, ManuscriptUncheckedUpdateWithoutVersionsInput>
    create: XOR<ManuscriptCreateWithoutVersionsInput, ManuscriptUncheckedCreateWithoutVersionsInput>
    where?: ManuscriptWhereInput
  }

  export type ManuscriptUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ManuscriptWhereInput
    data: XOR<ManuscriptUpdateWithoutVersionsInput, ManuscriptUncheckedUpdateWithoutVersionsInput>
  }

  export type ManuscriptUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: AuthorUpdateManyWithoutManuscriptsNestedInput
  }

  export type ManuscriptUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: AuthorUncheckedUpdateManyWithoutManuscriptsNestedInput
  }

  export type ReviewUpsertWithWhereUniqueWithoutVersionInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutVersionInput, ReviewUncheckedUpdateWithoutVersionInput>
    create: XOR<ReviewCreateWithoutVersionInput, ReviewUncheckedCreateWithoutVersionInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutVersionInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutVersionInput, ReviewUncheckedUpdateWithoutVersionInput>
  }

  export type ReviewUpdateManyWithWhereWithoutVersionInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutVersionInput>
  }

  export type ReviewScalarWhereInput = {
    AND?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    OR?: ReviewScalarWhereInput[]
    NOT?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    id?: StringFilter<"Review"> | string
    versionId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    reviewType?: EnumReviewTypeFilter<"Review"> | $Enums.ReviewType
    content?: StringFilter<"Review"> | string
    documentUrl?: StringNullableFilter<"Review"> | string | null
    documentType?: EnumDocumentTypeNullableFilter<"Review"> | $Enums.DocumentType | null
    isSharedExternally?: BoolFilter<"Review"> | boolean
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type ManuscriptVersionCreateWithoutReviewsInput = {
    id?: string
    versionNumber: number
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    manuscript: ManuscriptCreateNestedOneWithoutVersionsInput
  }

  export type ManuscriptVersionUncheckedCreateWithoutReviewsInput = {
    id?: string
    versionNumber: number
    manuscriptId: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManuscriptVersionCreateOrConnectWithoutReviewsInput = {
    where: ManuscriptVersionWhereUniqueInput
    create: XOR<ManuscriptVersionCreateWithoutReviewsInput, ManuscriptVersionUncheckedCreateWithoutReviewsInput>
  }

  export type ReviewerCreateWithoutReviewsInput = {
    id?: string
    name: string
    email?: string | null
    code: string
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewerUncheckedCreateWithoutReviewsInput = {
    id?: string
    name: string
    email?: string | null
    code: string
    affiliation?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewerCreateOrConnectWithoutReviewsInput = {
    where: ReviewerWhereUniqueInput
    create: XOR<ReviewerCreateWithoutReviewsInput, ReviewerUncheckedCreateWithoutReviewsInput>
  }

  export type ManuscriptVersionUpsertWithoutReviewsInput = {
    update: XOR<ManuscriptVersionUpdateWithoutReviewsInput, ManuscriptVersionUncheckedUpdateWithoutReviewsInput>
    create: XOR<ManuscriptVersionCreateWithoutReviewsInput, ManuscriptVersionUncheckedCreateWithoutReviewsInput>
    where?: ManuscriptVersionWhereInput
  }

  export type ManuscriptVersionUpdateToOneWithWhereWithoutReviewsInput = {
    where?: ManuscriptVersionWhereInput
    data: XOR<ManuscriptVersionUpdateWithoutReviewsInput, ManuscriptVersionUncheckedUpdateWithoutReviewsInput>
  }

  export type ManuscriptVersionUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    manuscript?: ManuscriptUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ManuscriptVersionUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    manuscriptId?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewerUpsertWithoutReviewsInput = {
    update: XOR<ReviewerUpdateWithoutReviewsInput, ReviewerUncheckedUpdateWithoutReviewsInput>
    create: XOR<ReviewerCreateWithoutReviewsInput, ReviewerUncheckedCreateWithoutReviewsInput>
    where?: ReviewerWhereInput
  }

  export type ReviewerUpdateToOneWithWhereWithoutReviewsInput = {
    where?: ReviewerWhereInput
    data: XOR<ReviewerUpdateWithoutReviewsInput, ReviewerUncheckedUpdateWithoutReviewsInput>
  }

  export type ReviewerUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewerUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateWithoutReviewerInput = {
    id?: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    version: ManuscriptVersionCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateWithoutReviewerInput = {
    id?: string
    versionId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewCreateManyReviewerInputEnvelope = {
    data: ReviewCreateManyReviewerInput | ReviewCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type ReviewUpsertWithWhereUniqueWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutReviewerInput, ReviewUncheckedUpdateWithoutReviewerInput>
    create: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutReviewerInput, ReviewUncheckedUpdateWithoutReviewerInput>
  }

  export type ReviewUpdateManyWithWhereWithoutReviewerInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutReviewerInput>
  }

  export type ManuscriptUpdateWithoutAuthorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ManuscriptVersionUpdateManyWithoutManuscriptNestedInput
  }

  export type ManuscriptUncheckedUpdateWithoutAuthorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ManuscriptVersionUncheckedUpdateManyWithoutManuscriptNestedInput
  }

  export type ManuscriptUncheckedUpdateManyWithoutAuthorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: ManuscriptUpdatekeywordsInput | string[]
    status?: EnumManuscriptStatusFieldUpdateOperationsInput | $Enums.ManuscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pubmedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    f1000Url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ManuscriptVersionCreateManyManuscriptInput = {
    id?: string
    versionNumber: number
    documentUrl?: string | null
    documentType?: $Enums.DocumentType
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthorUpdateWithoutManuscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthorUncheckedUpdateWithoutManuscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthorUncheckedUpdateManyWithoutManuscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    affiliation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManuscriptVersionUpdateWithoutManuscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutVersionNestedInput
  }

  export type ManuscriptVersionUncheckedUpdateWithoutManuscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutVersionNestedInput
  }

  export type ManuscriptVersionUncheckedUpdateManyWithoutManuscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyVersionInput = {
    id?: string
    reviewerId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewer?: ReviewerUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyReviewerInput = {
    id?: string
    versionId: string
    reviewType?: $Enums.ReviewType
    content: string
    documentUrl?: string | null
    documentType?: $Enums.DocumentType | null
    isSharedExternally?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: ManuscriptVersionUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: StringFieldUpdateOperationsInput | string
    reviewType?: EnumReviewTypeFieldUpdateOperationsInput | $Enums.ReviewType
    content?: StringFieldUpdateOperationsInput | string
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableEnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType | null
    isSharedExternally?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}