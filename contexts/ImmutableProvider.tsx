"use client";

import React, {
  PropsWithChildren,
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { Config, ImmutableX } from '@imtbl/core-sdk';
import { Passport, PassportModuleConfiguration } from '@imtbl/sdk/passport';
import {passport} from '@imtbl/sdk';
import { Environment, ImmutableConfiguration } from '@imtbl/sdk/config';
import { ImmutableXClient } from '@imtbl/sdk/immutablex_client';
import {
  AUDIENCE,
  LOGOUT_REDIRECT_URI,
  REDIRECT_URI,
  SILENT_LOGOUT_REDIRECT_URI,
  LOGOUT_MODE,
  SCOPE,
  PASSPORT_PUBLIC_KEY,
  PASSPORT_API_KEY,
  PASSPORT_CLIENT_ID,
} from '@/config';
import { EnvironmentNames } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';

const getCoreSdkConfig = (environment: EnvironmentNames) => {
  switch (environment) {
    case EnvironmentNames.PRODUCTION: {
      return Config.PRODUCTION;
    }
    case EnvironmentNames.SANDBOX: {
      return Config.SANDBOX;
    }
    case EnvironmentNames.DEV: {
      return Config.createConfig({
        basePath: 'https://api.dev.x.immutable.com',
        chainID: 5,
        coreContractAddress: '0xd05323731807A35599BF9798a1DE15e89d6D6eF1',
        registrationContractAddress: '0x7EB840223a3b1E0e8D54bF8A6cd83df5AFfC88B2',
      });
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
};

const getPassportConfig = (environment: EnvironmentNames) => {
  const sharedConfigurationValues = {
    scope: SCOPE,
    audience: AUDIENCE,
    redirectUri: REDIRECT_URI,
    logoutMode: LOGOUT_MODE,
    logoutRedirectUri: LOGOUT_MODE === 'silent'
      ? SILENT_LOGOUT_REDIRECT_URI
      : LOGOUT_REDIRECT_URI,
  };
  const keyMap = {
    publishableKey: PASSPORT_PUBLIC_KEY,
    apiKey: PASSPORT_API_KEY,
  }

  switch (environment) {
    case EnvironmentNames.PRODUCTION: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.PRODUCTION,
          ...keyMap,
        }),
        clientId: PASSPORT_CLIENT_ID,
        ...sharedConfigurationValues,
      };
    }
    case EnvironmentNames.SANDBOX: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.SANDBOX,
          ...keyMap,
        }),
        clientId: PASSPORT_CLIENT_ID,
        ...sharedConfigurationValues,
      };
    }
    case EnvironmentNames.DEV: {
      const baseConfig = new ImmutableConfiguration({
        environment: Environment.SANDBOX,
        ...keyMap,
      });
      const immutableXClient = new ImmutableXClient({
            baseConfig,
            overrides: {
              immutableXConfig: getCoreSdkConfig(EnvironmentNames.DEV),
            },
          })
      return {
        baseConfig,
        clientId: PASSPORT_CLIENT_ID,
        ...sharedConfigurationValues,
      };
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
};

const ImmutableContext = createContext<{
  passportClient: passport.Passport,
  coreSdkClient: ImmutableX,
  environment: EnvironmentNames,
  setEnvironment?:(environment: EnvironmentNames) => void;
}>({
      coreSdkClient: new ImmutableX(getCoreSdkConfig(EnvironmentNames.DEV)),
      passportClient: new passport.Passport(getPassportConfig(EnvironmentNames.DEV)),
      environment: EnvironmentNames.DEV,
    });

export function ImmutableProvider({
  children,
}: PropsWithChildren<{}>) {
  const [environment, setEnvironment] = useLocalStorage(
    'IMX_PASSPORT_SAMPLE_ENVIRONMENT',
    useContext(ImmutableContext).environment,
  );
  const [coreSdkClient, setCoreSdkClient] = useState<ImmutableX>(
    useContext(ImmutableContext).coreSdkClient,
  );
  const [passportClient, setPassportClient] = useState<any>(
    useContext(ImmutableContext).passportClient,
  );

  useEffect(() => {
    setCoreSdkClient(new ImmutableX(getCoreSdkConfig(environment)));
    setPassportClient(new passport.Passport(getPassportConfig(environment)));
  }, [environment]);

  const providerValues = useMemo(() => ({
    coreSdkClient,
    passportClient,
    environment,
    setEnvironment,
  }), [coreSdkClient, passportClient, environment, setEnvironment]);

  return (
    <ImmutableContext.Provider value={providerValues}>
      {children}
    </ImmutableContext.Provider>
  );
}

export function useImmutableProvider() {
  const {
    coreSdkClient, passportClient, environment, setEnvironment,
  } = useContext(ImmutableContext);
  return {
    coreSdkClient, passportClient, environment, setEnvironment,
  };
}
