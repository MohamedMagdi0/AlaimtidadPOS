import * as React from 'react';
import {
  Button,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';

import NetInfo from '@react-native-community/netinfo';
//import i18n from 'i18n-js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../URL';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-simple-toast';
import {NumericFormat} from 'react-number-format';
import {useTranslation} from 'react-i18next';

const CompensatedMoneyOfDeletedCards = ({navigation}) => {
  const {t} = useTranslation();
  const [connectionType, setconnectionType] = React.useState('');
  const [connection, setconnection] = React.useState('');

  const [date, setDate] = React.useState(new Date(1598051730000));
  const [fromDate, setfromDate] = React.useState('من التاريخ');
  const [toDate, settoDate] = React.useState('الى تاريخ');
  const [from, setfrom] = React.useState('');
  const [to, setto] = React.useState('');
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [dateTO, setDateTO] = React.useState(new Date(1598051730000));
  const [modeTO, setModeTO] = React.useState('date');
  const [showTO, setShowTO] = React.useState(false);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [userfName, setuserName] = React.useState('');
  const [userMName, setuserMName] = React.useState('');
  const [userLName, setuserLName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [compensatedMoneyArray, setCompensatedMoneyArray] = React.useState([
    {
      vm_transaction_id: '',
      userName: '',
      userPhoneNumber: '',
      virtual_mony_transaction_value: '',
      virtual_mony_transaction_data_time: '',
      virtual_mony_transaction_extra_fees_id: '',
      virtual_mony_transaction_id: '',
    },
  ]);
  // const[totalCompensatedMoney,setTotalCompensatedMoney]=React.useState(0);

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
        console.log('HI Again From PosBuyCreditCard ');
        getDate();
      });

      getDate();
      NetInfo.fetch().then(state => {
        console.log('Connection type taken money', state.type);
        setconnectionType(state.type);
        console.log('Is connected? taken money', state.isConnected);
        setconnection(state.isConnected);
      });
    })();
  }, []);
  const showDatepicker = () => {
    showMode('date');
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showModeTo = currentMode => {
    setShowTO(true);
    setModeTO(currentMode);
  };

  const showDatepickerTo = () => {
    showModeTo('date');
  };

  const onChange = (event, selectedDate) => {
    // console.log("SelectedDate",selectedDate);
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    setfrom(selectedDate);
    setfromDate(selectedDate.toISOString().split('T')[0]);
  };

  const onChangeTo = (event, selectedDate) => {
    //   console.log("selectedDateTo",selectedDate);
    const currentDate = selectedDate;
    setShowTO(Platform.OS === 'ios');
    setto(selectedDate);
    settoDate(selectedDate.toISOString().split('T')[0]);
  };

  const renderCompensatedMoney = ({item}) => {
    return (
      <>
        <Card containerStyle={styles.cardCnt} key={item.vm_transaction_id}>
          <View style={{marginTop: hp('1%')}}></View>
          <Text style={styles.cardData}>
            رقم الفاتورة: {item.vm_transaction_id}
          </Text>
          <Card.Divider />
          {/* <Text style={[styles.cardData,{alignSelf:'flex-start'} ]}>
                      {item.virtual_mony_transaction_serial_number} :{("Serial")}  
                      </Text>
                      <Card.Divider/> */}
          <Text style={styles.cardData}>
            القيمة التعويضية: {item.vm_balance}
          </Text>
          <Card.Divider />
          <Text style={styles.cardData}>تعويض من: {item.user_name}</Text>
          {/* <Card.Divider/> 
                      <Text style={styles.cardData}>
                        اسم المرسل: {item.from_userName} 
                      </Text> */}
          <Card.Divider />
          <Text style={styles.cardData}>
            تاريخ التعويض: {item.vm_transaction_date_time}
          </Text>
        </Card>
      </>
    );
  };

  const search = async () => {
    console.log('From', from.toString().split('T')[0]);
    console.log('To', to.toString().split('T')[0]);

    //Axios

    let userId = 0;
    let userTypeId = 0;
    let userPhoneNumber = '';
    console.log('From', from);
    console.log('to', to);
    if (from == '' || to == '') {
      console.log('hhhhh');
      Toast.show(t('SelectDatePlz'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else {
      try {
        if (fromDate > toDate) {
          Toast.show('تاريخ "الي" يجب ان يكون بعد تاريخ "من"', Toast.LONG, {
            position: 660,
            backgroundColor: 'green',
            fontSize: 19,
            mask: true,
            color: 'white',
          });
        } else {
          userId = await AsyncStorage.getItem('userIdInUsers');
          userTypeId = await AsyncStorage.getItem('user_type_id');
          userPhoneNumber = await AsyncStorage.getItem('user_phonenumber');
          console.log('userId', userId);
          const response = await axios.post(
            API_URL +
              `virttualmoney/trans?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            {
              searchType: 5,
              from_date: fromDate,
              to_date: toDate,
            },
            {
              headers: {
                'x-access-token': `${await AsyncStorage.getItem('Token')}`,
              },
            },
          );
          console.log(
            'response=========================================',
            response.data,
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
          //console.log("response",response.data.message);
          else {
            console.log('Else');
            setTokenStatus(true);

            setTokenStatus(true);
            setCompensatedMoneyArray(response.data.transactions);
            //  setTotalCompensatedMoney(response.data.total)
          }
        }
      } catch (e) {
        console.log('Error', e.message);
      }
    }
  };
  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else if (compensatedMoneyArray.length == 0) {
    return (
      <View style={styles.containerBig}>
        <Text style={styles.nodata}> لا يوجد ارصدة تعويض كارتات ملغاة</Text>
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
                <Text style={styles.POS3}> {userfName}</Text>

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
                <SafeAreaView style={{flex: 1, marginTop: hp('5%')}}>
                  <Text
                    style={{
                      fontSize: wp('6%'),
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      alignSelf: 'center',
                      marginBottom: hp('2%'),
                    }}>
                    ارصدة تعويض الكارتات الملغاة
                  </Text>
                  {/* <Text style={{fontSize:wp('6%'),color:"#4e31c1",fontFamily:'Cairo-SemiBold',alignSelf:'center',marginBottom:hp('2%')}}>
      الاجمالي 

  <NumericFormat
      renderText={value => <Text  style={styles.totalText} > {value}</Text>} 
      value={totalCompensatedMoney} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />  
    </Text> */}

                  <View style={styles.fixToText}>
                    <Button
                      onPress={showDatepicker}
                      title={t('ChooseDate')}
                      color="#4e31c1"
                    />

                    <Button
                      onPress={showDatepickerTo}
                      title={t('ChooseDate')}
                      color="#4e31c1"
                    />
                  </View>

                  <View style={styles.fixToText}>
                    <Text
                      style={{
                        color: '#4e31c1',
                        fontSize: 20,
                        marginTop: hp('1%'),
                        fontFamily: 'Cairo-SemiBold',
                      }}>
                      {fromDate}
                    </Text>
                    <Text
                      style={{
                        color: '#4e31c1',
                        fontSize: 20,
                        marginTop: hp('1%'),
                        fontFamily: 'Cairo-SemiBold',
                      }}>
                      {toDate}
                    </Text>
                  </View>

                  {/* <View>
      showTO
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View> */}
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date()}
                      mode={mode}
                      is24Hour={false}
                      display="default"
                      onChange={onChange}
                    />
                  )}

                  {showTO && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date()}
                      mode={mode}
                      is24Hour={false}
                      display="default"
                      onChange={onChangeTo}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => search()}>
                    <Text style={styles.btnText2}>{t('Search')}</Text>
                  </TouchableOpacity>

                  <View style={{flex: 1, padding: 16, marginTop: 12}}>
                    <FlatList
                      data={compensatedMoneyArray}
                      renderItem={renderCompensatedMoney}
                      keyExtractor={item => item.vm_transaction_id}
                    />
                  </View>
                </SafeAreaView>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  cardData: {
    marginBottom: 10,
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },

  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor:'#4e31c1'
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
    color: '#4e31c1',
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
  totalText: {
    textAlign: 'left',
    // marginTop: hp('15%'),
    marginLeft: wp('4%'),
    color: '#4e31c1',
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
  nodata: {
    fontSize: wp('7%'),
    marginTop: hp('32%'),
    alignSelf: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },

  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#fff',
    color: '#4e31c1',
  },
  Dropdownlist: {
    width: wp('68%'),

    color: '#fff',
    fontSize: wp('2%'),
    height: wp('10%'),
    margin: wp('7%'),
    marginBottom: wp('-3%'),
    marginTop: wp('30%'),
    paddingVertical: hp('-8%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },

  inputStyle: {
    //backgroundColor: 'transparent',
    //color: 'transparent',
    fontSize: wp('5%'),
    borderRadius: 6,
    borderColor: '#F796A0',
    borderWidth: 2,
    margin: wp('10%'),
    paddingHorizontal: wp('2%'),
    color: '#000000',
    marginBottom: wp('-4%'),
    height: hp('4%'),
    width: wp('66%'),
    backgroundColor: 'transparent',
  },

  button1: {
    padding: wp('2%'),
    width: wp('60%'),
    height: hp('7%'),
    alignSelf: 'center',
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
    marginTop: hp('3%'),
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-1%'),
  },

  button2: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('14%'),
    alignSelf: 'center',
    //  marginRight:wp('9%'),
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

  btnText3: {
    color: '#C81717',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('-3%'),
  },
});

export default CompensatedMoneyOfDeletedCards;
