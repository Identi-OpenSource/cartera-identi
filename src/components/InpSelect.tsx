import React, {useState} from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import {colors} from '../styles/styles'

interface PropsInpSelect {
  label: string
  name: string
  value: string
  options: {label: string; value: string}[]
  onChange: (name: string, value: string) => void
}
export const InpSelect = (props: PropsInpSelect) => {
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <>
      <TouchableHighlight
        onPress={() => setModalVisible(true)}
        underlayColor={'transparent'}>
        <View style={styles.containerInp}>
          <Text style={styles.label}>{props.label}</Text>
          <TextInput
            style={styles.input}
            value={props.value}
            onChangeText={value => props.onChange(props.name, value)}
            autoCapitalize="none"
            editable={false}
          />
        </View>
      </TouchableHighlight>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalFull}>
          <View style={styles.modalContainer}>
            {props.options.map(option => (
              <TouchableHighlight
                key={option.value}
                style={styles.modalOption}
                underlayColor={'transparent'}
                activeOpacity={0.5}
                onPress={() => {
                  props.onChange(props.name, option.value)
                  setModalVisible(false)
                }}>
                <Text style={styles.label}>{option.label}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    height: 50,
  },
  modalContainer: {
    minHeight: 300,
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
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
