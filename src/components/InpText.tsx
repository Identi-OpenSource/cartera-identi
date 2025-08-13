import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {colors} from '../styles/styles'

interface PropsInpText {
  label: string
  name: string
  value: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  onChange: (name: string, value: string) => void
}
export const InpText = (props: PropsInpText) => {
  return (
    <View style={styles.containerInp}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        keyboardType={props.keyboardType || 'default'}
        onChangeText={value => props.onChange(props.name, value)}
        autoCapitalize="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    borderWidth: 0.8,
    borderColor: colors.primary,
    padding: 10,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.text,
    backgroundColor: colors.complementary,
  },
  label: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
  },
  containerInp: {
    marginVertical: 10,
  },
})
