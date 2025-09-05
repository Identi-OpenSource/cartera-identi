import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {formatDid} from '../../utils/format'
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6'
import Clipboard from '@react-native-clipboard/clipboard'
import {TYPE_CREDENTIAL, TYPE_MESSAGE} from '../../utils/functionCV'
import {useAgent} from '../../context/AgentContext'
import {BtnPrimary} from '../../components/BtnPrimary'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {KEYS_MMKV} from '../../config/mmkv'
import {LACCHAIN_MEDIATOR, RECIPIENT_DID_ETHER} from '../../core/environments'
import {receivedMessages, sendMessage} from '../../core/didcomm'
import {v4 as uuidv4} from 'uuid'
import useNetInfo from '../../hooks/useNetInfo'
const opciones = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

const logo = require('../../assets/imgs/logo_identi.png')
export const HomePrivate = () => {
  const [loading, setLoading] = useState({loading: false, error: null, msg: ''})
  const [listSolicitudes, setListSolicitudes] = useState<any[]>([])
  const [listSolicitudesPending, setListSolicitudesPending] = useState<any[]>(
    [],
  )
  const {myData, getItem, setItem} = useSecureStorage()
  const agent = useAgent()
  const isFocused = useIsFocused()
  const connectionStatus = useNetInfo()
  const navigation = useNavigation<any>()

  const emitAllCV = async () => {
    const myCVI = getItem(KEYS_MMKV.sendCvIdentity) as string
    if (myCVI === 'true') {
      return
    }
    const idSolicitud = uuidv4()
    const body = {
      type: TYPE_MESSAGE.REQUEST_VERIFIABLE_CREDENTIAL,
      holder: myData.did,
      data: {
        id: idSolicitud,
        requestId: idSolicitud,
        serviceName: TYPE_CREDENTIAL.IDENTITY.name,
        'Servicio a solicitar': TYPE_CREDENTIAL.IDENTITY.title,
        Nombres: myData.name,
        Apellidos: myData.lastName,
        DNI: myData.dni,
        Celular: myData.phone,
        País: myData.country,
      },
    }
    try {
      setLoading({
        loading: true,
        error: null,
        msg: 'Sincronizando, por favor espere...',
      })
      await sendMessage(agent, myData.did, RECIPIENT_DID_ETHER, body)
      setItem(KEYS_MMKV.sendCvIdentity, 'true')
      setLoading({
        loading: false,
        error: null,
        msg: '',
      })
    } catch (error) {
      console.log('Error emitAllCV:', error)
    }
  }

  const getMessages = async () => {
    try {
      if (!connectionStatus) {
        Alert.alert(
          'Error de conexión',
          'Por favor, comprueba que tu conexión a internet sea estable',
        )
        return
      }
      if (listSolicitudesPending?.length > 0) {
        for (let index = 0; index < listSolicitudesPending.length; index++) {
          setLoading({
            loading: true,
            error: null,
            msg: `Enviando solicitud ${index + 1}, por favor espere...`,
          })
          const body = listSolicitudesPending[index]
          await sendMessage(agent, myData.did, RECIPIENT_DID_ETHER, body)
            .then(() => {
              const listSol =
                JSON.parse(getItem(KEYS_MMKV.listSolicitudes) as string) || []
              listSol.push(body)
              setItem(KEYS_MMKV.listSolicitudes, JSON.stringify(listSol))
              // eliminamos la solicitud de la lista pendiente
              const listPending =
                JSON.parse(
                  getItem(KEYS_MMKV.listSolicitudesPending) as string,
                ) || []
              listPending.splice(index, 1)
              setItem(
                KEYS_MMKV.listSolicitudesPending,
                JSON.stringify(listPending),
              )
            })
            .catch(err => {
              console.log('Error al enviar solicitud:', err)
            })
        }
      }
      init()

      setLoading({
        loading: true,
        error: null,
        msg: 'Sincronizando, por favor espere...',
      })
      await receivedMessages(agent, myData?.did, LACCHAIN_MEDIATOR)
    } catch (error) {
      console.log('Error en getMessages:', error)
    } finally {
      init()
      setLoading({
        loading: false,
        error: null,
        msg: '',
      })
    }
  }

  const init = async () => {
    await emitAllCV()
    const solicitudes = JSON.parse(getItem(KEYS_MMKV.listSolicitudes) as string)
    solicitudes?.sort((a: any, b: any) => {
      return (
        new Date(b?.data?.createdAt).getTime() -
        new Date(a?.data?.createdAt).getTime()
      )
    })
    setListSolicitudes(solicitudes || [])
    const solicitudesPending =
      JSON.parse(getItem(KEYS_MMKV.listSolicitudesPending) as string) || []
    solicitudesPending?.sort((a: any, b: any) => {
      return (
        new Date(b?.data?.createdAt).getTime() -
        new Date(a?.data?.createdAt).getTime()
      )
    })
    setListSolicitudesPending(solicitudesPending || [])
  }

  const status: any = (s: any) => {
    if (s === 1) {
      return ['Aceptado', 'circle-check', colors.success]
    } else if (s === 2) {
      return ['Rechazado', 'rectangle-xmark', colors.deleted]
    }
    return ['Pendiente', 'hourglass-start', colors.secondary]
  }

  useEffect(() => {
    init()
  }, [isFocused])

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        {loading?.loading && (
          <View style={styles.loading}>
            <ActivityIndicator size={14} color={colors.complementary} />
            <Text style={styles.loadingText}>{loading.msg}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{myData?.name}</Text>
      <TouchableHighlight
        onPress={() => Clipboard.setString(myData?.did)}
        activeOpacity={0.5}
        underlayColor={'transparent'}>
        <View style={styles.dataDid}>
          <Text style={styles.subtitle}>{formatDid(myData?.did)}</Text>
          <FontAwesome6
            name="copy"
            size={18}
            iconStyle="solid"
            color={colors.primary}
          />
        </View>
      </TouchableHighlight>
      <View style={styles.dataUser}>
        <Text
          style={
            styles.subtitle
          }>{`${myData?.country} | DNI: ${myData?.dni} | Tel: ${myData?.phone}`}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyBtn}>
          <BtnPrimary
            disabled={loading?.loading}
            title="Actualizar"
            onPress={() => getMessages()}
          />
        </View>
        <View style={styles.bodyBtn}>
          <BtnPrimary
            disabled={loading?.loading}
            title="Solicitar crédito"
            onPress={() => navigation.navigate('RequestCredit' as never)}
          />
        </View>
      </View>
      <ScrollView>
        {listSolicitudesPending?.length > 0 && (
          <View style={styles.bodyListPending}>
            <Text style={styles.titleSection}>
              {
                'Hay solicitudes pendientes de enviar, por favor, compruebe su conexión a internet y presione el botón actualizar.'
              }
            </Text>
          </View>
        )}

        {listSolicitudes?.length > 0 && (
          <View style={styles.bodyList}>
            {listSolicitudes?.map((solicitud: any, index: number) => {
              const data = solicitud?.data
              return (
                <TouchableHighlight
                  key={index}
                  disabled={loading?.loading}
                  onPress={() =>
                    navigation.navigate('DetailsSol', {id: data?.id})
                  }
                  activeOpacity={0.8}
                  underlayColor={'transparent'}>
                  <View style={styles.data}>
                    <Text style={styles.dataLabel}>{data?.motivo}</Text>
                    <Text style={styles.dataValue}>
                      {new Date(data?.createdAt).toLocaleString(
                        'es-ES',
                        opciones,
                      )}
                    </Text>
                    <Text style={styles.dataValue}>{data?.entidad}</Text>
                    <Text style={styles.dataValue}>
                      {status(data?.status)[0]}
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  bodyListPending: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
    color: colors.text,
  },
  bodyBtn: {
    width: '48%',
  },
  loadingText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.complementary,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  dataUser: {
    flexDirection: 'column',
  },
  dataDid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  header: {
    backgroundColor: colors.primary,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: colors.text,
    textTransform: 'uppercase',
  },
  subtitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    color: colors.text,
  },
  msg: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  containerLoading: {paddingHorizontal: 16, paddingTop: 20, marginTop: 40},
  containerForm: {paddingHorizontal: 16, paddingTop: 20},
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop: 40,
    color: colors.disabled,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 24,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: colors.background,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  dataLabel: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    lineHeight: 28,
  },
})
