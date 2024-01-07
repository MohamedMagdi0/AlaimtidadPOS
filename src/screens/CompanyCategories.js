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
  VirtualizedList,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NumericFormat} from 'react-number-format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from './URL';
import CategoryCard from '../Components/CategoryCard';
import {useTranslation} from 'react-i18next';

const CompanyCategories = ({navigation, route}) => {
  const {t} = useTranslation();
  const [supportedCategories, setSupportedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [cover, setCover] = useState('');
  const [coverSrc, setCoverSrc] = useState();

  const [disable, setDisable] = useState(false);
  const params = route.params;
  const companyName = params.Company;
  const companyId = params.company_id;

  useEffect(() => {
    // console.log({ CompanyCategoriesParamsss: params })
    // console.log("is Array", Array.isArray(availableCategories));
  }, []);

  const [category7, setcategory7] = React.useState('');
  const [category8, setcategory8] = React.useState('');
  const [category9, setcategory9] = React.useState('');
  const [category10, setcategory10] = React.useState('');
  const [category11, setcategory11] = React.useState('');
  const [category12, setcategory12] = React.useState('');
  const [category13, setcategory13] = React.useState('');
  const [category14, setcategory14] = React.useState('');
  const [visible7, setvisible7] = React.useState(0);
  const [visible8, setvisible8] = React.useState(0);
  const [visible9, setvisible9] = React.useState(0);
  const [visible10, setvisible10] = React.useState(0);
  const [visible11, setvisible11] = React.useState(0);
  const [visible12, setvisible12] = React.useState(0);
  const [visible13, setvisible13] = React.useState(0);
  const [visible14, setvisible14] = React.useState(0);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [userName, setuserName] = React.useState('');
  const [userMName, setuserMName] = React.useState('');
  const [userLName, setuserLName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [loading, setLoading] = React.useState(true);
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

  async function availableCategory() {
    let region_id = '';
    // let company_id = ''
    let user_id = 0;
    try {
      setLoading(true);
      user_id = await AsyncStorage.getItem('userIdInUsers');
      // company_id = 14
      region_id = await AsyncStorage.getItem('regionId');
      const response = await axios.post(
        API_URL +
          `getbundledata/sellprice?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          company_id: companyId,
          region_id: region_id,
          user_id: parseInt(user_id),
        },

        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      // console.log({ availableCategories: response?.data?.message });
      setAvailableCategories(response?.data?.message);
      const response2 = await axios.get(
        API_URL +
          `companycards/get-available-categories/${companyId}?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      // console.log({ supportedCategories: response2?.data });
      const newData = await response2?.data;
      setSupportedCategories([...newData]);
      setLoading(false);
      // ([...response2?.data, ...newData]);
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
        //  setLoading(false);
      }
      //  console.log("response",response.data.message);
      else {
        //setLoading(false);

        setTokenStatus(true);

        let c7 = '';
        let c8 = '';
        let c9 = '';
        let c10 = '';
        let c11 = '';
        let c12 = '';
        let c13 = '';
        let c14 = '';

        if (
          response?.data?.message !=
          'No Cards Available For This Category or bundle is expired'
        ) {
          let arr1 = [];
          response?.data?.message?.map((item, i) => {
            arr1.push({
              card_category_id: item.card_category_id,
              sell_price: item.sell_price,
              discount: item.discount,
            });
          });

          {
            arr1.map((item, i) => {
              if (item.card_category_id == 127) {
                c7 = item.sell_price;
                setcategory7(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }
              if (item.card_category_id == 128) {
                c8 = item.sell_price;

                setcategory8(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }
              if (item.card_category_id == 129) {
                c9 = item.sell_price;
                setcategory9(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }
              if (item.card_category_id == 130) {
                c10 = item.sell_price;
                setcategory10(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }

              if (item.card_category_id == 131) {
                c11 = item.sell_price;
                setcategory11(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }

              if (item.card_category_id == 132) {
                c12 = item.sell_price;
                setcategory12(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }

              if (item.card_category_id == 133) {
                c13 = item.sell_price;
                setcategory13(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }

              if (item.card_category_id == 134) {
                c14 = item.sell_price;
                setcategory14(
                  parseInt(item.sell_price) + parseInt(item.discount),
                );
              }
            });
          }
        }
        let arr2 = [];
        response2?.data?.map((item, i) => {
          arr2.push({
            card_category_id: item.cards_category_id,
            available_flag: item.available_flag,
          });
        });
        {
          arr2.map((item, i) => {
            if (item.card_category_id == 127) {
              setvisible7(item.available_flag);
            }
            if (item.card_category_id == 128) {
              setvisible8(item.available_flag);
            }
            if (item.card_category_id == 129) {
              setvisible9(item.available_flag);
            }
            if (item.card_category_id == 130) {
              setvisible10(item.available_flag);
            }

            if (item.card_category_id == 131) {
              setvisible11(item.available_flag);
            }

            if (item.card_category_id == 132) {
              setvisible12(item.available_flag);
            }

            if (item.card_category_id == 133) {
              setvisible13(item.available_flag);
            }

            if (item.card_category_id == 134) {
              setvisible14(item.available_flag);
            }
          });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    if (availableCategories.length == 0 && supportedCategories.length == 0) {
      // console.log('mgzzzz');

      getDate();
      availableCategory();
    }

    // return () => setAvailableCategories([]) && setSupportedCategories([])
  }, [availableCategories]);
  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#1c79f2', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  }
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
          <View style={styles.CoverContainer}>
            <Image
              style={styles.imgStyle}
              source={{
                uri: `data:image/png;base64,${arrayBufferToBase64(cover)}`,
              }}
            />
          </View>
          <SafeAreaView style={{marginTop: hp('3%')}}>
            {loading ? (
              <ActivityIndicator color={'#4e31c1'} size="large" />
            ) : <></> && supportedCategories.length > 0 && !loading ? (
              <FlatList
                VirtualizedList={true}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={3}
                removeClippedSubviews={true}
                keyExtractor={item => item.category_text.toString()}
                data={supportedCategories}
                renderItem={({item}) => (
                  <CategoryCard
                    disable={
                      !(
                        Array.isArray(availableCategories) &&
                        availableCategories?.find(availableItem => {
                          return (
                            availableItem.cards_category_id ==
                            item.cards_category_id
                          );
                        })
                      )
                    }
                    availableBundle={
                      Array.isArray(availableCategories) &&
                      availableCategories?.find(availableItem => {
                        // console.log({availableItem});
                        return (
                          availableItem.cards_category_id ==
                          item.cards_category_id
                        );
                      })
                    }
                    key={item?.cards_category_id}
                    cards_category_id={item?.cards_category_id}
                    // category_currency={item?.category_currency}
                    category_currency={'دينار عراقى'}
                    category_value={item?.category_value}
                    image={item?.image}
                    company_id={item?.company_id}
                    category_text={item?.category_text}
                    functionality={() =>
                      navigation.navigate('PosBuyCreditCart', {
                        company_id: item?.company_id,
                        card_category_id: item?.cards_category_id,
                        category: item?.category_text,
                        Company: item?.company.toLowerCase(),
                        cover,
                        // Company: "Korek",
                        // image: item?.image
                      })
                    }
                  />
                )}
              />
            ) : (
              <Text style={styles.NoCategoriesData}>لا يوجد فئات</Text>
            )}
          </SafeAreaView>
        </View>
      </View>
      {/* <Text onPress={() => navigation.navigate('PosBuyCreditCart', { card_category_id: 127, company_id: 14, category: "10$ امريكي", Company: "Amazon" })}>CompanyCategories</Text> */}
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
  NoCategoriesData: {
    color: '#000',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('7%'),
    textAlign: 'center',
    width: '100%',
  },
});

export default CompanyCategories;
