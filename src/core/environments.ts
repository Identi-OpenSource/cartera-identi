import {TKeyType} from '@veramo/core'
import {DIDCommMessagePacking} from '@veramo/did-comm'
import Config from 'react-native-config'

export const LACCHAIN_MEDIATOR = Config?.LACCHAIN_MEDIATOR || ''
export const RECIPIENT_DID_ETHER = Config?.RECIPIENT_DID_ETHER || ''
export const KEY_TO_DID_DOC = (Config?.KEY_TO_DID_DOC || 'X25519') as TKeyType
export const DID_PACK = (Config?.DID_PACK ||
  'authcrypt') as DIDCommMessagePacking
export const ENCRYPTION_SQLITE_KEY = Config?.ENCRYPTION_SQLITE_KEY || ''
export const MESSAGES_RECEIVED_MESSAGE_TYPE =
  Config?.MESSAGES_RECEIVED_MESSAGE_TYPE || ''
export const SEND_MESSAGE_TYPE = Config?.SEND_MESSAGE_TYPE || ''
export const KMS_LOCAL_KEY = Config?.KMS_LOCAL_KEY || ''
export const PROVIDER_ETHR_LAC = Config?.PROVIDER_ETHR_LAC || ''
export const PROVIDER_LAC_OPENPROTEST = Config?.PROVIDER_LAC_OPENPROTEST || ''
export const ETHR_PROVIDER_LAC_NODE_ADDRESS =
  Config?.PROVIDER_ETHR_LAC_NODE_ADDRESS || ''
export const PROVIDER_ETHR_LAC_NAME = Config?.PROVIDER_ETHR_LAC_NAME || ''
export const PROVIDER_ETHR_LAC_REGISTRY =
  Config?.PROVIDER_ETHR_LAC_REGISTRY || ''
export const PROVIDER_ETHR_LAC_RPC_URL = Config?.PROVIDER_ETHR_LAC_RPC_URL || ''
export const PROVIDER_LAC_OPENPROTEST_NAME =
  Config?.PROVIDER_LAC_OPENPROTEST_NAME || ''
export const PROVIDER_LAC_OPENPROTEST_RPC_URL =
  Config?.PROVIDER_LAC_OPENPROTEST_RPC_URL || ''
export const PROVIDER_LAC_OPENPROTEST_NODE_ADDRESS =
  Config?.PROVIDER_LAC_OPENPROTEST_NODE_ADDRESS || ''
export const PROVIDER_LAC_OPENPROTEST_REGISTRY =
  Config?.PROVIDER_LAC_OPENPROTEST_REGISTRY || ''
