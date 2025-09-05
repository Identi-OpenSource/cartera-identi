import React, {useState} from 'react'
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
import {InpText} from '../../components/InpText'
import {BtnPrimary} from '../../components/BtnPrimary'
import Config from 'react-native-config'
import {InpSelect} from '../../components/InpSelect'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {KEYS_MMKV} from '../../config/mmkv'
import {
  addDIDCommKey,
  addDIDCommService,
  connectToDIDComm,
  ensureMediationGranted,
} from '../../core/didcomm'
import {useAgent} from '../../context/AgentContext'
import useNetInfo from '../../hooks/useNetInfo'
import {
  LACCHAIN_MEDIATOR,
  PROVIDER_LAC_OPENPROTEST,
} from '../../core/environments'

interface Form {
  name: string
  lastName: string
  dni: string
  phone: string
  country: string
}
const initValue: Form = {
  name: 'Braudin',
  lastName: 'Laya',
  dni: '12345678',
  phone: '1234567890',
  country: 'Perú',
}

const countryList = [
  {label: 'Colombia', value: 'Colombia'},
  {label: 'Perú', value: 'Perú'},
]

const logo = require('../../assets/imgs/logo_identi.png')
export const Home = () => {
  const [form, setForm] = useState<Form>(initValue)
  const [loading, setLoading] = useState({loading: false, error: null, msg: ''})
  const {setItem, setMyData} = useSecureStorage()
  const connectionStatus = useNetInfo()
  const agent = useAgent()

  const handleChange = (name: string, value: string) => {
    setForm({...form, [name]: value})
  }

  const submit = () => {
    if (!connectionStatus) {
      Alert.alert(
        'Error de conexión',
        'Por favor, comprueba que tu conexión a internet sea estable',
      )
      return
    }
    if (
      !form.name ||
      !form.phone ||
      !form.country ||
      !form.dni ||
      !form.lastName
    ) {
      Alert.alert('Error de validación', 'Por favor, rellena todos los campos')
      return
    }

    if (!form.dni.match(/^\d{7,9}$/)) {
      Alert.alert('Error de validación', 'Debes ingresar un DNI valido')
      return
    }

    if (!form.phone.match(/^\d{7,11}$/)) {
      Alert.alert(
        'Error de validación',
        'Debes ingresar un teléfono valido (solo números)',
      )
      return
    }

    if (form.name.length < 3 || form.lastName.length < 3) {
      Alert.alert('Error de validación', 'Debes ingresar un nombre valido')
      return
    }

    createIdentifier()
  }

  const createIdentifier = async () => {
    try {
      setLoading({
        loading: true,
        error: null,
        msg: `Hola ${form.name}, Vamos a generar tu identidad digital`,
      })

      await new Promise(resolve => setTimeout(resolve, 2000))

      let _id
      try {
        _id = await agent.didManagerCreate({
          provider: PROVIDER_LAC_OPENPROTEST,
          options: {ttl: 60 * 60 * 24 * 365 * 100},
        })
      } catch (error) {
        console.log(error)
      }
      await new Promise(resolve => setTimeout(resolve, 3000))

      await addDIDCommService(agent, _id.did, LACCHAIN_MEDIATOR)
      setLoading({
        loading: true,
        error: null,
        msg: 'Registrando identidad al servicio',
      })

      await new Promise(resolve => setTimeout(resolve, 3000))
      await addDIDCommKey(agent, _id.did)
      setLoading({
        loading: true,
        error: null,
        msg: 'Iniciando proceso de comunicación ',
      })

      await new Promise(resolve => setTimeout(resolve, 3000))
      await connectToDIDComm(agent, _id.did, LACCHAIN_MEDIATOR)
      setLoading({
        loading: true,
        error: null,
        msg: 'Verificando comunicación',
      })

      await new Promise(resolve => setTimeout(resolve, 3000))
      await ensureMediationGranted(agent, _id.did, LACCHAIN_MEDIATOR)
      setLoading({
        loading: true,
        error: null,
        msg: 'Tu identidad digital se ha creado correctamente.',
      })

      await new Promise(resolve => setTimeout(resolve, 2000))
      const DATA = {...form, did: _id.did}
      setItem(KEYS_MMKV.MY_DATA_USER, JSON.stringify(DATA))
      setMyData(DATA)
    } catch (error) {
      setLoading({
        loading: true,
        error: null,
        msg: 'Error al crear tu identidad, intenta de nuevo',
      })

      await new Promise(resolve => setTimeout(resolve, 5000))
      setLoading({
        loading: false,
        error: null,
        msg: '',
      })
    }
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Crea tu identidad digital</Text>
      {!loading?.loading && (
        <View style={styles.containerForm}>
          <InpText
            name="name"
            label="Nombres"
            value={form.name}
            onChange={handleChange}
          />
          <InpText
            name="lastName"
            label="Apellidos"
            value={form.lastName}
            onChange={handleChange}
          />
          <InpText
            name="dni"
            label="DNI"
            keyboardType="numeric"
            value={form.dni}
            onChange={handleChange}
          />
          <InpText
            name="phone"
            label="Teléfono"
            keyboardType="phone-pad"
            value={form.phone}
            onChange={handleChange}
          />
          <InpSelect
            name="country"
            label="País"
            value={form.country}
            options={countryList}
            onChange={handleChange}
          />
          <BtnPrimary title="Crear identidad" onPress={submit} />
        </View>
      )}
      {loading?.loading && (
        <View style={[styles.containerLoading]}>
          <ActivityIndicator size={64} color={colors.primary} />
          <Text style={styles.msg}>{loading.msg}</Text>
        </View>
      )}
      <Text style={styles.footer}>
        Identi | LACChain | V{Config.VERSION_NAME}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
