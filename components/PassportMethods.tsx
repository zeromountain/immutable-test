import React from 'react';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useStatusProvider } from '@/contexts/StatusProvider';
import { usePassportProvider } from '@/contexts/PassportProvider';

function PassportMethods() {
  const { isLoading } = useStatusProvider();
  const {
    logout,
    login,
    getIdToken,
    getAccessToken,
    getUserInfo,
    getLinkedAddresses,
    connectZkEvm,
    requestAccounts,
    requestSignature
  } = usePassportProvider();

  return (
    <Card className='tw-flex tw-flex-col tw-gap-4 tw-p-4'>
      <CardTitle>
        <span>Passport Methods</span>
      </CardTitle>
      <CardContent className='tw-flex tw-flex-wrap tw-gap-4' >
        <Button
          disabled={isLoading}
          onClick={login}
        >
          Login
        </Button>
        <Button
          disabled={isLoading}
          onClick={logout}
        >
          Logout
        </Button>
        <Button disabled={isLoading} onClick={connectZkEvm}>
          Connect Zkevm
        </Button>
        <Button
          disabled={isLoading}
          onClick={getIdToken}
        >
          Get ID Token
        </Button>
        <Button
          disabled={isLoading}
          onClick={getAccessToken}
        >
          Get Access Token
        </Button>
        <Button
          disabled={isLoading}
          onClick={getUserInfo}
        >
          Get User Info
        </Button>
        <Button
          disabled={isLoading}
          onClick={getLinkedAddresses}
        >
          Get Linked Addresses
        </Button>
        <Button disabled={isLoading} onClick={requestAccounts}>
          Request Accounts
        </Button>
        <Button disabled={isLoading} onClick={requestSignature}>
          Request Signature
        </Button>
      </CardContent>
    </Card>
  );
}

export default PassportMethods;
