//Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import * as React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  BackHandler,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
// import i18n from '../screens/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../screens/URL';
import Toast from 'react-native-simple-toast';
import {NumericFormat} from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import CompanyCard from '../Components/CompanyCard';

const FirstPage = ({navigation, route}) => {
  const calssificationId = route?.params?.calssificationId;
  // console.log({ calssificationId });
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [userName, setuserName] = React.useState('');
  const [companies, setCompanies] = React.useState([]);
  const [currency, setcurrency] = React.useState('');
  const [readyData, setReadyData] = React.useState(false);

  const [img, setImg] = React.useState();
  const [imageSrc, setImageSrc] = React.useState();

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

  // // React.useEffect(() => {
  // //   console.log({ "img": img, "imageSrc": imageSrc })

  // // }, [imageSrc])

  // const arrayBufferToBase64 = buffer => {
  // }
  // React.useEffect(() => {
  //   // console.log({ img });
  //   setImg(uri)
  //   // console.log({ uri });

  // }, [imageSrc])

  async function getDate() {
    try {
      const deviceId = await AsyncStorage.getItem('deviceId');
      await axios
        .post(
          API_URL +
            `log/blocked?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {deviceId: deviceId},
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        )
        .then(response => {
          // console.log("response", response);
        })
        .catch(e => {
          console.log(e);
          setTokenStatus(false);
        });
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
        Toast.show(t('You Have to login again'), Toast.LONG, {
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
        setcurrency('IQD');
      }
    } catch (e) {
      console.log(e.message);
    }
    const user_type_id = await AsyncStorage.getItem('user_type_id');
    const user_id = await AsyncStorage.getItem('userIdInUsers');
    axios
      .get(
        `${API_URL}company/regions/${user_id}/${user_type_id}?s=${parseInt(
          await AsyncStorage.getItem('userIdInUsers'),
        )}&classification=${calssificationId}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      )
      .then(response => {
        setCompanies(response?.data?.response);
        console.log('companiessssssss :', response?.data?.response);
        setReadyData(true);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  //  const _handleBackButtonClick = () => {

  //     alert("Do you want to exit app")
  //     navigation.navigate('Login')
  //    BackHandler.exitApp()
  //     Alert.alert(
  //       "OOhh :(",
  //       "Do you want to exit app",
  //       [
  //         {
  //           text: "No",
  //           onPress: () => console.log("Cancel Pressed"),
  //           style: "cancel"
  //         },
  //         { text: "Yup", onPress: () =>  BackHandler.exitApp() }
  //       ],
  //       { cancelable: false }
  //     );

  //     return true;
  //   }

  React.useEffect(() => {
    // BackHandler.removeEventListener('hardwareBackPress', () => _handleBackButtonClick())
    (async () => {
      // const unsubscribe = navigation.addListener('focus', async () => {
      //   // console.log("HI Again From Pos_homepage ")
      //   getDate();
      // });
      getDate();
    })();
    // const backAction = () => {
    //   Alert.alert("انتظر من فضلك!", "هل تريد الخروج من التطبيق ؟", [
    //     {
    //       text: "لا",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "نعم", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };

    (async () => {
      let Token = '';
      let user_type_id = '';

      try {
        Token = await AsyncStorage.getItem('Token');
        user_type_id = await AsyncStorage.getItem('user_type_id');

        settoken(Token);
        settype(user_type_id);
      } catch (e) {
        console.log(e.message);
      }
    })();
    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();
  }, []);

  if (token == null && user_type_id !== 3) {
    return (
      <View>
        <Image
          width={Dimensions.get('window').width}
          source={require('../../assets/unauthorized.png')}
          style={styles.NotAuthorizrd}></Image>
        <Text style={styles.btnText6}>{t('NotAuthorizrd')}</Text>
        {/* <Text>NotAuthorizrd</Text> */}
      </View>
    );
  }
  // else if (TokenStatus == false) {
  //   return (
  //     <View>
  //       <Text style={{ color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center' }}>
  //         {t('You Have to login again')}
  //       </Text>
  //     </View>
  //   )
  // }
  else {
    return (
      <>
        <View style={styles.containerBig}>
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
                  {currency}
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
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: hp('2.9%'),
                    width: Dimensions.get('window').width,
                    justifyContent: !readyData ? 'center' : 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: "green",
                    alignSelf: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {!readyData ? (
                    <ActivityIndicator
                      color={'#4e31c1'}
                      size="large"
                      style={{display: 'flex', justifyContent: 'center'}}
                    />
                  ) : companies.length > 0 ? (
                    <FlatList
                      data={companies}
                      numColumns={2}
                      renderItem={({item}) => (
                        <CompanyCard
                          image={item.image.data}
                          company_id={item.company_id}
                          company_name={item.company_name}
                          functionality={() =>
                            navigation.navigate('CompanyCategories', {
                              company_id: item.company_id,
                              Company: item.company_name,
                            })
                          }
                        />
                      )}
                      keyExtractor={item => item.company_id}
                    />
                  ) : (
                    <Text style={styles.NoCompanyData}>لا يوجد شركات</Text>
                  )}
                </View>
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
  POS: {
    fontSize: wp('5%'),
    textAlign: 'center',
    color: '#fff',
  },
  adsl: {
    width: '50%',
    height: 120,
    //marginLeft:wp('25%'),
    // backgroundColor: "blue",
    // margin: 5,
    // padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: '90%',
    height: '90%',
  },
  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: wp('16%'),
  },
  NoCompanyData: {
    color: '#000',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('7%'),
    textAlign: 'center',
    width: '100%',
  },
});

export default FirstPage;
