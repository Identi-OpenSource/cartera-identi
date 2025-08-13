import React from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import {colors} from '../styles/styles'

interface PropsBtnPrimary {
  title: string
  disabled?: boolean
  onPress: () => void
}
export const BtnPrimary = (props: PropsBtnPrimary) => {
  return (
    <TouchableHighlight
      style={styles.container}
      onPress={props.onPress}
      activeOpacity={0.8}
      disabled={props.disabled}
      underlayColor={colors.primaryOpacity}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: 60,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
})
