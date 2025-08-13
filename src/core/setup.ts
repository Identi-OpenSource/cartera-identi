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
import {CredentialPlugin} from '@veramo/credential-w3c'
import {
  IDIDComm,
  DIDComm,
  DIDCommHttpTransport,
  DIDCommMessageHandler,
} from '@veramo/did-comm'
import {SecretBox} from '@veramo/kms-local'
import {CredentialProviderJWT} from '@veramo/credential-jwt'
import {MessageHandler} from '@veramo/message-handler'
import {EthrDIDLacProvider} from '@identi-digital/lacchain'

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

import {DataSource} from 'typeorm'
import {KeyManager, KeyManagementSystem} from '@identi-digital/key-manager'
import {
  DID_KMS,
  DID_LAC_CREDENTIAL_REGISTER_ADDRESS,
  DID_LACCHAIN_NODE_ADDRESS,
  DID_LACCHAIN_RPC_URL,
  DID_PROVIDER_LAC,
  DID_RESOLVER_LAC_NAME,
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

const jwt = new CredentialProviderJWT()

export type ISetupAgent = IDIDManager &
  IKeyManager &
  IDataStore &
  IDataStoreORM &
  IResolver &
  ICredentialIssuer &
  ICredentialVerifier &
  IDIDComm &
  IMessageHandler

export const agentIns = (DB_ENCRYPTION_KEY: string) =>
  createAgent<TAgent<ISetupAgent>>({
    plugins: [
      new DataStore(dbConnection),
      new DataStoreORM(dbConnection),
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY)),
            '',
          ),
        },
      }),
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: DID_PROVIDER_LAC,
        providers: {
          [DID_PROVIDER_LAC]: new EthrDIDLacProvider({
            defaultKms: DID_KMS,
            networks: [
              {
                nodeAddress: DID_LACCHAIN_NODE_ADDRESS,
                name: DID_RESOLVER_LAC_NAME,
                registry: DID_LAC_CREDENTIAL_REGISTER_ADDRESS,
                rpcUrl: DID_LACCHAIN_RPC_URL,
              },
            ],
          }),
        },
      }),
      new DIDResolverPlugin({
        ...ethrDidResolver({
          networks: [
            {
              name: DID_RESOLVER_LAC_NAME,
              registry: DID_LAC_CREDENTIAL_REGISTER_ADDRESS,
              rpcUrl: DID_LACCHAIN_RPC_URL,
            },
          ],
        }),
      }),
      new CredentialPlugin({
        issuers: [jwt],
      }),
      new DIDComm({transports: [new DIDCommHttpTransport()]}),
      new MessageHandler({
        messageHandlers: [new DIDCommMessageHandler()],
      }),
    ],
  })
