import React from 'react'
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import {colors, globalStyles} from '../../styles/styles'
import Clipboard from '@react-native-clipboard/clipboard'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import Config from 'react-native-config'
import {useSecureStorage} from '../../context/SecureStorageContext'
import {formatDid} from '../../utils/format'

export const Profile = () => {
  const {myData} = useSecureStorage()
  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <FontAwesome6
          name="user"
          size={150}
          iconStyle="solid"
          color={colors.primary}
        />
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
      <View style={styles.data}>
        <Text style={styles.dataLabel}>DNI</Text>
        <Text style={styles.dataValue}>{myData?.dni}</Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataLabel}>Teléfono</Text>
        <Text style={styles.dataValue}>{myData?.phone}</Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataLabel}>País</Text>
        <Text style={styles.dataValue}>{myData?.country}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dataLabel: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  dataDid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dataValue: {
    paddingLeft: 10,
    fontSize: 18,
    color: colors.text,
  },
  data: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
