import * as React from 'react';
import {
  Button,
  View,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import i18n from 'i18n-js';
import {NumericFormat} from 'react-number-format';
import API_URL from '../URL';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

const DailyMovementPOS = ({navigation}) => {
  const {t} = useTranslation();
  const [SoldCards, setSoldCards] = React.useState([]);
  const [virtualTransactions, setvirtualTransactions] = React.useState([]);
  const [VMToPos, setVMToPos] = React.useState([]);
  const [simCards, setsimCards] = React.useState([]);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [token, settoken] = React.useState('');
  const [userfName, setuserName] = React.useState('');
  const [userMName, setuserMName] = React.useState('');
  const [userLName, setuserLName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');

  const copyToClipboard1 = (
    pin,
    pos,
    company,
    category,
    serial,
    sellprice,
    expiredate,
    selldate,
  ) => {
    Toast.show('الذهاب الى الطابعة', {
      containerStyle: {backgroundColor: 'white'},
      textStyle: {fontSize: 20, color: 'black'},
    });
    //  Linking.sendIntent()

    Linking.openURL(
      `printerpos://?pin=${pin}&pos=${pos}&company=${company}&category=${category}&serial=${serial}&sellprice=${sellprice}&expiredate=${expiredate}&selldate=${selldate}&status='Copy Copy طباعة نسخة اضافية'`,
    )
      .then(data => {
        console.log('printer Opened');
      })
      .catch(() => {
        alert('يرجى تحميل تطبيق الطباعة');
      });
  };

  async function getDate() {
    console.log(
      'get data',
      parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
    );
    try {
      const response = await axios.post(
        API_URL +
          `dailyreport?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
          userTypeId: 3,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      console.log('responsemessage.SoldCards', response.data.message);
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
      } else {
        setTokenStatus(true);
        console.log('res ======', response.data);
        if (response.data.message.SoldCards === 0) {
          setSoldCards([
            {
              transaction_id: 'NoTransaction',
            },
          ]);
        } else {
          setSoldCards(response.data.message.SoldCards);
        }
        if (response.data.message.virtualTransactions === 0) {
          setvirtualTransactions([
            {
              transaction_id: 'NoTransaction',
            },
          ]);
        } else {
          setvirtualTransactions(response.data.message.virtualTransactions);
        }

        if (response.data.message.VMToPos === 0) {
          setVMToPos([
            {
              transaction_id: 'NoTransaction',
            },
          ]);
        } else {
          console.log('Feha');
          setVMToPos(response.data.message.VMToPos);
        }

        // if(response.data.message.simCards === 0)
        // {
        //   setsimCards([
        //     {
        //         "transaction_id": "NoTransaction",

        //     }
        // ])
        // }
        // else
        // {
        //   setsimCards(response.data.message.simCards)
        // }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function getuserDate() {
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
      } else {
        setTokenStatus(true);
        console.log('response', response.data.message);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    console.log('hiiii da');
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From PosBuyCreditCard ');
        getDate();
        getuserDate();
      });

      getDate();
      getuserDate();
    })();
  }, []);

  const renderCompanies = ({item}) => {
    return (
      <Card containerStyle={styles.cardCnt} key={item.transaction_id}>
        <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
          <Card.Title
            style={{color: '#4e31c1', fontSize: wp('5%'), marginTop: hp('2%')}}>
            {t('dailymovement2SoldCArts')}
          </Card.Title>
        </View>

        <Card.Divider />

        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('transaction_id')}: {item.transaction_id}
        </Text>
        <Card.Divider />
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('creation_date')}: {item.creation_date}
        </Text>
        <Card.Divider />
        {/* <View style={{backgroundColor:'#4e31c1',marginTop:hp('-2%'),height:hp('4%')}}>
                              <TouchableOpacity onPress={() => copyToClipboard(item['pin'])}>
                              <Text style={{marginBottom: 10, fontSize:wp('6%'), color:'#ff5349',alignItems:'flex-start',alignSelf:'flex-start'}}>
                              {item.pin_number} :PIN
                              </Text>
                              </TouchableOpacity>
                              </View>
                              <Card.Divider/> */}
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
          }}>
          {item.company_cards_serial} :{t('company_cards_serial')}
        </Text>
        <Card.Divider />

        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('Companyname')}: {item.company_name}{' '}
        </Text>
        <Card.Divider />

        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('Category')}: {item.category_text}{' '}
        </Text>
        <Card.Divider />

        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('cards_pos_sell_price')}:{' '}
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
            value={item.cards_pos_sell_price}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />{' '}
          دينار
        </Text>
        <Card.Divider />
        {/* <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                              {t('admin_sell_price')}: <NumericFormat
renderText={value => <Text  style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}} >{value}</Text>} 
value=  {item.admin_sell_price}    displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} /> 
                              </Text> */}
        {/* <Card.Divider/> */}
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('cards_pos_profit')}:{' '}
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
            value={item.cards_pos_profit}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />{' '}
          دينار
        </Text>
      </Card>
    );
  };
  const renderVM = ({item}) => {
    return (
      <Card containerStyle={styles.cardCnt} key={item.vm_transaction_id}>
        <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
          <Card.Title
            style={{color: '#4e31c1', fontSize: wp('5%'), marginTop: hp('2%')}}>
            لقد حصلت رصيد
          </Card.Title>
        </View>

        <Card.Divider />

        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('transaction_id')}: {item.vm_transaction_id}
        </Text>
        <Card.Divider />
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('creation_date')}: {item.virtual_mony_transaction_data_time}
        </Text>
        <Card.Divider />
        {/* <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                {t('virtual_mony_transaction_value')}: {item.virtual_mony_transaction_value} 
                                </Text> 
                                <Card.Divider/> */}
        {/* <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%'),alignItems:'flex-start',alignSelf:'flex-start'}}>
                                {item.virtual_mony_transaction_serial_number} :{t('company_cards_serial')}
                                </Text>
                                <Card.Divider/> */}
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('virtual_mony_transaction_from_id')}: {item.user_name}
        </Text>
        <Card.Divider />
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('FromuserPhoneNumber')}: {item.user_name}
        </Text>
        {/* <Card.Divider/>
                                <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                {t('card_status')}: {item.card_status} 
                                </Text> */}
        <Card.Divider />
        <Text
          style={{
            marginBottom: 10,
            color: '#4e31c1',
            fontFamily: 'Cairo-SemiBold',
            fontSize: wp('5%'),
          }}>
          {t('virtual_money_transaction_transfer_amount')}:{' '}
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
            value={item.vm_balance}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />
        </Text>
      </Card>
    );
  };
  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#1c79f2', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else if (
    SoldCards.length == 0 ||
    virtualTransactions.length == 0 ||
    VMToPos.length == 0
  ) {
    console.log('else In Render');
    return <DotIndicator color="#4e31c1" />;
  } else {
    console.log('VMToPos In Render', VMToPos);
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
              <View style={{backgroundColor: '#fff'}}>
                <Text
                  style={{
                    fontSize: wp('7%'),
                    textAlign: 'center',
                    marginTop: hp('2.5%'),
                    color: '#4e31c1',
                    fontFamily: 'Cairo-SemiBold',
                    marginBottom: hp('0.8%'),
                  }}>
                  {t('SoldCArts')}
                </Text>

                {SoldCards[0].transaction_id == 'NoTransaction' ? (
                  <Text
                    style={{
                      fontSize: wp('8%'),
                      textAlign: 'center',
                      marginTop: hp('2%'),
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      marginBottom: hp('2%'),
                    }}>
                    {t('nosoldCards')}
                  </Text>
                ) : (
                  <FlatList
                    data={SoldCards}
                    renderItem={renderCompanies}
                    keyExtractor={item => item.transaction_id}
                  />
                )}

                {/* ****************************virtualTransactions***************************************/}
                <Text
                  style={{
                    fontSize: wp('7%'),
                    textAlign: 'center',
                    marginTop: hp('2%'),
                    color: '#4e31c1',
                    fontFamily: 'Cairo-SemiBold',
                    marginBottom: hp('2%'),
                  }}>
                  {t('virtualTransactions')}
                </Text>

                {virtualTransactions[0].transaction_id == 'NoTransaction' ? (
                  <Text
                    style={{
                      fontSize: wp('8%'),
                      textAlign: 'center',
                      marginTop: hp('2%'),
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      marginBottom: hp('2%'),
                    }}>
                    {t('novirtualTransactions')}
                  </Text>
                ) : (
                  virtualTransactions.map((item, index) => (
                    <Card
                      containerStyle={styles.cardCnt}
                      key={item.vm_transaction_id}>
                      <View
                        style={{backgroundColor: '#fff', marginTop: hp('-2%')}}
                        key={item.vm_transaction_id}>
                        <Card.Title
                          style={{
                            color: '#4e31c1',
                            fontSize: wp('5%'),
                            marginTop: hp('2%'),
                          }}>
                          لقد ارسلت رصيد
                        </Card.Title>
                      </View>

                      <Card.Divider />

                      <Text
                        style={{
                          marginBottom: 10,
                          color: '#4e31c1',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: wp('5%'),
                        }}>
                        {t('transaction_id')}: {item.vm_transaction_id}
                      </Text>
                      <Card.Divider />
                      <Text
                        style={{
                          marginBottom: 10,
                          color: '#4e31c1',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: wp('5%'),
                        }}>
                        {t('creation_date')}:{' '}
                        {item.virtual_mony_transaction_data_time}
                      </Text>
                      <Card.Divider />
                      {/* <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('virtual_mony_transaction_value')}: <NumericFormat
        renderText={value => <Text  style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}} >{value}</Text>} 
        value= {item.vm_balance}     displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} /> 
                                         </Text>
                                         <Card.Divider/> */}
                      <Text
                        style={{
                          marginBottom: 10,
                          color: '#4e31c1',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: wp('5%'),
                        }}>
                        {t('virtual_mony_transaction_to_id')}: {item.user_name}
                      </Text>
                      <Card.Divider />
                      <Text
                        style={{
                          marginBottom: 10,
                          color: '#4e31c1',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: wp('5%'),
                        }}>
                        {t('TOuserPhoneNumber')}: {item.user_phone}
                      </Text>
                      {/* <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%'),alignItems:'flex-start',alignSelf:'flex-start'}}>
                                         {item.virtual_mony_transaction_serial_number} :{t('company_cards_serial')}
                                         </Text> */}

                      {/* <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('card_status')}: {item.card_status} 
                                         </Text> */}
                      <Card.Divider />
                      <Text
                        style={{
                          marginBottom: 10,
                          color: '#4e31c1',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: wp('5%'),
                        }}>
                        {t('virtual_money_transaction_transfer_amount')}:{' '}
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
                          value={item.vm_balance}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                    </Card>
                  ))
                )}

                {/* *************************VMToPos******************************************** */}

                <Text
                  style={{
                    fontSize: wp('7'),
                    textAlign: 'center',
                    marginTop: hp('2%'),
                    color: '#4e31c1',
                    fontFamily: 'Cairo-SemiBold',
                    marginBottom: hp('2%'),
                  }}>
                  {t('VMToPos')}
                </Text>

                {VMToPos[0].transaction_id == 'NoTransaction' ? (
                  <Text
                    style={{
                      fontSize: wp('8%'),
                      textAlign: 'center',
                      marginTop: hp('2%'),
                      color: '#4e31c1',
                      fontFamily: 'Cairo-SemiBold',
                      marginBottom: hp('2%'),
                    }}>
                    {t('noVMToPos')}
                  </Text>
                ) : (
                  <FlatList
                    data={VMToPos}
                    renderItem={renderVM}
                    keyExtractor={item => item.vm_transaction_id}
                  />
                )}
                {/* *************************simCards******************************************** */}

                {/* 
              <Text style={{ fontSize: wp('7%'),textAlign: 'center', color:"#032858",fontFamily:'Cairo-SemiBold',marginBottom:hp('1%')}}>{("simcards")}</Text>


{(simCards[0].transaction_id=="NoTransaction")?  <Text style={{ 
    fontSize: wp('8%'),
    textAlign: 'center',
    marginTop: hp('2%'), 
    color:"#000",
    fontFamily:'Cairo-SemiBold',
    marginBottom:hp('2%')}}>{("nosimCards")}</Text> :
    simCards.map((item, index) => (
                 <Card containerStyle={styles.cardCnt} 
                 key = {item.sim_card_transaction_id}
                 >
                   
                 <View style={{backgroundColor:'#fff',marginTop:hp('-2%')}}> 
                         <Card.Title style={{color:'#4e31c1' ,fontSize: wp('5%'),marginTop:hp('2%')}}>{t('dailymovement2simcards')}</Card.Title>
                         </View>
                   
                                 <Card.Divider/>
     
                               
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('transaction_id')} : {item.sim_card_transaction_id} 
                                         </Text>
                                         <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('creation_date')} : {item.sim_card_transaction_datetime} 
                                         </Text>
                                         <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('sim_number')} : {item.sim_number} 
                                         </Text>
                                         <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('sim_to_number')} : {item.sim_to_number} 
                                         </Text>
                                         <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('pos_id')} : {item.pos_id} 
                                         </Text>
                                         <Card.Divider/>
                                         <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo-SemiBold', fontSize:wp('5%')}}>
                                         {t('virtual_mony_transaction_to_id')} : {item.virtual_mony_transaction_to_id} 
                                         
                                         </Text>
                                      
                                       
                     </Card>
                
             ))} */}
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
  nodata: {
    fontSize: wp('12%'),
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
    marginTop: wp('5%'),
    backgroundColor: 'transparent',
    padding: wp('2%'),
    borderRadius: 50,
    width: wp('35%'),
    height: hp('5%'),
    marginLeft: wp('-3%'),
    //   marginBottom:wp('5%'),
    borderRadius: 50,
    borderWidth: wp('0.5%'),
    borderColor: '#C81717',
    //borderBottomEndRadius:wp('30%'),
    borderBottomWidth: wp('2%'),
  },
  btnText2: {
    color: '#C81717',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('-3%'),
  },

  button2: {
    marginTop: wp('5%'),
    backgroundColor: 'transparent',
    padding: wp('2%'),
    borderRadius: 50,
    width: wp('60%'),
    height: hp('5%'),
    marginLeft: wp('-3%'),
    //   marginBottom:wp('5%'),
    borderRadius: 50,
    borderWidth: wp('0.5%'),
    borderColor: '#C81717',
    //borderBottomEndRadius:wp('30%'),
    borderBottomWidth: wp('2%'),
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

export default DailyMovementPOS;
