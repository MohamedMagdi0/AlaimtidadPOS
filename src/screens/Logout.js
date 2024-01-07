import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withTranslation} from 'react-i18next';
import i18n from 'i18next';
import {StackActions} from '@react-navigation/native';

class Logout extends React.Component {
  async onPressLogout() {
    let Token = '';
    let user_type_id = '';
    console.log('token logged out1', AsyncStorage.getItem('Token'));

    try {
      Token = await AsyncStorage.removeItem('Token');
      user_type_id = await AsyncStorage.removeItem('user_type_id');
      await AsyncStorage.removeItem('commercialName');
      await AsyncStorage.removeItem('regionId');
      await AsyncStorage.removeItem('userId');
      // await AsyncStorage.removeItem('user_phonenumber');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userFirstName');
      await AsyncStorage.removeItem('usermiddleName');
      await AsyncStorage.removeItem('userLastName');
      await AsyncStorage.removeItem('virtualMoneyBalance');
      await AsyncStorage.removeItem('area');
      await AsyncStorage.removeItem('region');
      await AsyncStorage.removeItem('userIdInUsers');
      await AsyncStorage.removeItem('printerAddress');
      await AsyncStorage.removeItem('printerName');

      // this.props.navigation.navigate('Login')

      // BackHandler.exitApp()
      this.props.navigation.dispatch(StackActions.popToTop());
    } catch (e) {
      console.log(e.message);
    }
    console.log('TokenComponentDidmoundlogout', Token);
  }

  render() {
    return (
      <>
        <View style={styles.containerBig}>
          <ImageBackground
            source={require('../../assets/top1.png')}
            style={{
              height: '100%',
              width: Dimensions.get('window').width,
              alignself: 'center',
              flex: 1,
            }}></ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#8a53e5',
          }}>
          <ScrollView
            style={{
              backgroundColor: '#fff',
              alignself: 'center',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              marginTop: hp('-1%'),
            }}>
            <View
              style={{
                marginTop: hp('10%'),
              }}>
              <Text
                style={{
                  fontSize: wp('6%'),
                  marginTop: hp('1%'),
                  alignSelf: 'center',
                  color: '#4e31c1',
                  marginBottom: hp('2%'),
                  fontFamily: 'Cairo-SemiBold',
                }}>
                {i18n.t('YouareLoggedout')}
              </Text>
              <TouchableOpacity
                style={styles.button1}
                onPress={() => this.onPressLogout()}>
                <Text style={styles.btnText2}>{i18n.t('Logout')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

export default withTranslation()(Logout);

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    backgroundColor: '#8a53e5',
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('80%'),
  },

  button1: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: 55,
    alignSelf: 'center',
    marginRight: wp('9%'),
    marginTop: hp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
  },
  button2: {
    marginTop: wp('12%'),

    padding: wp('2%'),

    width: wp('60%'),
    height: hp('7%'),
    marginLeft: wp('-2%'),
    // marginBottom:wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('4%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  button3: {
    marginTop: wp('10%'),
    backgroundColor: 'transparent',
    padding: wp('2%'),
    borderRadius: 50,
    width: wp('60%'),
    marginLeft: wp('-3%'),
    marginBottom: wp('5%'),
    borderRadius: 50,
    borderWidth: wp('0.5%'),
    borderColor: '#C81717',
    borderBottomWidth: wp('2%'),
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-1%'),
  },
  Title: {
    top: hp('-2%'),
    color: '#4e31c1',
    fontSize: wp('6%'),
    fontFamily: 'Cairo-SemiBold',
  },
});
