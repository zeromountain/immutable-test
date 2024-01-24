"use client"

import { PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ImmutableProvider } from '@/contexts/ImmutableProvider'
import { PassportProvider } from '@/contexts/PassportProvider'
import { StatusProvider } from '@/contexts/StatusProvider'
import { GlobalStoreProvider } from '@/contexts/global/useGlobalStoreContext'

const client = new QueryClient();

function Providers({children}: PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={client}>
      <GlobalStoreProvider>
        <StatusProvider>
          <ImmutableProvider>
            <PassportProvider>
              {children}
            </PassportProvider>
          </ImmutableProvider>
        </StatusProvider>
      </GlobalStoreProvider>
    </QueryClientProvider>
  )
}

export default Providers