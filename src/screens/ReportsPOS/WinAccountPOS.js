import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Card} from '@rneui/themed';
//import i18n from 'i18n-js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../URL';
import Toast from 'react-native-simple-toast';
import {NumericFormat} from 'react-number-format';
import {useTranslation} from 'react-i18next';

const WinAccountPOS = ({navigation}) => {
  const {t} = useTranslation();
  const [details, setDetails] = React.useState({
    information: null,
  });
  const [userName, setuserName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  async function getDate() {
    let userId = 0;
    let userTypeId = 0;

    try {
      userId = await AsyncStorage.getItem('userIdInUsers');
      userTypeId = await AsyncStorage.getItem('user_type_id');

      const response = await axios.post(
        API_URL +
          `totalprofit?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {userId: parseInt(userId), userTypeId: parseInt(userTypeId)},
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), {
          position: 660,
          containerStyle: {backgroundColor: 'red'},
          textStyle: {fontSize: 19},
          mask: true,
          maskStyle: {},
        });
        setTokenStatus(false);
      }
      //  console.log("response",response.data.message);
      else {
        setTokenStatus(true);
        setDetails({information: response.data.message});
      }
    } catch (e) {
      console.log(e.message);
    }

    try {
      const response = await axios.post(
        API_URL +
          `user/userdata?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {userData: await AsyncStorage.getItem('user_phonenumber')},
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), {
          position: 660,
          containerStyle: {backgroundColor: 'red'},
          textStyle: {fontSize: 19},
          mask: true,
          maskStyle: {},
        });
        setTokenStatus(false);
      }
      //  console.log("response",response.data.message);
      else {
        setTokenStatus(true);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From WinAccount');
        getDate();
      });

      getDate();
    })();
  }, []);

  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else if (details.information == null) {
    return (
      <View>
        <ActivityIndicator color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.containerBig}>
          <ScrollView>
            <ImageBackground
              source={require('../../../assets/upper.png')}
              style={{
                height: '100%',
                width: '100%',
                alignself: 'center',
                flex: 1,
              }}>
              <View style={{marginTop: hp('1%')}}>
                <Text style={styles.POS3}> {userName}</Text>

                <Text style={styles.POS1}>{t('CurrentCredit')}</Text>
                <Text style={styles.POSyellow}>
                  IQD
                  <NumericFormat
                    renderText={value => (
                      <Text style={styles.POSyellow}> {value}</Text>
                    )}
                    value={virtualMoneyBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={0}
                  />
                </Text>
              </View>
            </ImageBackground>
            <View style={styles.containerBig1}>
              <View
                style={{
                  backgroundColor: '#fff',
                  marginTop: hp('-4%'),
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                }}>
                <Card containerStyle={styles.cardCnt}>
                  <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
                    <Card.Title
                      style={{
                        color: '#4e31c1',
                        fontSize: 20,
                        marginTop: hp('2%'),
                      }}>
                      {t('winaccount2')}
                    </Card.Title>
                  </View>
                  {/* <Card.Image source={require('../../../assets/statistics2.png')} style={{ height:40,width:40}} /> */}
                  <Card.Divider />

                  <Text
                    style={{
                      marginBottom: 10,
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      fontSize: wp('5%'),
                    }}>
                    {t('sumofsalepricesale')}:{' '}
                    <NumericFormat
                      renderText={value => (
                        <Text
                          style={{
                            marginBottom: 10,
                            color: '#4e31c1',
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: wp('5%'),
                          }}>
                          {value}
                        </Text>
                      )}
                      value={details.information[0].totalSellPrice}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={0}
                    />
                  </Text>
                  <Card.Divider />
                  <Text
                    style={{
                      marginBottom: 10,
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      fontSize: wp('5%'),
                    }}>
                    {t('sumofsalepriceBuy')}:{' '}
                    <NumericFormat
                      renderText={value => (
                        <Text
                          style={{
                            marginBottom: 10,
                            color: '#4e31c1',
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: wp('5%'),
                          }}>
                          {value}
                        </Text>
                      )}
                      value={details.information[0].totalPurchase}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={0}
                    />
                  </Text>

                  <Card.Divider />
                  <Text
                    style={{
                      marginBottom: 10,
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      fontSize: wp('5%'),
                    }}>
                    {t('profit')}:{' '}
                    <NumericFormat
                      renderText={value => (
                        <Text
                          style={{
                            marginBottom: 10,
                            color: '#4e31c1',
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: wp('5%'),
                          }}>
                          {value}
                        </Text>
                      )}
                      value={details.information[0].totalProfit}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={0}
                    />{' '}
                    دينار
                  </Text>
                </Card>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBig1: {
    flex: 1,
    backgroundColor: '#8a53e5',
  },
  POS3: {
    fontSize: wp('7%'),
    textAlign: 'left',
    marginTop: hp('0.5%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    marginLeft: wp('2%'),
    marginBottom: hp('1%'),
  },
  POS9: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    // marginBottom:hp('11%'),
    fontSize: 21,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },
  POSyellow: {
    textAlign: 'left',
    // marginTop: hp('15%'),
    marginLeft: wp('4%'),
    color: '#ffd775',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    marginBottom: hp('5%'),
    fontSize: 24,
  },
  POS1: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: wp('4%'),
    textAlign: 'left',
  },

  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#fff',
  },
});

export default WinAccountPOS;
