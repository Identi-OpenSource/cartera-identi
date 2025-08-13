import Config from 'react-native-config'

export const MEDIATOR_DID_LAC = Config?.LACCHAIN_MEDIATOR || ''
export const DID_PROVIDER_LAC = Config?.LACCHAIN_PROVIDER || ''
export const DID_LAC_CREDENTIAL_REGISTER_ADDRESS =
  Config?.LACCHAIN_DID_REGISTRY_ADDRESS || ''
export const DID_RESOLVER_LAC_NAME = Config?.LACCHAIN_RESOLVER || ''
export const DID_LACCHAIN_NODE_ADDRESS = Config?.LACCHAIN_NODE_ADDRESS || ''
export const DID_LACCHAIN_RPC_URL = Config?.LACCHAIN_RPC_URL || ''
export const ENCRYPTION_SQLITE_KEY = 'ENCRYPTION_SQLITE_KEY'
export const DID_KMS = 'local'
export const DID_PACK = 'authcrypt'
export const KEY_TO_DID_DOC = 'X25519'
export const SEND_MESSAGE_TYPE = 'https://didcomm.org/basicmessage/2.0/message'
export const MESSAGES_RECEIVED_MESSAGE_TYPE =
  'https://didcomm.org/messagepickup/3.0/messages-received'
export const RECIPIENT_DID_URL = Config?.RECIPIENT_DID_URL || ''
