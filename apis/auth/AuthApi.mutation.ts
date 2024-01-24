import { Parameter } from "@/types/utility/parameter";
import authApi from "./AuthApi";
import { isNotNull } from "@/utils/validate/is-not-null";
import { UseMutationParams } from "@/types/module/react-query/use-mutation-params";
import { useMutation } from "@tanstack/react-query";

export const AUTH_API_MUTATION_KEY = {
  SIGNUP_REQUEST: (params?: Parameter<typeof authApi.requestSignup>) => ['SIGNUP_REQUEST', params].filter(isNotNull),
  SIGNUP_VERIFY: (params?: Parameter<typeof authApi.verifySignup>) => ['SIGNUP_VERIFY', params].filter(isNotNull),
}

export const useRequestSignup = (
  params: UseMutationParams<typeof authApi.requestSignup>
) => {
  return useMutation({
    mutationFn: authApi.requestSignup,
    ...params.options,
  })
}

export const useVerifySignup = (
  params: UseMutationParams<typeof authApi.verifySignup>
) => useMutation({
  mutationFn: authApi.verifySignup,
  ...params.options,
})

export const useRequestLogin = (
  params: UseMutationParams<typeof authApi.requestLogin>
) => useMutation({
  mutationFn: authApi.requestLogin,
  ...params.options,
})

export const useVerifyLogin = (
  params: UseMutationParams<typeof authApi.verifyLogin>
) => useMutation({
  mutationFn: authApi.verifyLogin,
  ...params.options,
})