import {StyleSheet} from 'react-native'

export const colors = {
  primary: '#001624',
  primaryOpacity: '#0b212f',
  secondary: '#FF5B00',
  success: '#00C853',
  complementary: '#FDF7DF',
  background: '#fff',
  text: '#333',
  disabled: '#ccc',
  deleted: '#dd4e4eff',
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
