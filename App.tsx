import 'react-native-get-random-values'
import '@sinonjs/text-encoding'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'
// import {crypto} from 'react-native-crypto'
// global.crypto = crypto

import {NavigationContainer} from '@react-navigation/native'
import React from 'react'
import {Router} from './src/routers/Router'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {SecureStorageProvider} from './src/context/SecureStorageContext'
import {AgentProvider} from './src/context/AgentContext'

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SecureStorageProvider>
          <AgentProvider>
            <Router />
          </AgentProvider>
        </SecureStorageProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
