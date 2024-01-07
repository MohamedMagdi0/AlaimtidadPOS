// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import * as React from 'react';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {NumericFormat} from 'react-number-format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import API_URL from '../screens/URL';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native';
import CompanyCard from '../Components/CompanyCard';

const FirstPageReport = ({navigation, route}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [companies, setCompanies] = React.useState([]);

  const calssificationId = route?.params?.calssificationId;
  console.log('route?.params----------', calssificationId);
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
        console.log('companies regions', response.data.response);
        setCompanies(response?.data?.response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  React.useEffect(() => {
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From POS_Fill_the_machine ');
        getDate();
      });

      getDate();
    })();
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
  }, []);

  if (token == null && user_type_id !== 3) {
    return (
      <View>
        <Pressable
          source={require('../../assets/unauthorized.png')}
          style={styles.NotAuthorizrd}>
          <Image width={Dimensions.get('window').width} />
        </Pressable>
        <Text style={styles.btnText6}>(t{'NotAuthorizrd'})</Text>
        {/* <Text>NotAuthorizrd</Text> */}
      </View>
    );
  }
  // else if (TokenStatus == false) {
  //   return (
  //     <View>
  //       <Text style={{ color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center' }}>
  //         (t{'You Have to login again'})
  //       </Text>
  //     </View>
  //   )
  // }
  else {
    // console.log("Reports")
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
              {/* <Text style={styles.POS3}> {userName}</Text> */}

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

            {/*         
            <View>
            <Text style={styles.POS1}>
        {t('CurrentCredit')}<NumericFormat
        renderText={value => <Text  style={styles.POS1} >{value}</Text>} 
        value={virtualMoneyBalance} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />
        </Text>
      
      
            </View> */}

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
                    flexDirection: 'column',
                    marginTop: hp('2.9%'),
                    width: Dimensions.get('window').width,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: "green",
                    alignSelf: 'center',
                  }}>
                  {companies.length > 0 ? (
                    <FlatList
                      data={companies}
                      numColumns={2}
                      renderItem={({item}) => (
                        <CompanyCard
                          image={item.image.data}
                          company_id={item.company_id}
                          company_name={item.company_name}
                          functionality={() =>
                            navigation.navigate('SoldPOS', {
                              companyId: item.company_id,
                              companyname: item.company_name,
                            })
                          }
                        />
                      )}
                      keyExtractor={item => item.company_id}
                    />
                  ) : (
                    <ActivityIndicator color={'#4e31c1'} size="large" />
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
    backgroundColor: 'grey',
  },
  imgStyle: {
    width: '90%',
    height: '90%',
  },
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

  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: wp('16%'),
  },
});

export default FirstPageReport;
