export const TYPE_MESSAGE = {
  VERIFIABLE_CREDENTIAL: 'ISSUED_VERIFIABLE_CREDENTIAL',
  SERVICE_REQUEST: 'SERVICE_REQUEST',
  SERVICE_RESPONSE: 'SERVICE_RESPONSE',
  REQUEST_VERIFIABLE_CREDENTIAL: 'REQUEST_VERIFIABLE_CREDENTIAL',
  SHARED_PRESENTATION_VERIFIABLE: 'SHARED_PRESENTATION_VERIFIABLE',
}

export const TYPE_CREDENTIAL = {
  IDENTITY: {
    name: 'Solicitud de credencial',
    validPeriod: '100y',
    emit: 'IDENTI',
    title: 'Credencial de Identidad',
  },
  SERVICE_CREDIT: {
    name: 'Solicitud de crédito',
    validPeriod: '1y',
    emit: 'IDENTI',
    title: 'Solicitud de crédito',
  },
  SERVICE_CREDIT_HISTORICAL: {
    name: 'Historial Crediticio',
    validPeriod: '1y',
    emit: 'IDENTI',
    title: 'Historial Crediticio',
  },
}

export interface DATA_EMIT_CV {
  credential_type: string
  valid_period: string
  credential_subject: any
  did: string
}

export const emitCV = async (data: DATA_EMIT_CV) => {}
