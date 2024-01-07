import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NumericFormat} from 'react-number-format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from './URL';
import {useTranslation} from 'react-i18next';
import CategoryCard from '../Components/CategoryCard';

const SimCompanyCategories = ({route, navigation}) => {
  const {t} = useTranslation();
  const params = route.params;
  console.log('paramssssss', params);
  const companyName = params.Company;
  const companyId = params.company_id;
  const [supportedCategories, setSupportedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [cover, setCover] = useState();
  const [coverSrc, setCoverSrc] = useState();
  const [TokenStatus, setTokenStatus] = useState(true);
  const [userName, setuserName] = useState('');
  const [virtualMoneyBalance, setMoney] = useState('');

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
        setTokenStatus(true);
        setMoney(response?.data[0]?.current_balance);
        setuserName(response?.data[0]?.userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  const coverImage = async () => {
    try {
      const user_id = await AsyncStorage.getItem('userIdInUsers');
      // company_id = 14
      const response = await axios.get(
        API_URL + `company/${companyId}/cover?s=${parseInt(user_id)}`,

        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      // console.log({ "responseeeeCover": response?.data?.cover?.data });
      setCover(response?.data?.cover?.data);
    } catch (e) {
      console.log('err', e.message);
    }
  };

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // console.log((binary));
    return binary;
  };
  // const uri = `data:image/png;base64,${arrayBufferToBase64(cover)}`

  useEffect(() => {
    // console.log(uri);
    // setCoverSrc(uri)
    coverImage();
  }, []);

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

  useEffect(() => {
    if (availableCategories.length == 0 && supportedCategories.length == 0) {
      // console.log('mgzzzz');

      getDate();
      availableCategory();
    }

    // return () => setAvailableCategories([]) && setSupportedCategories([])
  }, []);

  const availableCategory = async () => {
    let company_id = '';
    let region_id = '';
    let user_id = 0;
    try {
      user_id = await AsyncStorage.getItem('userIdInUsers');
      company_id = route.params.company_id;
      region_id = await AsyncStorage.getItem('regionId');
      const response = await axios.post(
        API_URL +
          `simcard/categories/sellprice?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {companyId: companyId, type: route.params.type},
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      setAvailableCategories(response?.data?.message);
      const response2 = await axios.get(
        API_URL +
          `simcard/getcategoriesAvailable?compId=${
            route.params.company_id
          }&catType='${route.params.type}'&s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      console.log('Response ==================================', response.data);
      setSupportedCategories(response2?.data);

      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired' ||
        response2.data == 'Token UnAuthorized' ||
        response2.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setTokenStatus(false);
        // setLoading(false);
      } else {
        console.log('response//////', response.data);
        setTokenStatus(true);
        setprice(response.data.message);

        if (
          response.data.message !=
          'No Cards Available For This Category or bundle is expired'
        ) {
          let arr1 = [];
          response.data.message.map((item, i) => {
            arr1.push({
              card_category_id: item.card_category_id,
              sell_price: item.sell_price,
              discount: item.discount,
            });
          });
        }

        let arr2 = [];
        response2.data.map((item, i) => {
          arr2.push({
            card_category_id: item.cards_category_id,
            available_flag: item.available_flag,
          });
        });
        console.log('items of arr2', arr2);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

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
            zIndex: 9999999999,
          }}>
          <View style={styles.CoverContainer}>
            <Image
              style={styles.imgStyle}
              source={{
                uri: `data:image/png;base64,${arrayBufferToBase64(cover)}`,
              }}
            />
          </View>
          <View style={{marginTop: hp('3%')}}>
            {supportedCategories.length > 0 ? (
              <FlatList
                data={supportedCategories}
                renderItem={({item}) => {
                  console.log('supported itemm', item);
                  return (
                    <CategoryCard
                      disable={
                        !(
                          Array.isArray(availableCategories) &&
                          availableCategories?.find(availableItem => {
                            return (
                              availableItem.card_category_id ==
                              item.cards_category_id
                            );
                          })
                        )
                      }
                      availableBundle={
                        Array.isArray(availableCategories) &&
                        availableCategories?.find(availableItem => {
                          console.log({availableItem});
                          return (
                            availableItem.card_category_id ==
                            item.cards_category_id
                          );
                        })
                      }
                      key={item?.cards_category_id}
                      cards_category_id={item?.cards_category_id}
                      // category_currency={item?.category_currency}
                      category_currency={'دينار عراقى'}
                      category_value={item?.sell_price}
                      image={item?.image}
                      company_id={item?.company_id}
                      category_text={item?.category_text}
                      functionality={() =>
                        navigation.navigate('SimCardsPayCards', {
                          card_category_id: item.cards_category_id,
                          company_id: item.company_id,
                          category: `${item.category_value}-IQD`,
                          Company: route?.params?.Company,
                          type: item.category_type,
                        })
                      }
                    />
                  );
                }}
              />
            ) : (
              <ActivityIndicator color={'#4e31c1'} size="large" />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  POS: {
    fontSize: wp('5%'),
    textAlign: 'center',
  },
  containerBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBig1: {
    flex: 1,
    // backgroundColor: '#8a53e5',
    // zIndex: 1
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
  POS: {
    fontSize: wp('5%'),
    textAlign: 'center',
  },
  ImageAsiacell1: {
    alignSelf: 'center',
  },
  ImageAsiacell3: {
    width: Dimensions.get('window').width * 0.3,
    backgroundColor: '#4e31c1',
    height: hp('12%'),
    borderRadius: 14,
    marginTop: hp('0.1%'),
    borderWidth: 3,
    borderColor: '#fff',
    opacity: 0.85,
  },
  ImageAsiacell: {
    marginLeft: wp('1%'),
  },
  box: {
    backgroundColor: 'transparent',
    //borderColor: 'grey',
    opacity: 0.85,
    borderWidth: 2,
    shadowColor: 'black',
    shadowRadius: 4,
    shadowOpacity: 1,
    borderRadius: 20,
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('165%'),
  },
  container: {
    width: Dimensions.get('window').width * 0.3,
    backgroundColor: '#4e31c1',
    height: hp('12%'),
    borderRadius: 14,
    marginTop: hp('0.1%'),
    borderWidth: 3,
    borderColor: '#fff',
  },
  text: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    // marginTop:wp('2%'),
  },
  text1: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },
  text10: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    marginTop: hp('3%'),
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
  CoverContainer: {
    // backgroundColor: "blue",
    width: '90%',
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  imgStyle: {
    width: '90%',
    height: 90,
    alignSelf: 'center',
  },
});
export default SimCompanyCategories;
