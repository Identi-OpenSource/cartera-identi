/* eslint-disable react/no-unstable-nested-components */
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import React, {useEffect} from 'react'
import {Home} from '../screens/public/Home'
import {colors} from '../styles/styles'
import {useSecureStorage} from '../context/SecureStorageContext'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6'
import {HomePrivate} from '../screens/private/HomePrivate'
import {Profile} from '../screens/private/Profile'
import {RequestCredit} from '../screens/private/RequestCredit'
import {MyCV} from '../screens/private/MyCV'
import {MyCVDetails} from '../screens/private/MyCVDetails'
import {DetailsSol} from '../screens/private/DetailsSol'
import {receivedMessages} from '../core/didcomm'
import {useAgent} from '../context/AgentContext'
import {MEDIATOR_DID_LAC} from '../core/environments'

export const Router = () => {
  const {myData} = useSecureStorage()
  if (myData) {
    return <PrivateStack />
  }
  return <PublicStack />
}

const PrivateStack = () => {
  const Tabs = createBottomTabNavigator()

  return (
    <Tabs.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        title: 'Home',
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.disabled,
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          height: 50,
          backgroundColor: colors.primary,
          paddingTop: 0,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Inicio',
          // unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <FontAwesome6
              name="house"
              iconStyle="solid"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="credenciales"
        component={CvStack}
        options={{
          title: 'VC',
          // unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <FontAwesome6
              name="file-shield"
              iconStyle="solid"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          title: 'Perfil',
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <FontAwesome6
              name="user"
              iconStyle="solid"
              color={color}
              size={size}
            />
          ),
        }}
      /> */}
    </Tabs.Navigator>
  )
}

const HomeStack = () => {
  const StackPrivate = createNativeStackNavigator()
  const options = {
    headerShown: false,
    statusBarStyle: 'light',
    statusBarColor: colors.primary,
  } as NativeStackNavigationOptions
  return (
    <StackPrivate.Navigator initialRouteName={'HomePrivate'}>
      <StackPrivate.Screen
        name="HomePrivate"
        component={HomePrivate}
        options={options}
      />
      <StackPrivate.Screen
        name="RequestCredit"
        component={RequestCredit}
        options={options}
      />
      <StackPrivate.Screen
        name="DetailsSol"
        component={DetailsSol}
        options={options}
      />
    </StackPrivate.Navigator>
  )
}

const ProfileStack = () => {
  const StackPrivate = createNativeStackNavigator()
  const options = {
    headerShown: false,
    statusBarStyle: 'light',
    statusBarColor: colors.primary,
  } as NativeStackNavigationOptions
  return (
    <StackPrivate.Navigator initialRouteName={'HomeScreen'}>
      <StackPrivate.Screen
        name="Profile"
        component={Profile}
        options={options}
      />
    </StackPrivate.Navigator>
  )
}

const CvStack = () => {
  const StackPrivate = createNativeStackNavigator()
  const options = {
    headerShown: false,
    statusBarStyle: 'light',
    statusBarColor: colors.primary,
  } as NativeStackNavigationOptions
  return (
    <StackPrivate.Navigator initialRouteName={'HomeScreen'}>
      <StackPrivate.Screen name="MyCV" component={MyCV} options={options} />
      <StackPrivate.Screen
        name="MyCVDetails"
        component={MyCVDetails}
        options={options}
      />
    </StackPrivate.Navigator>
  )
}

const PublicStack = () => {
  const StackPublic = createNativeStackNavigator()
  const options = {
    headerShown: false,
    statusBarStyle: 'light',
    statusBarColor: colors.primary,
  } as NativeStackNavigationOptions
  return (
    <StackPublic.Navigator initialRouteName={'HomeScreen'}>
      <StackPublic.Screen name="Home" component={Home} options={options} />
    </StackPublic.Navigator>
  )
}

// const PublicStack = () => {
//   const StackPublic = createNativeStackNavigator()
//   return (
//     <StackPublic.Navigator
//       initialRouteName={'HomeScreen'}
//       screenOptions={{
//         headerShown: false,
//         statusBarColor: 'transparent',
//         statusBarTranslucent: true,
//         statusBarStyle: 'dark',
//       }}>
//       <StackPublic.Screen name="HomeScreen" component={HomeScreen} />
//       <StackPublic.Screen
//         name="VerifiableCredentials"
//         component={VerifiableCredentialsScreen}
//         options={{title: 'Verifiable Credentials'}}
//       />
//       <StackPublic.Screen
//         name="ResolveDID"
//         component={ResolveDIDScreen}
//         options={{title: 'Resolve DID'}}
//       />
//       <StackPublic.Screen
//         name="IssueCredential"
//         component={IssueCredentialScreen}
//         options={{title: 'Issue Credential'}}
//       />
//     </StackPublic.Navigator>
//   )
// }
