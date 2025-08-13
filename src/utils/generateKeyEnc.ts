import {Platform} from 'react-native'
import * as Keychain from 'react-native-keychain'
const CryptoJS = require('crypto-js')

export async function getEncryptionKey(KEY_ID: string): Promise<string> {
  try {
    if (Platform.OS === 'ios') {
      const result = await Keychain.getGenericPassword({
        service: KEY_ID,
      })
      if (result) {
        return result.password
      }
    } else {
      const result = await Keychain.getInternetCredentials(KEY_ID)
      if (result) {
        return result.password
      }
    }

    // Si no existe una clave, generamos una nueva
    const newKey = generateEncryptionKey()
    if (Platform.OS === 'ios') {
      await Keychain.setGenericPassword(KEY_ID, newKey, {
        service: KEY_ID,
      })
    } else {
      await Keychain.setInternetCredentials(KEY_ID, KEY_ID, newKey)
    }
    return newKey
  } catch (error) {
    console.error('Error al obtener/generar la clave de encriptación:', error)
    throw error
  }
}

function generateEncryptionKey() {
  // Genera 32 bytes (256 bits) de datos aleatorios.
  const randomBytes = CryptoJS.lib.WordArray.random(32)

  // Convierte los bytes aleatorios a una cadena hexadecimal.
  const key = CryptoJS.enc.Hex.stringify(randomBytes)

  return key
}
