import { useQuery } from '@tanstack/react-query'

import authApi from './AuthApi'

import { Parameter } from '@/types/utility/parameter'
import { UseQueryParams } from '@/types/module/react-query/use-query-params'
import { isNotNull } from '@/utils/validate/is-not-null'

export const AUTH_API_QUERY_KEY = {
  CHECK_REGISTERED: (params?: Parameter<typeof authApi.checkUserRegistration>) => ['CHECK_REGISTERED', params].filter(isNotNull)
}

export const useCheckRegistered = (
  params: UseQueryParams<typeof authApi.checkUserRegistration>
) => {
  const queryKey = AUTH_API_QUERY_KEY.CHECK_REGISTERED(params?.variables);

  return useQuery({
    queryKey,
    queryFn: () => authApi.checkUserRegistration(params?.variables),
    ...params?.options
  })
}