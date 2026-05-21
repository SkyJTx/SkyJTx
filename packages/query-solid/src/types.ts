export type UseQueryOptionsBase<TData, TError = unknown> = {
  queryKey: string[] | (() => string[]) | string | (() => string);
  queryFn: () => Promise<TData>;
  enabled?: boolean | (() => boolean);
};

export type UseQueryOptions<TData, TError = unknown> = UseQueryOptionsBase<
  TData,
  TError
> & {
  initialData?: TData | (() => TData);
};

export type UseQueryOptionsWithInitialData<
  TData,
  TError = unknown,
> = UseQueryOptionsBase<TData, TError> & {
  initialData: TData | (() => TData);
};

export type UseQueryOptionsWithoutInitialData<
  TData,
  TError = unknown,
> = UseQueryOptionsBase<TData, TError> & {
  initialData?: undefined;
};

export type UseQueryResult<TData, TError, THasInitialData extends boolean> = {
  data: THasInitialData extends true ? TData : TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | undefined;
  isSuccess: boolean;
  refetch: () => Promise<unknown>;
  mutate: (value: TData) => void;
};

export type UseMutationOptions<TVariables, TData, TError = unknown> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
  ) => void;
};
