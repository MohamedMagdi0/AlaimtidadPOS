import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import API_URL from './URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassificationCard from '../Components/ClassificationCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NumericFormat} from 'react-number-format';
import {useTranslation} from 'react-i18next';

const SimCompanyClassification = ({navigation, route}) => {
  const {t} = useTranslation();
  const [classificationData, setClassificationData] = useState([]);
  const [userName, setuserName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  // console.log("parammsss,mmss ", route.params.comingfrom);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
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
          Toast.show('You Have to login again', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          setTokenStatus(false);
        }
        //  console.log("response",response.data.message);
        else {
          setTokenStatus(true);

          setMoney(response.data[0].current_balance);
          setuserName(response.data[0].userName);
          console.log('balance updated');
        }
      } catch (e) {
        console.log(e.message);
      }

      console.log('// do something');
    });

    return unsubscribe;
  }, [navigation]);

  async function getDateCat() {
    try {
      // console.log("SimCompanyClassification diddmount");
      const response = await axios.get(
        API_URL +
          `company/classificatons?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      setClassificationData(response.data.data);
      // console.log({ classificationData });
      // setuserName((response.data[0].userName));

      // console.log("magdiData", response.data.data);
      //   for (let i = 0; i < response.data.message.length; i++) {

      // if (response.data.message[i].company_id === route.params.company_id) {
      //   console.log("lllll", response.data.message[i].company_id);
      //   console.log("ffffff", route.params.company_id);
      //   console.log("qqqqq", response.data.message[i].QR_code);

      //   setShow(response.data.message[i].QR_code)
      // }
      //   }
      // console.log("magdi", response.data);
    } catch (e) {
      console.log(e.message);
    }
  }
  async function getDate() {
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
      console.log('hey mgxz', response?.data[0]);
      setMoney(response?.data[0]?.current_balance);
      setuserName(response?.data[0]?.userName);
      setTokenStatus(true);

      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired'
      ) {
        Toast.show('You Have to login again', {
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
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  useEffect(() => {
    getDateCat();
    getDate();
  }, [userName]);

  if (TokenStatus == false) {
    <View>
      <Text style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
        {t('You Have to login again')}
      </Text>
    </View>;
  }
  // else if (Image2 == null) {
  //     return (

  //         <DotIndicator color="#4e31c1" />

  //     );
  // }

  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/upper.png')}
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
          <View
            style={{
              marginTop: hp('3%'),
              // marginTop: hp('2.9%'),
              display: 'flex',
              flexDirection: 'row',
              // width: Dimensions.get('window').width,
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
              // backgroundColor: "green",
              alignSelf: 'center',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            {/* <SafeAreaView style={styles.container} > */}
            <FlatList
              numColumns={2}
              contentContainerStyle={{
                marginTop: hp('3%'),

                // backgroundColor: "blue",
                display: 'flex',
                flexDirection: 'row',
                width: Dimensions.get('window').width,
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                // backgroundColor: "green",
                alignSelf: 'center',
                flexWrap: 'wrap',
                flex: 1,
              }}
              data={classificationData}
              renderItem={({item}) => (
                <ClassificationCard
                  key={item?.calssification_id}
                  calssificationId={item?.calssification_id}
                  arabicName={item?.arabic_name}
                  englishName={item?.english_name}
                  image={item?.image}
                  functionality={() => {
                    console.log('SoldPOS*****************************');
                    navigation.navigate('SoldPOS', {
                      calssificationId: item?.calssification_id,
                    });
                  }}
                />
              )}
              keyExtractor={item => item?.id}
            />
            {/* </SafeAreaView> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#8a53e5',
    display: 'flex',
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // flexWrap: "wrap"
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
  POS1: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: wp('4%'),
    textAlign: 'left',
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
});

export default SimCompanyClassification;
