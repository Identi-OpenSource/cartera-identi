/* eslint-disable react/react-in-jsx-scope */
import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {getEncryptionKey} from '../utils/generateKeyEnc'
import {ENCRYPTION_SQLITE_KEY} from '../core/environments'
import {agentIns, ISetupAgent} from '../core/setup'
import {TAgent} from '@veramo/core'

interface AgentProps {
  children: ReactNode
}

const AgentContext = createContext<TAgent<ISetupAgent> | null>(null)

export const AgentProvider = ({children}: AgentProps) => {
  const [agent, setAgent] = useState<TAgent<ISetupAgent> | null>(null)
  useEffect(() => {
    const initialize = async () => {
      try {
        const encryptionKey = await getEncryptionKey(ENCRYPTION_SQLITE_KEY)
        const agentInit = agentIns(encryptionKey)
        if (agentInit) {
          setAgent(agentInit)
        }
      } catch (error) {
        throw 'Error en la iniciar el agente'
      }
    }
    initialize()
  }, [])

  if (!agent) {
    return
  }
  return <AgentContext.Provider value={agent}>{children}</AgentContext.Provider>
}

// Hook personalizado para usar el agente
export const useAgent = () => {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider')
  }
  return context
}
