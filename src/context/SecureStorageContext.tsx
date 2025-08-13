import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {MMKV} from 'react-native-mmkv'
import {getSecureStorage, KEYS_MMKV} from '../config/mmkv'

type StorageValueType = string | number | boolean | null

interface SecureStorageContextType {
  storageMMKV: MMKV | null
  errorMMKV: Error | null
  getItem: (key: string) => StorageValueType
  setItem: (key: string, value: StorageValueType) => void
  removeItem: (key: string) => void
  clearMMKV: () => void
  myData: any
  setMyData: (value: any) => void
}

const SecureStorageContext = createContext<SecureStorageContextType | null>(
  null,
)

interface SecureStorageProps {
  children: ReactNode
}

export const SecureStorageProvider = ({children}: SecureStorageProps) => {
  const [storage, setStorage] = useState<MMKV | null>(null)
  const [myData, setMyData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const secureStorage = await getSecureStorage()
        setStorage(secureStorage)
      } catch (err) {
        setError(err as Error)
      }
    }

    initializeStorage()
  }, [])

  useEffect(() => {
    if (storage) {
      const data = getItem(KEYS_MMKV.MY_DATA_USER) as string
      if (data) {
        setMyData(JSON.parse(data))
      }
    }
  }, [storage])

  const getItem = (key: string): StorageValueType => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    return (storage.getString(key) as StorageValueType) ?? null
  }

  const setItem = (key: string, value: StorageValueType): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    if (value) {
      storage.set(key, value)
    } else {
      storage.delete(key)
    }
  }

  const removeItem = (key: string): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.delete(key)
  }

  const clear = (): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.clearAll()
  }

  return (
    <SecureStorageContext.Provider
      value={{
        storageMMKV: storage,
        errorMMKV: error,
        getItem,
        setItem,
        removeItem,
        clearMMKV: clear,
        myData,
        setMyData,
      }}>
      {children}
    </SecureStorageContext.Provider>
  )
}

export const useSecureStorage = (): SecureStorageContextType => {
  const context = useContext(SecureStorageContext)
  if (!context) {
    throw new Error(
      'useSecureStorage must be used within a SecureStorageProvider',
    )
  }
  return context
}
