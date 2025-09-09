import {TAgent} from '@veramo/core'
import {ISetupAgent} from './setup'
import {
  CoordinateMediation,
  createV3DeliveryRequestMessage,
  createV3MediateRequestMessage,
  createV3RecipientQueryMessage,
  createV3RecipientUpdateMessage,
  IDIDCommMessage,
  UpdateAction,
} from '@veramo/did-comm'
import {v4 as uuidv4} from 'uuid'
import {
  DID_PACK,
  KEY_TO_DID_DOC,
  KMS_LOCAL_KEY,
  MESSAGES_RECEIVED_MESSAGE_TYPE,
  SEND_MESSAGE_TYPE,
} from './environments'
import {TYPE_CREDENTIAL, TYPE_MESSAGE} from '../utils/functionCV'
import {getSecureStorage, KEYS_MMKV} from '../config/mmkv'

const SERVICES_STATUS = {
  pending: 'PENDING',
  analyzed: 'ANALYZED',
  complete: 'ACCEPTED',
  rejected: 'REJECTED',
  canceled: 'CANCELED',
}

const addDIDCommService = async (
  agent: TAgent<ISetupAgent>,
  did: string,
  serviceEndpoint: string,
): Promise<boolean> => {
  const time = Date.now()
  try {
    await agent?.didManagerAddService({
      did,
      service: {
        id: `didcomm_service_${time}`,
        type: 'DIDCommMessaging',
        serviceEndpoint,
      },
      options: {
        // signOnly: true,
        // ttl: 60 * 60 * 24 * 365 * 100,
      },
    })
  } catch (error) {
    console.log('Error:', error)
    throw error
  }
  return true
}

const addDIDCommKey = async (
  agent: TAgent<ISetupAgent>,
  did: string,
): Promise<boolean> => {
  const result_key = await agent.keyManagerCreate({
    type: KEY_TO_DID_DOC,
    kms: KMS_LOCAL_KEY,
  })

  await agent.didManagerAddKey({
    did,
    key: result_key,
    options: {
      // signOnly: true,
      ttl: 60 * 60 * 24 * 365 * 100,
    },
  })

  return true
}

const connectToDIDComm = async (
  agent: TAgent<ISetupAgent>,
  recipientDID: string,
  mediatorDID: string,
) => {
  try {
    const mediateRequestMessage = createV3MediateRequestMessage(
      recipientDID,
      mediatorDID,
    )
    const packedMessage = await agent?.packDIDCommMessage({
      packing: DID_PACK,
      message: mediateRequestMessage,
    })
    await agent?.sendDIDCommMessage({
      messageId: mediateRequestMessage.id,
      packedMessage,
      recipientDidUrl: mediatorDID,
    })
    const update = createV3RecipientUpdateMessage(recipientDID, mediatorDID, [
      {
        recipient_did: recipientDID,
        action: UpdateAction.ADD,
      },
    ])
    const packedUpdate = await agent?.packDIDCommMessage({
      packing: DID_PACK,
      message: update,
    })
    await agent?.sendDIDCommMessage({
      packedMessage: packedUpdate,
      recipientDidUrl: mediatorDID,
      messageId: update.id,
    })
    const query = createV3RecipientQueryMessage(recipientDID, mediatorDID)
    const packedQuery = await agent?.packDIDCommMessage({
      packing: DID_PACK,
      message: query,
    })
    await agent?.sendDIDCommMessage({
      packedMessage: packedQuery,
      recipientDidUrl: mediatorDID,
      messageId: query.id,
    })
  } catch (err) {
    console.log('connectToDIDComm => ', err)
    throw err
  }
}

const ensureMediationGranted = async (
  agent: TAgent<ISetupAgent>,
  recipientDID: string,
  mediatorDID: string,
) => {
  const request = createV3MediateRequestMessage(recipientDID, mediatorDID)

  const packedRequest = await agent?.packDIDCommMessage({
    packing: DID_PACK,
    message: request,
  })
  const mediationResponse = await agent?.sendDIDCommMessage({
    packedMessage: packedRequest,
    recipientDidUrl: mediatorDID,
    messageId: request.id,
  })

  if (
    mediationResponse.returnMessage?.type !== CoordinateMediation.MEDIATE_GRANT
  ) {
    throw new Error('mediation not granted')
  }
  const update = createV3RecipientUpdateMessage(recipientDID, mediatorDID, [
    {
      recipient_did: recipientDID,
      action: UpdateAction.ADD,
    },
  ])
  const packedUpdate = await agent?.packDIDCommMessage({
    packing: DID_PACK,
    message: update,
  })
  const updateResponse = await agent?.sendDIDCommMessage({
    packedMessage: packedUpdate,
    recipientDidUrl: mediatorDID,
    messageId: update.id,
  })

  if (
    updateResponse.returnMessage?.type !==
      CoordinateMediation.RECIPIENT_UPDATE_RESPONSE ||
    (updateResponse.returnMessage?.data as any)?.updates[0].result !== 'success'
  ) {
    throw new Error('mediation update failed')
  }
}

const markMessageAsRead = async (
  agent: TAgent<ISetupAgent>,
  recipientDID: string,
  mediatorDID: string,
  messageId: string,
) => {
  const messagesRequestMessage: IDIDCommMessage = {
    id: uuidv4(),
    type: MESSAGES_RECEIVED_MESSAGE_TYPE,
    to: [mediatorDID],
    from: recipientDID,
    return_route: 'all',
    body: {
      message_id_list: [messageId],
    },
  }

  const packedMessage = await agent.packDIDCommMessage({
    packing: DID_PACK,
    message: messagesRequestMessage,
  })

  await agent.sendDIDCommMessage({
    messageId: messagesRequestMessage.id,
    packedMessage,
    recipientDidUrl: mediatorDID,
  })
}

const receivedMessages = async (
  agent: TAgent<ISetupAgent>,
  recipientDID: string,
  mediatorDID: string,
) => {
  const deliveryRequest = createV3DeliveryRequestMessage(
    recipientDID,
    mediatorDID,
  )

  deliveryRequest.body = {limit: 100}

  const packedRequest = await agent?.packDIDCommMessage({
    packing: DID_PACK,
    message: deliveryRequest,
  })

  const deliveryResponse = await agent?.sendDIDCommMessage({
    packedMessage: packedRequest,
    recipientDidUrl: mediatorDID,
    messageId: deliveryRequest.id,
  })
  for (const attachment of deliveryResponse?.returnMessage?.attachments ?? []) {
    const msg = (await agent?.handleMessage({
      raw: JSON.stringify(attachment.data.json),
    })) as any

    await markMessageAsRead(
      agent,
      recipientDID,
      mediatorDID,
      attachment.id ?? '',
    )

    if (msg?.data?.type === TYPE_MESSAGE.VERIFIABLE_CREDENTIAL) {
      await agent?.dataStoreSaveVerifiableCredential({
        verifiableCredential: msg?.data?.credential,
      })
    }

    if (msg?.data?.type === TYPE_MESSAGE.SHARED_PRESENTATION_VERIFIABLE) {
      await agent?.dataStoreSaveVerifiablePresentation({
        verifiablePresentation: msg?.data?.verifiablePresentation,
      })
    }
  }
}

const sendMessage = async (
  agent: TAgent<ISetupAgent>,
  senderDID: string,
  receiverDID: string,
  body: any,
) => {
  const messageId = uuidv4()
  const message: any = {
    type: SEND_MESSAGE_TYPE,
    from: senderDID,
    to: [receiverDID],
    id: messageId,
    body: body,
  }

  const packedMessage = await agent?.packDIDCommMessage({
    packing: DID_PACK,
    message,
  })

  await agent?.sendDIDCommMessage({
    messageId: messageId,
    packedMessage,
    recipientDidUrl: receiverDID,
  })
}

const createPV = async (
  agent: TAgent<ISetupAgent>,
  didEmitter: string,
  did: string,
  hash: string[],
) => {
  const id = uuidv4()
  const credentials: any = await agent.dataStoreORMGetVerifiableCredentials({
    where: [
      {
        column: 'hash',
        value: [...hash],
        not: false,
        op: 'In',
      },
    ],
  })

  if (credentials.length === 0) {
    return null
  }
  const credential = credentials.map(
    (credencial: any) => credencial.verifiableCredential,
  )
  const newPV = await agent?.createVerifiablePresentation({
    presentation: {
      holder: didEmitter,
      verifiableCredential: [...credential],
      verifier: [did],
      type: ['VerifiablePresentation', 'Presentación verificable'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: new Date().toISOString(),
      expirationDate: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 365,
      ).toISOString(),
      id,
    },
    proofFormat: 'jwt',
  })
  return newPV
}

export {
  addDIDCommService,
  addDIDCommKey,
  connectToDIDComm,
  ensureMediationGranted,
  receivedMessages,
  sendMessage,
  createPV,
}
