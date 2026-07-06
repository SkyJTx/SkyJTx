/**
 * Base configuration options for query execution.
 *
 * @template TData - The expected type of the query data.
 * @template TError - The expected type of the error.
 */
export type UseQueryOptionsBase<TData, TError = unknown> = {
  /** The unique key or key-generating function identifying the query. */
  queryKey: unknown[] | (() => unknown[]) | string | (() => string);
  /** The asynchronous function to fetch the query data. */
  queryFn: () => Promise<TData>;
  /** Whether the query should execute automatically. */
  enabled?: boolean | (() => boolean);
  /** Duration in milliseconds before the cached data is considered stale. */
  staleTime?: number;
  /** Duration in milliseconds before inactive cached data is garbage collected. */
  gcTime?: number;
};

/**
 * Configuration options for query execution, supporting an optional initialData field.
 *
 * @template TData - The expected type of the query data.
 * @template TError - The expected type of the error.
 */
export type UseQueryOptions<TData, TError = unknown> = UseQueryOptionsBase<
  TData,
  TError
> & {
  /** Optional initial data or a function that returns the initial data. */
  initialData?: TData | (() => TData);
};

/**
 * Configuration options for query execution where initialData is required.
 *
 * @template TData - The expected type of the query data.
 * @template TError - The expected type of the error.
 */
export type UseQueryOptionsWithInitialData<
  TData,
  TError = unknown,
> = UseQueryOptionsBase<TData, TError> & {
  /** Required initial data or a function that returns the initial data. */
  initialData: TData | (() => TData);
};

/**
 * Configuration options for query execution where initialData must be undefined.
 *
 * @template TData - The expected type of the query data.
 * @template TError - The expected type of the error.
 */
export type UseQueryOptionsWithoutInitialData<
  TData,
  TError = unknown,
> = UseQueryOptionsBase<TData, TError> & {
  /** Must not be defined. */
  initialData?: undefined;
};

/**
 * The reactive object returned by the useSolidQuery hook.
 *
 * @template TData - The expected type of the query data.
 * @template TError - The expected type of the error.
 * @template THasInitialData - Boolean indicating if initialData was provided.
 */
export type UseQueryResult<TData, TError, THasInitialData extends boolean> = {
  /** The resolved data. Guaranteed to be defined if THasInitialData is true. */
  data: THasInitialData extends true ? TData : TData | undefined;
  /** Whether the query is currently loading. */
  isLoading: boolean;
  /** Whether the query execution failed. */
  isError: boolean;
  /** The error object, if query execution failed. */
  error: TError | undefined;
  /** Whether the query successfully resolved with data. */
  isSuccess: boolean;
  /** Function to trigger a manual refetch of the query. */
  refetch: () => Promise<unknown>;
  /** Function to manually mutate the cached data. */
  mutate: (value: TData) => void;
};

/**
 * Configuration options for mutation execution.
 *
 * @template TVariables - The variables type accepted by the mutation function.
 * @template TData - The expected type of the mutation data.
 * @template TError - The expected type of the error.
 */
export type UseMutationOptions<TVariables, TData, TError = unknown> = {
  /** The asynchronous function to perform the mutation. */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Callback executed when mutation succeeds. */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback executed when mutation fails. */
  onError?: (error: TError, variables: TVariables) => void;
  /** Callback executed when mutation finishes, regardless of success or failure. */
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
  ) => void;
};

