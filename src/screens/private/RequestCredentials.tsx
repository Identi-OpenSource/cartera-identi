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
import {BtnPrimary} from '../../components/BtnPrimary'
import {useAgent} from '../../context/AgentContext'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {InpSelect} from '../../components/InpSelect'
import {KEYS_MMKV} from '../../config/mmkv'
import {v4 as uuidv4} from 'uuid'
import {TYPE_CREDENTIAL, TYPE_MESSAGE} from '../../utils/functionCV'
import {RECIPIENT_DID_ETHER} from '../../core/environments'
import {useNavigation} from '@react-navigation/native'
import {createPV, sendMessage} from '../../core/didcomm'
import useNetInfo from '../../hooks/useNetInfo'
import {InpText} from '../../components/InpText'

const opciones = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

const logo = require('../../assets/imgs/logo_identi.png')

export const RequestCredentials = () => {
  const [loading, setLoading] = useState({loading: false, error: null, msg: ''})
  const {myData} = useSecureStorage()
  const [credenciales, setCredenciales] = useState<any[]>([])
  const [destino, setDestino] = useState<string>('')
  const [selections, setSelections] = useState<any[]>([])
  const agent = useAgent()
  const navigation = useNavigation<any>()
  const connectionStatus = useNetInfo()

  useEffect(() => {
    getCredential()
  }, [])

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

    setCredenciales(vcs)
  }

  const handleChange = (name: string, value: string) => {
    setDestino(value)
  }

  const onSelect = (item: any) => {
    const hash = item?.hash
    if (selections.includes(hash)) {
      setSelections(selections.filter(it => it !== hash))
    } else {
      setSelections([...selections, hash])
    }
  }

  const submit = async () => {
    if (!destino || !destino.startsWith('did:')) {
      Alert.alert('Error de validación', 'No existe una DID destino valida')
      return
    }
    if (selections.length === 0) {
      Alert.alert('Error de validación', 'No hay credenciales seleccionadas')
      return
    }
    try {
      const emisor = myData.did
      const verifiablePresentation = await createPV(
        agent,
        emisor,
        destino,
        selections,
      )

      const body = {
        type: TYPE_MESSAGE.SHARED_PRESENTATION_VERIFIABLE,
        holder: destino,
        verifiablePresentation,
        data: {},
      }

      if (!connectionStatus) {
        Alert.alert(
          'Error de conexión',
          'Necesitas conectarte a internet para compartir tus credenciales',
        )
        return
      }

      setLoading({
        loading: true,
        error: null,
        msg: 'Enviando solicitud',
      })
      await sendMessage(agent, myData.did, destino, body)
        .then(() => {
          navigation.navigate('HomePrivate')
          Alert.alert(
            'Credenciales enviadas',
            'Se han enviado las credenciales a la DID destino',
          )
        })
        .catch(err => {
          console.log('Error al enviar solicitud:', err)
          setLoading({
            loading: false,
            error: null,
            msg: '',
          })
          Alert.alert('Error al enviar solicitud', 'Intenta de nuevo')
        })
    } catch (error) {
      console.log('Error en sendSolicitud:', error)
      setLoading({
        loading: true,
        error: null,
        msg: 'Error al enviar solicitud\nintenta de nuevo',
      })
      setTimeout(() => {
        setLoading({
          loading: false,
          error: null,
          msg: '',
        })
      }, 5000)
    }
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Compartir mis credenciales</Text>
      {!loading?.loading && (
        <View style={styles.containerForm}>
          <ScrollView style={[globalStyles.container, styles.dataContainer]}>
            <InpText
              name="destino"
              label="DID destino"
              value={destino}
              onChange={handleChange}
            />

            {credenciales?.map((credencial: any, index: number) => {
              const issuanceDate = new Date(
                credencial.verifiableCredential.issuanceDate,
              ).toLocaleString('es-ES', opciones)
              const type = credencial.verifiableCredential.type[1]
              return (
                <TouchableHighlight
                  key={index}
                  onPress={() => onSelect(credencial)}
                  activeOpacity={0.5}
                  underlayColor={'transparent'}>
                  <View
                    style={[
                      styles.data,
                      selections.includes(credencial.hash) &&
                        styles.dataSelected,
                    ]}>
                    <Text
                      style={[
                        styles.dataLabel,
                        selections.includes(credencial.hash) &&
                          styles.valueSelected,
                      ]}>
                      {type}
                    </Text>
                    <Text
                      style={[
                        styles.dataValue,
                        selections.includes(credencial.hash) &&
                          styles.valueSelected,
                      ]}>
                      {issuanceDate}
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </ScrollView>
          <BtnPrimary title="Compartir credenciales" onPress={submit} />
        </View>
      )}
      <View style={styles.space} />
      {loading?.loading && (
        <View style={[styles.containerLoading]}>
          <ActivityIndicator size={64} color={colors.primary} />
          <Text style={styles.msg}>{loading.msg}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  space: {
    height: 20,
  },
  logo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: {
    backgroundColor: colors.primary,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: colors.text,
    textTransform: 'uppercase',
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
  dataContainer: {},
  dataLabel: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    marginBottom: 20,
    borderRadius: 10,
    paddingVertical: 15,
  },
  dataSelected: {
    backgroundColor: colors.primary,
  },
  dataValue: {
    fontSize: 16,
    color: colors.primary,
    paddingTop: 10,
  },
  valueSelected: {
    color: colors.background,
  },
  label: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
  },
})
