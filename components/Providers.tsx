import { PropsWithChildren } from 'react'

import { ImmutableProvider } from '@/contexts/ImmutableProvider'
import { PassportProvider } from '@/contexts/PassportProvider'
import { StatusProvider } from '@/contexts/StatusProvider'
import { GlobalStoreProvider } from '@/contexts/global/useGlobalStoreContext'

function Providers({children}: PropsWithChildren<{}>) {
  return (
    <GlobalStoreProvider>
      <StatusProvider>
        <ImmutableProvider>
          <PassportProvider>
            {children}
          </PassportProvider>
        </ImmutableProvider>
      </StatusProvider>
    </GlobalStoreProvider>
  )
}

export default Providers