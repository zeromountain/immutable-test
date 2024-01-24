"use client"

import React, {
  PropsWithChildren,
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { IMXProvider } from '@imtbl/sdk/provider';
import { Provider, UserProfile } from '@imtbl/sdk/passport';
import { useStatusProvider } from './StatusProvider';
import { useImmutableProvider } from './ImmutableProvider';
import { useCheckRegistered } from '@/apis/auth/AuthApi.query';
import { useRequestSignup, useVerifySignup } from '@/apis/auth/AuthApi.mutation';
import { tokenStorage } from '@/utils/web-storage/token';
import { request } from 'http';

const PassportContext = createContext<{
  imxProvider: IMXProvider | undefined;
  zkEvmProvider: Provider | undefined;
  connectImx:() => void;
  connectZkEvm: () => void;
  logout: () => void;
  login: () => void;
  getIdToken: () => Promise<string | undefined>;
  getAccessToken: () => Promise<string | undefined>;
  getUserInfo: () => Promise<UserProfile | undefined>;
  getLinkedAddresses: () => Promise<string[] | undefined>;
  requestAccounts: () => Promise<void>;
  requestSignature: () => Promise<void>;
  profile: UserProfile | null;
}>({
      imxProvider: undefined,
      zkEvmProvider: undefined,
      connectImx: () => undefined,
      connectZkEvm: () => undefined,
      logout: () => undefined,
      login: () => Promise.resolve(undefined),
      getIdToken: () => Promise.resolve(undefined),
      getAccessToken: () => Promise.resolve(undefined),
      getUserInfo: () => Promise.resolve(undefined),
      getLinkedAddresses: () => Promise.resolve(undefined),
      requestAccounts: () => Promise.resolve(undefined),
      requestSignature: () => Promise.resolve(undefined),
      profile: null
    });

export function PassportProvider({
  children,
}: PropsWithChildren<{}>) {
  const [imxProvider, setImxProvider] = useState<IMXProvider | undefined>();
  const [zkEvmProvider, setZkEvmProvider] = useState<Provider | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenge, setChallenge] = useState<string | undefined>();
  const [signature, setSignature] = useState<string | undefined>();

  const { addMessage, setIsLoading } = useStatusProvider();
  const { passportClient } = useImmutableProvider();

  const {data} = useCheckRegistered({
    variables: address || '',
    options: {
      enabled: !!address,
    }
  });

  const {mutate: requestSignupMutation} = useRequestSignup({
    options: {
      onSuccess: (data) => {
        alert('회원가입 요청 API 실행 성공')
        console.log('[request]: 회원가입', {data});
        if(data.data.challenge)  {
          setChallenge(data?.data?.challenge)
        }
      }
    },
  })

  const {mutate: verifySignupMutation} = useVerifySignup({
    options: {
      onSuccess: (data) => {
        console.log('[verify]: 회원가입',{data});

        if(data.data) {
          tokenStorage?.set({
            access: data.data.accessToken,
            refresh: data.data.refreshToken
          })

          alert('토큰 발급 완료')
        }

        
      }
    }
  })

  const connectImx = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = await passportClient.connectImx();
      if (provider) {
        setImxProvider(provider);
        addMessage('ConnectImx', 'Connected');
      } else {
        addMessage('ConnectImx', 'Failed to connect');
      }
    } catch (err) {
      addMessage('ConnectImx', err);
    } finally {
      setIsLoading(false);
    }
  }, [passportClient, setIsLoading, addMessage]);

  const connectZkEvm = useCallback(async () => {
    setIsLoading(true);
    const provider = passportClient.connectEvm();
    if (provider) {
      console.log({provider})
      setZkEvmProvider(provider);
      addMessage('ConnectZkEvm', 'Connected');
    } else {
      addMessage('ConnectZkEvm', 'Failed to connect');
    }
    setIsLoading(false);
  }, [passportClient, setIsLoading, addMessage]);

  const getIdToken = useCallback(async () => {
    setIsLoading(true);
    const idToken = await passportClient.getIdToken();
    addMessage('Get ID token', idToken);
    setIsLoading(false);

    return idToken;
  }, [passportClient, setIsLoading, addMessage]);

  const getAccessToken = useCallback(async () => {
    setIsLoading(true);
    const accessToken = await passportClient.getAccessToken();
    addMessage('Get Access token', accessToken);
    setIsLoading(false);

    return accessToken;
  }, [passportClient, setIsLoading, addMessage]);

  const getUserInfo = useCallback(async () => {
    setIsLoading(true);
    const userInfo = await passportClient.getUserInfo();
    addMessage('Get User Info', userInfo);
    setIsLoading(false);

    return userInfo;
  }, [passportClient, setIsLoading, addMessage]);

  const getLinkedAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log({passportClient})
      const linkedAddresses = await passportClient.getLinkedAddresses();
      addMessage('Get Linked Addresses', linkedAddresses);
      return linkedAddresses;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      }

  }, [passportClient, setIsLoading, addMessage]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await passportClient.logout();
      setAddress(undefined);
      setImxProvider(undefined);
      setZkEvmProvider(undefined);
    } catch (err) {
      addMessage('Logout', err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, passportClient, setIsLoading]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      const userProfile = await passportClient.login();
      setProfile(userProfile);
      addMessage('Login', userProfile);
    } catch (err) {
      addMessage('Login', err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, passportClient, setIsLoading]);

  const requestAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      if(!zkEvmProvider) throw new Error('zkEvmProvider is undefined');

      const addresses = await zkEvmProvider.request({method: 'eth_requestAccounts'})
      console.log({addresses})
      setAddress(addresses[0])
      addMessage('Request Accounts', addresses);
    } catch (err) {
      console.log({err})
      console.error(err);
      // addMessage('', addresses);
    } finally {
      setIsLoading(false);
    }
  }, [zkEvmProvider, setIsLoading, addMessage])

  const requestSignature = useCallback(async () => {
    try {
      setIsLoading(true);
      if(!zkEvmProvider) throw new Error('zkEvmProvider is undefined');
      if(!address) throw new Error('address is undefined');
      const chainId = await zkEvmProvider.request({method: 'eth_chainId'})
      const typedData = {
          domain: {
            name: 'Ether Mail',
            version: '1',
            chainId,
            verifyingContract: '0xd64b0d2d72bb1b3f18046b8a7fc6c9ee6bccd287',
          },
          message: {
              from: {
              name: 'Cow',
              wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              },
              to: {
              name: 'Bob',
              wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              },
              contents: `Welcome Luxon\n\n challenge is : ${challenge}`,
          },
          primaryType: 'Mail',
          types: {
              EIP712Domain: [
              {
                  name: 'name',
                  type: 'string',
              },
              {
                  name: 'version',
                  type: 'string',
              },
              {
                  name: 'chainId',
                  type: 'uint256',
              },
              {
                  name: 'verifyingContract',
                  type: 'address',
              },
              ],
              Person: [
              {
                  name: 'name',
                  type: 'string',
              },
              {
                  name: 'wallet',
                  type: 'address',
              },
              ],
              Mail: [
              {
                  name: 'from',
                  type: 'Person',
              },
              {
                  name: 'to',
                  type: 'Person',
              },
              {
                  name: 'contents',
                  type: 'string',
              },
              ],
          },
      }
      const signature = await zkEvmProvider.request({method: 'eth_signTypedData_v4', params: [address, typedData]})
      
      console.log({signature})
      setSignature(signature);
      addMessage('Request Signature', signature);
      requestSignupMutation({
        address: address || '',
        birthedAt: '1991-07-30',
        consentPrivacyAct: true,
      })
    } catch (err) {
      console.log({err})
      console.error(err);
      // addMessage('', addresses);
    } finally {
      setIsLoading(false);
    }
  }
  , [zkEvmProvider, address, challenge, setIsLoading, addMessage, requestSignupMutation])

  const providerValues = useMemo(() => ({
    imxProvider,
    zkEvmProvider,
    connectImx,
    connectZkEvm,
    logout,
    login,
    getIdToken,
    getAccessToken,
    getUserInfo,
    getLinkedAddresses,
    requestAccounts,
    requestSignature,
    profile
  }), [
    imxProvider,
    zkEvmProvider,
    connectImx,
    connectZkEvm,
    logout,
    login,
    getIdToken,
    getAccessToken,
    getUserInfo,
    getLinkedAddresses,
    requestAccounts,
    requestSignature,
    profile
  ]);

  useEffect(() => {
    if(profile) {
      connectZkEvm();
    }
  }, [profile])

  useEffect(() => {
    if(zkEvmProvider) {
      requestAccounts();
    }
  }, [zkEvmProvider])

  useEffect(() => {
    if(!data) return;
    if(data?.code === 101 && !signature) {
      // TODO: 회원가입 진행
      alert('등록되지 않은 계정입니다.')
      requestSignature();
      return;
    }

    alert('등록된 계정입니다.')
  }, [data, signature, requestSignature]);

  useEffect(() =>{
    if(challenge) {
      verifySignupMutation({
            address: address || '',
            challenge: challenge,
            wallet: 'passport',
            signature: signature || '',
          })
    }
  }, [challenge, address, signature, verifySignupMutation])

  console.log({challenge, address, signature})

  return (
    <PassportContext.Provider value={providerValues}>
      {children}
    </PassportContext.Provider>
  );
}

export function usePassportProvider() {
  const {
    imxProvider,
    zkEvmProvider,
    connectImx,
    connectZkEvm,
    login,
    logout,
    getIdToken,
    getAccessToken,
    getUserInfo,
    getLinkedAddresses,
    requestAccounts,
    requestSignature,
  } = useContext(PassportContext);

  return {
    imxProvider,
    zkEvmProvider,
    connectImx,
    connectZkEvm,
    login,
    logout,
    getIdToken,
    getAccessToken,
    getUserInfo,
    getLinkedAddresses,
    requestAccounts,
    requestSignature
  };
}
