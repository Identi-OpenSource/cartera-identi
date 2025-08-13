import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
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
import {MEDIATOR_DID_LAC, RECIPIENT_DID_URL} from '../../core/environments'
import {receivedMessages, sendMessage} from '../../core/didcomm'
import {v4 as uuidv4} from 'uuid'
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
  const {myData, getItem, setItem} = useSecureStorage()
  const agent = useAgent()
  const isFocused = useIsFocused()
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
      await sendMessage(agent, myData.did, RECIPIENT_DID_URL, body)
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
        <BtnPrimary
          disabled={loading?.loading}
          title="Solicitar crédito"
          onPress={() => navigation.navigate('RequestCredit' as never)}
        />
      </View>
      <ScrollView>
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
