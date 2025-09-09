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
import {
  capitalizeFirstLetter,
  formatCustomHash,
  formatDid,
} from '../../utils/format'
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
const opcionesLower = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

export const MyPVDetails = () => {
  const route = useRoute<any>()
  const credencialDetails = route.params?.credencial
  const [credencial, setCredencial] = useState<any>({})

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    const data = {} as any
    Object.keys(credencialDetails?.verifiablePresentation ?? {}).forEach(
      (key: string) => {
        data[key] = credencialDetails?.verifiablePresentation?.[key]
      },
    )
    const dataBody = []
    for (let index = 0; index < data?.verifiableCredential.length; index++) {
      const element = data?.verifiableCredential[index]
      delete element?.credentialSubject?.id
      dataBody.push({
        Credencial: element?.type[1],
        ...element?.credentialSubject,
        Emitida: new Date(element?.issuanceDate).toLocaleString(
          'es-ES',
          opcionesLower,
        ),
        Expiración: new Date(element?.expirationDate).toLocaleString(
          'es-ES',
          opcionesLower,
        ),
      })
    }
    setCredencial({
      From: formatDid(data?.holder),
      Emisión: new Date(data?.issuanceDate).toLocaleString('es-ES', opciones),
      Expiración: new Date(data?.expirationDate).toLocaleString(
        'es-ES',
        opciones,
      ),
      'Credenciales compartidas': dataBody,
    })
  }

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>
        {credencialDetails?.verifiablePresentation?.type[1] ||
          credencialDetails?.verifiablePresentation?.type[0] ||
          ''}
      </Text>
      <Text style={styles.dataDid}>
        <View style={styles.dataDid}>
          <Text style={styles.subtitle}>
            {formatCustomHash(credencialDetails?.hash, 4, 8)}
          </Text>
        </View>
      </Text>
      <View style={styles.smallSeparator} />
      <ScrollView style={[globalStyles.container, styles.dataContainer]}>
        <View style={styles.separator} />
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
