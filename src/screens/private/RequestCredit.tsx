import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import Config from 'react-native-config'
import {BtnPrimary} from '../../components/BtnPrimary'
import {useAgent} from '../../context/AgentContext'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {InpSelect} from '../../components/InpSelect'
import {KEYS_MMKV} from '../../config/mmkv'
import {InpText} from '../../components/InpText'
import {v4 as uuidv4} from 'uuid'
import {TYPE_CREDENTIAL, TYPE_MESSAGE} from '../../utils/functionCV'
import {
  DID_PACK,
  RECIPIENT_DID_URL,
  SEND_MESSAGE_TYPE,
} from '../../core/environments'
import {useNavigation} from '@react-navigation/native'
import {createPV, sendMessage} from '../../core/didcomm'

const logo = require('../../assets/imgs/logo_identi.png')

interface Form {
  entidad: string
  monto: string
  plazo: string
  motivo: string
}
const initValue: Form = {
  entidad: '',
  monto: '',
  plazo: '',
  motivo: '',
}

const bancos = {
  colombia: [
    {label: 'Bancolombia', value: 'Bancolombia'},
    {label: 'Banco de Bogotá', value: 'Banco de Bogotá'},
    {label: 'BBVA Colombia', value: 'BBVA Colombia'},
  ],
  peru: [
    {
      label: 'Banco de Crédito del Perú (BCP)',
      value: 'Banco de Crédito del Perú (BCP)',
    },
    {label: 'BBVA Continental', value: 'BBVA Continental'},
    {label: 'Interbank', value: 'Interbank'},
  ],
} as {[key: string]: {label: string; value: string}[]}

const plazosOptions = [
  {label: '3 meses', value: '3 meses'},
  {label: '6 meses', value: '6 meses'},
  {label: '9 meses', value: '9 meses'},
  {label: '12 meses', value: '12 meses'},
]

const montoOptions = [
  {label: '1000 pesos', value: '1000 pesos'},
  {label: '5000 pesos', value: '5000 pesos'},
  {label: '10000 pesos', value: '10000 pesos'},
  {label: '15000 pesos', value: '15000 pesos'},
  {label: '20000 pesos', value: '20000 pesos'},
  {label: '25000 pesos', value: '25000 pesos'},
  {label: '30000 pesos', value: '30000 pesos'},
]

const motivoOptions = [
  {label: 'Capital de trabajo', value: 'Capital de trabajo'},
  {
    label: 'Compra de maquinaria/equipos',
    value: 'Compra de maquinaria/equipos',
  },
  {label: 'Insumos', value: 'Insumos'},
  {label: 'Expansión de negocio', value: 'Expansión de negocio'},
  {label: 'Inversión', value: 'Inversión'},
  {label: 'Otro', value: 'Otro'},
]

export const RequestCredit = () => {
  const [form, setForm] = useState<Form>(initValue)
  const [loading, setLoading] = useState({loading: false, error: null, msg: ''})
  const {getItem, setItem, myData} = useSecureStorage()
  const agent = useAgent()
  const dataUser = JSON.parse(getItem(KEYS_MMKV.MY_DATA_USER) as string)
  const navigation = useNavigation<any>()

  const bankOptions = () => {
    if (myData.country === 'Colombia') {
      return bancos.colombia
    } else if (dataUser.country === 'Perú') {
      return bancos.peru
    } else {
      return []
    }
  }

  const handleChange = (name: string, value: string) => {
    setForm({...form, [name]: value})
  }

  const submit = async () => {
    if (!form.entidad || !form.monto || !form.plazo || !form.motivo) {
      Alert.alert('Error de validación', 'Por favor, rellena todos los campos')
    }
    try {
      const verifiablePresentation = await createPV(agent, myData.did)
      if (!verifiablePresentation) {
        Alert.alert('Error', 'No se encontró ninguna credencial de identidad')
        return
      }

      const idSolicitud = uuidv4()
      const body = {
        type: TYPE_MESSAGE.SERVICE_REQUEST,
        holder: myData.did,
        verifiablePresentation,
        data: {
          id: idSolicitud,
          requestId: idSolicitud,
          serviceName: TYPE_CREDENTIAL.SERVICE_CREDIT.name,
          'Servicio a solicitar': TYPE_CREDENTIAL.SERVICE_CREDIT.title,
          motivo: form.motivo,
          entidad: form.entidad,
          monto: form.monto,
          plazo: form.plazo,
          createdAt: new Date().toISOString(),
        },
      }

      setLoading({
        loading: true,
        error: null,
        msg: 'Enviando solicitud',
      })

      await sendMessage(agent, myData.did, RECIPIENT_DID_URL, body)
        .then(() => {
          const listSolicitudes =
            JSON.parse(getItem(KEYS_MMKV.listSolicitudes) as string) || []
          listSolicitudes.push(body)
          setItem(KEYS_MMKV.listSolicitudes, JSON.stringify(listSolicitudes))

          navigation.navigate('HomePrivate')

          Alert.alert('Solicitud enviada', '¡Gracias por enviar su solicitud!')
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
      <Text style={styles.title}>Solicitud de crédito</Text>
      {!loading?.loading && (
        <View style={styles.containerForm}>
          <InpSelect
            name="motivo"
            label="¿Por qué solicita?"
            value={form.motivo}
            options={motivoOptions}
            onChange={handleChange}
          />
          <InpSelect
            name="entidad"
            label="¿A qué entidad realizar la solicitud?"
            value={form.entidad}
            options={bankOptions()}
            onChange={handleChange}
          />
          <InpSelect
            name="monto"
            label="¿Cuánto?"
            value={form.monto}
            options={montoOptions}
            onChange={handleChange}
          />
          <InpSelect
            name="plazo"
            label="¿Cuántos meses?"
            value={form.plazo}
            options={plazosOptions}
            onChange={handleChange}
          />
          <BtnPrimary title="Enviar solicitud" onPress={submit} />
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
})
