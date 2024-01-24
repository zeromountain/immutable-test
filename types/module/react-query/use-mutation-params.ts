import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AsyncFnReturn } from '@/types/utility/async-fn-return';
import { Parameter } from '@/types/utility/parameter';
import { AsyncFn } from '@/types/static/async-fn';
import { WrapVariables } from './wrap-variables';

// Example : const useAnyMutation = ({ options, variables } : UseMutationParams<typeof anyApiFn>) => {...}

export type UseMutationParams<
  T extends AsyncFn,
  Error = AxiosError<any>,
  Data = AsyncFnReturn<T>,
  Variables = Parameter<T>,
> = {
  options?: Omit<
    UseMutationOptions<Data, Error, Variables>,
    'mutationFn' | 'mutationKey'
  >;
}