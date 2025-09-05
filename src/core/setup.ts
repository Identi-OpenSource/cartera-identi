import {
  createAgent,
  IDataStore,
  IDataStoreORM,
  IDIDManager,
  IKeyManager,
  IResolver,
  ICredentialIssuer,
  ICredentialVerifier,
  IMessageHandler,
  TAgent,
} from '@veramo/core'

import {DIDManager} from '@veramo/did-manager'
import {DIDResolverPlugin} from '@veramo/did-resolver'
import {IDIDComm, DIDComm, DIDCommMessageHandler} from '@veramo/did-comm'
import {SecretBox} from '@veramo/kms-local'
import {MessageHandler} from '@veramo/message-handler'
import {getResolver as ethrDidResolver} from 'ethr-did-resolver'
import {
  Entities,
  KeyStore,
  DIDStore,
  migrations,
  PrivateKeyStore,
  DataStoreORM,
  DataStore,
} from '@veramo/data-store'
import {
  EthrLacDIDProvider,
  LacDIDProvider,
  getResolver as lacDidResolver,
  KeyManagementSystem,
} from '@identi-opensource/lacchain'

import {DataSource} from 'typeorm'
import {KeyManager} from '@veramo/key-manager'
import {
  ETHR_PROVIDER_LAC_NODE_ADDRESS,
  KMS_LOCAL_KEY,
  PROVIDER_ETHR_LAC,
  PROVIDER_ETHR_LAC_NAME,
  PROVIDER_ETHR_LAC_REGISTRY,
  PROVIDER_ETHR_LAC_RPC_URL,
  PROVIDER_LAC_OPENPROTEST,
  PROVIDER_LAC_OPENPROTEST_NAME,
  PROVIDER_LAC_OPENPROTEST_NODE_ADDRESS,
  PROVIDER_LAC_OPENPROTEST_REGISTRY,
  PROVIDER_LAC_OPENPROTEST_RPC_URL,
} from './environments'

let dbConnection = new DataSource({
  type: 'expo',
  driver: require('expo-sqlite'),
  database: 'veramo.sqlite',
  migrations: migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize()

export type ISetupAgent = IDIDManager &
  IKeyManager &
  IDataStore &
  IDataStoreORM &
  IResolver &
  ICredentialIssuer &
  ICredentialVerifier &
  IDIDComm &
  IMessageHandler

export const agentIns = (DB_ENCRYPTION_KEY: string) => {
  return createAgent<TAgent<ISetupAgent>>({
    plugins: [
      new DataStore(dbConnection),
      new DataStoreORM(dbConnection),
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY)),
          ),
        },
      }),
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: PROVIDER_ETHR_LAC,
        providers: {
          [PROVIDER_ETHR_LAC]: new EthrLacDIDProvider({
            defaultKms: KMS_LOCAL_KEY,
            networks: [
              {
                nodeAddress: ETHR_PROVIDER_LAC_NODE_ADDRESS,
                expirationTime: 1946394529,
                name: PROVIDER_ETHR_LAC_NAME,
                registry: PROVIDER_ETHR_LAC_REGISTRY,
                rpcUrl: PROVIDER_ETHR_LAC_RPC_URL,
              },
            ],
          }),
          [PROVIDER_LAC_OPENPROTEST]: new LacDIDProvider({
            defaultKms: KMS_LOCAL_KEY,
            networks: [
              {
                name: PROVIDER_LAC_OPENPROTEST_NAME,
                rpcUrl: PROVIDER_LAC_OPENPROTEST_RPC_URL,
                registry: PROVIDER_LAC_OPENPROTEST_REGISTRY,
                nodeAddress: PROVIDER_LAC_OPENPROTEST_NODE_ADDRESS,
                expirationTime: 1946394529,
              },
            ],
          }),
        },
      }),
      //@ts-ignore
      new DIDResolverPlugin({
        ...ethrDidResolver({
          networks: [
            {
              name: PROVIDER_ETHR_LAC_NAME,
              registry: PROVIDER_ETHR_LAC_REGISTRY,
              rpcUrl: PROVIDER_ETHR_LAC_RPC_URL,
            },
          ],
        }),
        ...lacDidResolver({
          registry: PROVIDER_LAC_OPENPROTEST_REGISTRY,
          networks: [
            {
              name: PROVIDER_LAC_OPENPROTEST_NAME,
              registry: PROVIDER_LAC_OPENPROTEST_REGISTRY,
              nodeAddress: PROVIDER_LAC_OPENPROTEST_NODE_ADDRESS,
              rpcUrl: PROVIDER_LAC_OPENPROTEST_RPC_URL,
            },
          ],
        }),
      }),
      new DIDComm(),
      new MessageHandler({
        messageHandlers: [new DIDCommMessageHandler()],
      }),
    ],
  })
}
