import React, {useMemo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import {useRoute} from '@react-navigation/native'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {KEYS_MMKV} from '../../config/mmkv'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import {capitalizeFirstLetter} from '../../utils/format'

const opciones = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as any

export const DetailsSol = () => {
  const route = useRoute<any>()
  const {getItem} = useSecureStorage()
  const id = route?.params?.id
  const solicitudes = JSON.parse(getItem(KEYS_MMKV.listSolicitudes) as string)
  const solicitud = solicitudes?.find((sol: any) => sol?.data?.id === id)
  const dataSolicitud = solicitud?.data
  const createdAt = new Date(dataSolicitud?.createdAt)
  const status: any = useMemo(() => {
    if (dataSolicitud?.status === 1) {
      return ['Aceptado', 'circle-check', colors.success]
    } else if (dataSolicitud?.status === 2) {
      return ['Rechazado', 'rectangle-xmark', colors.deleted]
    }
    return ['Pendiente', 'hourglass-start', colors.secondary]
  }, [dataSolicitud])
  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>{dataSolicitud?.motivo}</Text>
      <Text style={styles.subtitle}>
        {createdAt.toLocaleString('es-ES', opciones)}
      </Text>
      <View style={styles.separator} />
      <View style={styles.icon}>
        <FontAwesome6
          name={status[1]}
          size={64}
          iconStyle="solid"
          color={status[2]}
        />
      </View>
      {Object.keys(dataSolicitud ?? {}).map((key: string, index: number) => {
        if (
          key === 'id' ||
          key === 'createdAt' ||
          key === 'nombre' ||
          key === 'dni' ||
          key === 'phone' ||
          key === 'country' ||
          key === 'status' ||
          key === 'reason' ||
          key === 'requestId' ||
          key === 'serviceName'
        ) {
          return null
        }
        return (
          <View key={index} style={styles.data}>
            <Text style={styles.dataLabel}>
              {key !== 'order_number' ? capitalizeFirstLetter(key) : 'Orden #'}:
            </Text>
            <Text style={styles.dataValue}>
              {typeof dataSolicitud[key] === 'string'
                ? dataSolicitud[key]
                : JSON.stringify(dataSolicitud[key], null, 2)}
            </Text>
          </View>
        )
      })}
      <View style={styles.data}>
        <Text style={styles.dataLabel}>Estado:</Text>
        <Text style={styles.dataValue}>{status[0]}</Text>
      </View>
      {dataSolicitud?.reason && (
        <View style={styles.data}>
          <Text style={styles.dataLabel}>Nota:</Text>
          <Text style={styles.dataValue}>{dataSolicitud.reason}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginLeft: 10,
  },
  dataValueJson: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'row',
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
    marginTop: 5,
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
