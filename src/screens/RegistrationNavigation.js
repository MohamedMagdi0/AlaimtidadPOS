import * as React from 'react';

import {View, TouchableOpacity, Image} from 'react-native';
// import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSidebarMenu from './CustomSidebarMenu';
// import i18n from '../screens/i18n';
import VerificationCode from '../screens/VerificationCode';
import FirstPage from './FirstPage';
import Registration from '../screens/Registration';
import LoginEmtdad from '../screens/LoginEmtdad';
import ConfirmIdentity from '../screens/ConfirmIdentity';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const NavigationDrawerStructure = props => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};

function RegistrationStack({navigation}) {
  return (
    <Stack.Navigator initialRouteName="Registration">
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          title: 'Registration', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B33541', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />

      <Stack.Screen
        name="ConfirmIdentity"
        component={ConfirmIdentity}
        options={{
          title: 'ConfirmIdentity', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B33541', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCode}
        options={{
          title: 'verification1', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B33541', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function LoginStack({navigation}) {
  return (
    <Stack.Navigator initialRouteName="LoginEmtdad">
      <Stack.Screen
        name="Login"
        component={LoginEmtdad}
        options={{
          title: 'login', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B51213', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />

      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          title: 'Registration', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B51213', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />

      <Stack.Screen
        name="ConfirmIdentity"
        component={ConfirmIdentity}
        options={{
          title: 'ConfirmIdentity', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B51213', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCode}
        options={{
          title: 'verification1', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B51213', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />

      <Stack.Screen
        name="SaleCarts"
        component={FirstPage}
        options={{
          title: 'SaleCarts', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#B51213', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontFamily: 'Cairo_600SemiBold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function RegistrationNavigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          // activeTintColor: '#e91e63',
          itemStyle: {marginVertical: 5},
          activeTintColor: '#ffffff',
          inactiveBackgroundColor: '#ffffff',
          activeBackgroundColor: '#B33541',
          inactiveTintColor: '#868788',
        }}
        drawerContent={props => <CustomSidebarMenu {...props} />}>
        {/* <Drawer.Screen
            name="Registration"
            options={{drawerLabel: ('Registration')}}
            component={RegistrationStack}
          /> */}

        <Drawer.Screen
          name="Login"
          options={{drawerLabel: 'login'}}
          component={LoginStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RegistrationNavigation;
