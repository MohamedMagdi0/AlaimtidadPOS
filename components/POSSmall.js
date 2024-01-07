import * as React from 'react';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,


} from 'react-native';
// import i18n from '../src/screens/i18n';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../src/screens/URL'
import { useTranslation } from 'react-i18next';
const POSSmall = () => {
  const {t} = useTranslation()
  const [TokenStatus, setTokenStatus] = React.useState(true)
  const [userFirstName, setName] = React.useState('');
  const [user_phonenumber, setNumber] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userLastName, setMiddle] = React.useState('');
  React.useEffect(() => {
    (
      async () => {
        let userFirstName = ''
        let user_phonenumber = ''
        //  let virtualMoneyBalance=''
        let userLastName = ''
        try {
          userFirstName = await AsyncStorage.getItem('userFirstName');
          user_phonenumber = await AsyncStorage.getItem('user_phonenumber');
          //virtualMoneyBalance=await AsyncStorage.getItem('virtualMoneyBalance');
          userLastName = await AsyncStorage.getItem('userLastName');
          setName(userFirstName);
          setNumber(user_phonenumber)
          // setMoney(virtualMoneyBalance)
          setMiddle(userLastName)
        }
        catch (e) {
          console.log(e.message);
        }

      })();



    (
      async () => {

        let user_id = 0
        let user_type_id = 0

        try {
          user_id = await AsyncStorage.getItem('userIdInUsers');
          user_type_id = await AsyncStorage.getItem('user_type_id');

          const response = await axios.post(
            API_URL + `user/userdata?s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`, { userData: await AsyncStorage.getItem('user_phonenumber') },

            {
              headers: {
                'x-access-token': `${await AsyncStorage.getItem('Token')}`
              }
            }
          )

          if (response.data == "Token UnAuthorized" || response.data == "Token Expired") {
            Toast.show(t('You Have to login again'),
              Toast.LONG,
              {
                backgroundColor: "red",
                fontSize: 19,
                position: 660,
                mask: true,

              }
            )
            setTokenStatus(false)
          }
          //  console.log("response",response.data.message);
          else {
            setTokenStatus(true);

            setMoney(response.data[0].current_balance);
          }
        }
        catch (e) {
          console.log(e.message);
        }


      })();




  }, []);



  return (
    <View style={styles.containerBig}>


      <SafeAreaView style={styles.container}>
        <Text style={styles.POS}>
          {t('POSName')}: {userFirstName} {userLastName}
        </Text>

      </SafeAreaView>


    </View>
  );
}
const styles = StyleSheet.create({
  POS: {
    fontSize: 24,
    textAlign: 'center',
    //marginTop: hp('1%'), 
    color: '#4e31c1',
    // marginBottom:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

  },
  POS1: {
    fontSize: wp('6%'),
    textAlign: 'center',
    // marginTop: hp('1%'), 
    fontFamily: 'Cairo-SemiBold',
    color: '#fff'
  },
  containerBig: {
    flex: 1,
  },

  tinyLogo: {
    top: hp('1%'),
    height: hp('30%'),
    width: wp('60%'),
    marginLeft: wp('20%'),

  },
  POSphone: {
    fontSize: wp('10%'),
    textAlign: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo_600SemiBold',

  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },
  container: {
    // borderWidth:wp('0.4'),
    // borderColor:"#fff",
    alignItems: 'center',
    // borderRadius:10,
    alignSelf: 'center',
    // top: hp('1%'),
    //height:hp('25%'),
    width: hp('35%'),
    marginBottom: hp('2%'),
  },



});

export default POSSmall;