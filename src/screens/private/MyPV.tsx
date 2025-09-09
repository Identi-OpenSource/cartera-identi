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
import {useIsFocused, useNavigation} from '@react-navigation/native'
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

export const MyPV = () => {
  const {myData} = useSecureStorage()
  const [credenciales, setCredenciales] = useState<any[]>([])
  const navigation = useNavigation<any>()
  const agent = useAgent()
  const isFocused = useIsFocused()

  const getCredential = async () => {
    let pvs = await agent.dataStoreORMGetVerifiablePresentations({})
    pvs = pvs?.filter((credencial: any) => {
      const toDate = new Date()
      const fromDate = new Date(
        credencial?.verifiablePresentation?.expirationDate,
      )
      return toDate.getTime() < fromDate.getTime()
    })
    setCredenciales(pvs)
  }

  useEffect(() => {
    getCredential()
  }, [isFocused])

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>{'Credenciales Compartidas'}</Text>
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
        {credenciales?.map((credencial: any, index: number) => {
          const issuanceDate = new Date(
            credencial.verifiablePresentation.issuanceDate,
          ).toLocaleString('es-ES', opciones)
          const holder = credencial.verifiablePresentation.holder
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
                <Text style={styles.dataLabel}>{formatDid(holder)}</Text>
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
    fontSize: 18,
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
