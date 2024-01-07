import * as React from 'react';
import {
  Button,
  Platform,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Text,
  CheckBox,
  StyleSheet,
  ScrollView,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import i18n from './i18n';

function ConfirmIdentity({navigation}) {
  return (
    <ImageBackground
      source={require('../../assets/backgroumd34.png')}
      style={{height: '100%', width: '100%', flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.InputsContainer}>
            <Text style={styles.Title}> {'confirmPOS'}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('VerificationCode')}>
            <Text style={styles.btnText}>{'confirmpress'}</Text>
          </TouchableOpacity>

          <Text style={styles.TitleBox}> {'BoxPOS'}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('20%'),
  },

  button: {
    marginTop: wp('-5%'),
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
  btnText: {
    color: '#fff',
    fontSize: wp('6%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },

  inputStyle: {
    fontSize: wp('5%'),
    borderRadius: 6,
    borderColor: '#F796A0',
    borderWidth: 0.9,
    marginTop: wp('-33%'),
    paddingHorizontal: wp('2%'),
    color: '#000000',
    marginBottom: wp('-8%'),
    height: hp('5%'),
    backgroundColor: 'transparent',
    width: hp('28%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  InputsContainer: {
    top: wp('6%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },

  Title: {
    top: hp('-10%'),
    color: '#4e31c1',
    marginRight: wp('13%'),
    fontSize: wp('6'),
    fontFamily: 'Cairo-SemiBold',
  },

  TitleBox: {
    marginTop: hp('10%'),
    color: '#4e31c1',
    fontSize: wp('6'),
    fontFamily: 'Cairo-SemiBold',
    paddingHorizontal: hp('6%'),
    padding: hp('1.5%'),
    height: hp('20%'),
  },
});
export default ConfirmIdentity;
