import React, {useEffect, useState} from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {capitalizeFirstLetter, formatCustomHash} from '../../utils/format'
import {useNavigation, useRoute} from '@react-navigation/native'
import {TYPE_CREDENTIAL} from '../../utils/functionCV'
import {KEYS_MMKV} from '../../config/mmkv'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

const opciones = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

export const MyCVDetails = () => {
  const route = useRoute<any>()
  const credencialDetails = route.params?.credencial
  const [credencial, setCredencial] = useState<any>({})
  const {getItem} = useSecureStorage()
  const navigation = useNavigation<any>()

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    const data = {} as any
    Object.keys(
      credencialDetails?.verifiableCredential?.credentialSubject ?? {},
    ).forEach((key: string) => {
      if (key === 'id' || key === 'request_id') {
        return
      }
      data[key] =
        credencialDetails?.verifiableCredential?.credentialSubject[key]
    })
    setCredencial(data)
  }

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>
        {credencialDetails?.verifiableCredential?.type[1]}
      </Text>
      <TouchableHighlight
        style={styles.dataDid}
        disabled={
          credencialDetails?.verifiableCredential?.type[1] ===
            TYPE_CREDENTIAL.SERVICE_CREDIT_HISTORICAL.title ||
          credencialDetails?.verifiableCredential?.type[1] ===
            TYPE_CREDENTIAL.IDENTITY.title
        }
        onPress={() => {
          let requestId =
            credencialDetails?.verifiableCredential?.credentialSubject
              ?.request_id
          if (requestId === undefined) {
            const listSolicitudes = JSON.parse(
              getItem(KEYS_MMKV.listSolicitudes) as string,
            )
            const solicitudNumber =
              credencialDetails?.verifiableCredential?.credentialSubject
                ?.Solicitud
            const solicitud = listSolicitudes.find(
              (sol: any) => sol?.data?.order_number === solicitudNumber,
            )
            requestId = solicitud?.data?.id
          }
          if (requestId === undefined) {
            return
          }
          navigation.navigate('Home', {
            screen: 'DetailsSol',
            params: {
              id: requestId,
            },
          })
        }}
        underlayColor={'transparent'}
        activeOpacity={0.5}>
        <View style={styles.dataDid}>
          <Text style={styles.subtitle}>
            {formatCustomHash(credencialDetails?.hash, 4, 8)}
          </Text>
          {!(
            credencialDetails?.verifiableCredential?.type[1] ===
              TYPE_CREDENTIAL.SERVICE_CREDIT_HISTORICAL.title ||
            credencialDetails?.verifiableCredential?.type[1] ===
              TYPE_CREDENTIAL.IDENTITY.title
          ) && (
            <FontAwesome6
              name="link"
              iconStyle="solid"
              size={16}
              color={colors.primary}
            />
          )}
        </View>
      </TouchableHighlight>
      <View style={styles.smallSeparator} />
      <ScrollView style={[globalStyles.container, styles.dataContainer]}>
        <View style={styles.separator} />
        <View style={styles.data}>
          <Text style={styles.dataLabel}>{'Emisión:'}</Text>
          <Text style={styles.dataValue}>
            {new Date(
              credencialDetails?.verifiableCredential?.issuanceDate,
            )?.toLocaleString('es-ES', opciones)}
          </Text>
        </View>
        <View style={styles.data}>
          <Text style={styles.dataLabel}>{'Vencimiento:'}</Text>
          <Text style={styles.dataValue}>
            {new Date(
              credencialDetails?.verifiableCredential?.expirationDate,
            )?.toLocaleString('es-ES', opciones)}
          </Text>
        </View>
        {Object.keys(credencial ?? {}).map((key: string, index: number) => {
          return (
            <View key={index} style={styles.data}>
              <Text style={styles.dataLabel}>
                {capitalizeFirstLetter(key)}:
              </Text>
              <Text style={styles.dataValue}>
                {typeof credencial[key] === 'string'
                  ? credencial[key].toUpperCase()
                  : JSON.stringify(credencial[key], null, 2)}
              </Text>
            </View>
          )
        })}
        <View style={styles.separator} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  smallSeparator: {
    marginVertical: 5,
    height: 1,
  },
  separator: {
    marginVertical: 20,
    height: 1,
  },
  dataContainer: {
    paddingHorizontal: 20,
  },
  dataLabel: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  dataDid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 32,
  },
  dataValueJson: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  logo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: {
    paddingVertical: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
})
