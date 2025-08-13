import React, {useEffect, useState} from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import Clipboard from '@react-native-clipboard/clipboard'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {formatDid} from '../../utils/format'
import {useNavigation} from '@react-navigation/native'
import {useAgent} from '../../context/AgentContext'
import {TYPE_CREDENTIAL} from '../../utils/functionCV'

const opciones = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

export const MyCV = () => {
  const {myData} = useSecureStorage()
  const [credenciales, setCredenciales] = useState<any[]>([])
  const [credencialesIdentidad, setCredencialesIdentidad] = useState<any[]>([])
  const [credencialesHistorial, setCredencialesHistorial] = useState<any[]>([])
  const navigation = useNavigation<any>()
  const agent = useAgent()

  const getCredential = async () => {
    let vcs = await agent.dataStoreORMGetVerifiableCredentials({
      where: [
        {
          column: 'subject',
          value: [myData?.did],
          op: 'Equal',
        },
      ],
    })
    vcs = vcs?.filter((credencial: any) => {
      const toDate = new Date()
      const fromDate = new Date(
        credencial?.verifiableCredential?.expirationDate,
      )
      return toDate.getTime() < fromDate.getTime()
    })
    const vcsIdentidad = vcs
      ?.filter(
        (credencial: any) =>
          credencial?.verifiableCredential?.type[1] ===
          TYPE_CREDENTIAL.IDENTITY.title,
      )
      ?.sort((a: any, b: any) => {
        return (
          new Date(b?.verifiableCredential.issuanceDate).getTime() -
          new Date(a?.verifiableCredential.issuanceDate).getTime()
        )
      })

    if (vcsIdentidad.length !== 0) {
      setCredencialesIdentidad([vcsIdentidad[0]])
    }
    const vcsHistorial = vcs
      ?.filter(
        (credencial: any) =>
          credencial?.verifiableCredential?.type[1] ===
          TYPE_CREDENTIAL.SERVICE_CREDIT_HISTORICAL.title,
      )
      ?.sort((a: any, b: any) => {
        return (
          new Date(b?.verifiableCredential.issuanceDate).getTime() -
          new Date(a?.verifiableCredential.issuanceDate).getTime()
        )
      })
    if (vcsHistorial.length !== 0) {
      setCredencialesHistorial([vcsHistorial[0]])
    }
    const vcsAll = vcs
      ?.filter(
        (credencial: any) =>
          credencial?.verifiableCredential?.type[1] !==
            TYPE_CREDENTIAL.IDENTITY.title &&
          credencial?.verifiableCredential?.type[1] !==
            TYPE_CREDENTIAL.SERVICE_CREDIT_HISTORICAL.title,
      )
      ?.sort((a: any, b: any) => {
        return (
          new Date(b?.verifiableCredential.issuanceDate).getTime() -
          new Date(a?.verifiableCredential.issuanceDate).getTime()
        )
      })
    if (vcsAll.length !== 0) {
      setCredenciales(vcsAll)
    }
  }

  useEffect(() => {
    getCredential()
  }, [])

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>{'Mis credenciales'}</Text>
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
      <ScrollView style={[globalStyles.container, styles.dataContainer]}>
        {credencialesIdentidad?.map((credencial: any, index: number) => {
          const issuanceDate = new Date(
            credencial.verifiableCredential.issuanceDate,
          ).toLocaleString('es-ES', opciones)
          const type = credencial.verifiableCredential.type[1]
          return (
            <TouchableHighlight
              key={index}
              onPress={() =>
                navigation.navigate('MyCVDetails', {
                  credencial,
                })
              }
              activeOpacity={0.5}
              underlayColor={'transparent'}>
              <View style={styles.data}>
                <Text style={styles.dataLabel}>{type}</Text>
                <Text style={styles.dataValue}>{issuanceDate}</Text>
              </View>
            </TouchableHighlight>
          )
        })}
        {credencialesHistorial?.map((credencial: any, index: number) => {
          const issuanceDate = new Date(
            credencial.verifiableCredential.issuanceDate,
          ).toLocaleString('es-ES', opciones)
          const type = credencial.verifiableCredential.type[1]
          return (
            <TouchableHighlight
              key={index}
              onPress={() =>
                navigation.navigate('MyCVDetails', {
                  credencial,
                })
              }
              activeOpacity={0.5}
              underlayColor={'transparent'}>
              <View style={styles.data}>
                <Text style={styles.dataLabel}>{type}</Text>
                <Text style={styles.dataValue}>{issuanceDate}</Text>
              </View>
            </TouchableHighlight>
          )
        })}

        {credenciales?.map((credencial: any, index: number) => {
          const issuanceDate = new Date(
            credencial.verifiableCredential.issuanceDate,
          ).toLocaleString('es-ES', opciones)
          const type = credencial.verifiableCredential.type[1]
          return (
            <TouchableHighlight
              key={index}
              onPress={() =>
                navigation.navigate('MyCVDetails', {
                  credencial,
                })
              }
              activeOpacity={0.5}
              underlayColor={'transparent'}>
              <View style={styles.data}>
                <Text style={styles.dataLabel}>{type}</Text>
                <Text style={styles.dataValue}>{issuanceDate}</Text>
              </View>
            </TouchableHighlight>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  dataContainer: {
    paddingHorizontal: 20,
  },
  dataLabel: {
    fontSize: 22,
    color: colors.background,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  dataDid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dataValue: {
    fontSize: 16,
    color: colors.background,
    paddingTop: 10,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: colors.primary,
    marginBottom: 20,
    borderRadius: 10,
    paddingVertical: 15,
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
