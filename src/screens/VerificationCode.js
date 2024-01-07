import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Platform,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Text,
  CheckBox,
  StyleSheet,
  TextInput,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import i18n from './i18n';

function VericationCode({navigation}) {
  const {t} = useTranslation();

  return (
    <ImageBackground
      source={require('../../assets/backgroumd34.png')}
      style={{height: '100%', width: '100%', flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.Title}> {t('verification')}</Text>
          <View style={styles.InputsContainer}>
            <View style={styles.InputsOut}>
              <View style={styles.Inputs}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.inputStyle}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>{t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp('30%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    marginTop: wp('18%'),
    padding: wp('2%'),
    width: wp('37%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginBottom: wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },

  InputsOut: {
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#4e31c1',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.9%'),
    width: wp('69.8%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },

  Inputs: {
    marginTop: hp('-1%'),
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#FFF',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.5%'),
    width: wp('69%'),
    backgroundColor: '#FFFAFA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },

  btnText: {
    color: '#fff',
    fontSize: wp('6%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },

  inputStyle: {
    marginTop: hp('-0.9%'),
    fontSize: wp('5%'),
    borderRadius: 100,
    borderColor: '#D3D3D3',
    borderWidth: 2.5,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6%'),
    width: wp('67.6%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
  },

  InputsContainer: {
    marginTop: wp('6%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },

  Title: {
    top: hp('-1%'),
    color: '#4e31c1',
    marginRight: wp('4%'),
    fontSize: wp('5'),
    fontFamily: 'Cairo-SemiBold',
  },
});
export default VericationCode;
