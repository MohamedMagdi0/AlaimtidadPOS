import React from 'react';
import {
  Button,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from 'react-native';
import i18n from 'i18next';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import axios from 'axios';
import API_URL from '../URL';
import Toast from 'react-native-simple-toast';
import {NumericFormat} from 'react-number-format';
import ViewShot from 'react-native-view-shot';
// import CameraRoll from '@react-native-community/cameraroll';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import {Table, Row, Rows} from 'react-native-table-component';
import {withTranslation} from 'react-i18next';

class AllAccountStatment extends React.Component {
  state = {
    information: null,
    TokenStatus: true,
    uri: '',
    posname: '',
    userName: '',
    tableData: [
      ['1', '2', '3', '4'],
      ['a', 'b', 'c', 'd'],
      ['1', '2', '3', '456\n789'],
      ['a', 'b', 'c', 'd'],
    ],
    tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
    debtAmount: '',
    debtLimit: '',
    currency: '',
    limitAllowed: '',
    totalPaidMoney: 0,
    drawnMoneyResponse: 0,
    fromDate:
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2),
    toDate:
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2),
    from: '',
    to: '',
    mode: 'date',
    modeTO: 'date',
    show: false,
    showTO: false,
  };

  async getDate() {
    let userId = 0;
    let userTypeId = 0;
    let userPhoneNumber = '';
    // let permission=''
    try {
      if (this.state.fromDate > this.state.toDate) {
        Toast.show('تاريخ "الي" يجب ان يكون بعد تاريخ "من"', Toast.LONG, {
          position: 660,
          backgroundColor: 'green',
          fontSize: 19,
          mask: true,
          color: 'white',
        });
      } else {
        let userId = await AsyncStorage.getItem('userIdInUsers');
        let userTypeId = await AsyncStorage.getItem('user_type_id');
        let ownerId = await AsyncStorage.getItem('userId');
        let userPhoneNumber = await AsyncStorage.getItem('user_phonenumber');
        let posname = await AsyncStorage.getItem('commercialName');
        this.setState({posname: posname});
        // get all data
        await axios
          .post(
            `${API_URL}user/account/1?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
            {
              from_date: this.state.fromDate,
              to_date: this.state.toDate,
              user_type_id: 3,
              userPhoneNumber: userPhoneNumber,
            },
            {
              headers: {
                'x-access-token': `${await AsyncStorage.getItem('Token')}`,
              },
            },
          )
          .then(res =>
            this.setState({responseResult: res.data.result, currency: 'IQD'}),
          )
          .catch(e => console.log(e));
      }
      console.log(this.state.responseResult);
    } catch (e) {
      console.log(e.message);
    }
  }

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your media files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
      } else {
        console.log('Permission denied!');
      }
    } catch (err) {
      console.warn(err);
    }

    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getDate();
    });
    this.getDate();
  }
  //////////////////////////////////////////////////////////
  async save() {
    try {
      this.refs.viewShot.capture().then(async uri => {
        CameraRoll.save(uri, 'photo')
          .then(() => {
            Toast.show('تم حفظها بالاستوديو', Toast.LONG, {
              position: 660,
              backgroundColor: 'green',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          })
          .catch(e => console.log('error in saving', e));
      });
    } catch (snapshotError) {
      console.error(snapshotError);
    }
  }

  showDatepicker = () => {
    this.setState({mode: 'date'});
  };

  showMode = currentMode => {
    this.setState({show: true});
    this.setState({mode: currentMode});
  };

  showModeTo = currentMode => {
    this.setState({showTO: true});
    this.setState({modeTO: currentMode});
  };

  showDatepickerTo = () => {
    this.setState({modeTO: 'date'});
  };

  onChange = (event, selectedDate) => {
    // console.log("SelectedDate",selectedDate);
    const currentDate = selectedDate;
    this.setState({show: Platform.OS === 'ios'});
    this.setState({from: selectedDate});
    this.setState({fromDate: selectedDate.toISOString().split('T')[0]});
  };

  onChangeTo = (event, selectedDate) => {
    //   console.log("selectedDateTo",selectedDate);
    const currentDate = selectedDate;
    this.setState({showTO: Platform.OS === 'ios'});
    this.setState({to: selectedDate});
    this.setState({toDate: selectedDate.toISOString().split('T')[0]});
  };

  render() {
    if (this.state.TokenStatus == false) {
      return (
        <View>
          <Text
            style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
            {i18n.t('You Have to login again')}
          </Text>
        </View>
      );
    } else if (this.state.responseResult == null) {
      return (
        <View>
          <ActivityIndicator color="#4e31c1" />
        </View>
      );
    } else {
      const tableData1 = [
        [
          'الأموال التي تدين بها',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletextLabelRedBold}>{value}</Text>
            )}
            value={this.state.responseResult.ownerDebtAmount}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
      ];
      const tableData2 = [
        [
          'رصيد التحويلات المستلم',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletextred}>{value}</Text>
            )}
            value={
              this.state.responseResult.transferedBalanceToUser[0]
                .total_transfered_to_user
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'رصيد التحويلات المستلمة من تحويل النظام',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletextred}>{value}</Text>
            )}
            value={
              this.state.responseResult.transferedBalanceToUser[0]
                .transferedBalanceToUserSystemTransfer
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'الارصدة المستلمة المطبوعة المعبأة',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletextred}>{value}</Text>
            )}
            value={
              this.state.responseResult.transferedPrintedBalanceToUser[0]
                .total_transfered_to_user
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
      ];

      const tableData3 = [
        [
          'الاموال المسددة',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tableTextGreen}>{value}</Text>
            )}
            value={this.state.responseResult.paidTotals[0].real_paid}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'الرصيد المسحوب',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tableTextGreen}>{value}</Text>
            )}
            value={this.state.responseResult.withdrawTotals[0].total_withdraw}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
              ];

      const tableData4 = [
        // ['اموال التحويلات المستلمة من تحويل النظام المسددة',  <NumericFormat
        // renderText={value => <Text  style={styles.tabletext} >{value}</Text>}
        // value={this.state.responseResult.paidAndUnpaidTotals.totalSystemTransferPaid} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} /> ],
        [
          'الرصيد المرسل',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={
              this.state.responseResult.transferedBalanceFromUser[0]
                .total_transfered_from_user
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'رصيد التحويلات التعويضية المستلمة المسددة',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={
              this.state.responseResult.transferedBalanceToUser[0]
                .compensateBalanceToUser
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'رصيد تعويض الكارتات الملغاة',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={
              this.state.responseResult.transferedBalanceToUser[0]
                .cancelledCompensateBalanceToUser
            }
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],

        [
          'عدد الكارتات المباعة',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={this.state.responseResult.salesData[0].number_sales}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'اموال الكارتات المباعة',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={this.state.responseResult.salesData[0].total_Sales}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
        [
          'الربح',
          <NumericFormat
            renderText={value => <Text style={styles.tabletext}>{value}</Text>}
            value={this.state.responseResult.salesData[0].posProfit}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
      ];

      const tableData5 = [
       
        [
          'عدد عمليات التعبئة الالكترونية',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletext}>{value}</Text>
            )}
            value={this.state.responseResult.simCardSales[0].number_sales}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ], [
          'اجمالى اموال عمليات التعبئة الالكترونية ',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletext}>{value}</Text>
            )}
            value={this.state.responseResult.simCardSales[0].total_Sales}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],


        [
          'اجمالى مبيعات الكارتات الشركات المؤرشفة',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletext}>{value}</Text>
            )}
            value={this.state.responseResult.archivedTransactions?.company_cards_sales ?
              this.state.responseResult.archivedTransactions?.company_cards_sales : 0}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ], [
          'اجمالى مبيعات التعبئة الالكترونية المؤرشفة',
          <NumericFormat
            renderText={value => (
              <Text style={styles.tabletext}>{value}</Text>
            )}
            value={this.state.responseResult.archivedTransactions?.sim_cards_sales  ?
            this.state.responseResult.archivedTransactions?.sim_cards_sales : 0}
            displayType={'text'}
            thousandSeparator={true}
            fixedDecimalScale={true}
            decimalScale={0}
          />,
        ],
      ];

      return (
        <>
          <View style={styles.containerBig}>
            <ScrollView>
              <ViewShot ref="viewShot" options={{format: 'png', quality: 0.9}}>
                <ImageBackground
                  source={require('../../../assets/upper.png')}
                  style={{
                    height: '100%',
                    width: '100%',
                    alignself: 'center',
                    flex: 1,
                  }}>
                  <View style={{marginTop: hp('1%')}}>
                    <Text style={styles.POS3}>
                      {' '}
                      {this.state.responseResult.user.usersIds[0].userName}
                    </Text>

                    <Text style={styles.POS11}>اجمالي الرصيد الحالي</Text>
                    <Text style={styles.POSyellow}>
                      {this.state.currency}
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.POSyellow}> {value}</Text>
                        )}
                        value={this.state.responseResult.user.totalBalance}
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
                    <View style={{backgroundColor: '#fff'}}>
                      <Text style={styles.poscenter}>
                        الرصيد الحالي الذي تدين به
                      </Text>
                      <Text style={styles.poscenteryellow}>
                        {this.state.currency}
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.poscenteryellow}> {value}</Text>
                          )}
                          value={
                            this.state.responseResult.user.current_debt_amount
                          }
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>

                      <Text style={styles.poscenter}>الرصيد الافتتاحي</Text>
                      <Text style={styles.poscenteryellow}>
                        {this.state.currency}
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.poscenteryellow}> {value}</Text>
                          )}
                          value={this.state.responseResult.user.opening_balance}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                      <Text style={styles.Title}>كشف حساب اجمالي</Text>
                    </View>

                    <View style={styles.fixToText}>
                      <Button
                        onPress={this.showMode}
                        title={i18n.t('ChooseDate')}
                        color="#4e31c1"
                      />

                      <Button
                        onPress={this.showModeTo}
                        title={i18n.t('ChooseDate')}
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
                        {this.state.fromDate}
                      </Text>
                      <Text
                        style={{
                          color: '#4e31c1',
                          fontSize: 20,
                          marginTop: hp('1%'),
                          fontFamily: 'Cairo-SemiBold',
                        }}>
                        {this.state.toDate}
                      </Text>
                    </View>

                    {this.state.show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={this.state.mode}
                        is24Hour={false}
                        display="default"
                        onChange={this.onChange}
                      />
                    )}

                    {this.state.showTO && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={this.state.mode}
                        is24Hour={false}
                        display="default"
                        onChange={this.onChangeTo}
                      />
                    )}

                    <TouchableOpacity
                      style={styles.button2}
                      onPress={() => this.getDate()}>
                      <Text style={styles.btnText2}>{i18n.t('Search')}</Text>
                    </TouchableOpacity>

                    <View style={styles.tableOnecontainer}>
                      <Table
                        borderStyle={{borderWidth: 1, borderColor: '#8a53e5'}}>
                        {/* <Row data={this.state.tableHead} style={styles.head} textStyle={styles.tabletext}/>  */}
                        <Rows
                          data={tableData1}
                          flexArr={[1, 1]}
                          textStyle={styles.tabletextLabelRedBold}
                        />
                      </Table>
                    </View>

                    <View style={styles.tableTwocontainer}>
                      <Table
                        borderStyle={{borderWidth: 1, borderColor: '#8a53e5'}}>
                        {/* <Row data={this.state.tableHead} style={styles.head} textStyle={styles.tabletext}/> */}
                        <Rows
                          data={tableData2}
                          flexArr={[1, 1]}
                          textStyle={styles.tabletextred}
                        />
                      </Table>
                    </View>

                    <View style={styles.tableTwocontainer}>
                      <Table
                        borderStyle={{borderWidth: 1, borderColor: '#8a53e5'}}>
                        {/* <Row data={this.state.tableHead} style={styles.head} textStyle={styles.tabletext}/> */}
                        <Rows
                          data={tableData3}
                          flexArr={[1, 1]}
                          textStyle={styles.tableTextGreen}
                        />
                      </Table>
                    </View>

                    <View style={styles.tableFourcontainer}>
                      <Table
                        borderStyle={{borderWidth: 1, borderColor: '#8a53e5'}}>
                        {/* <Row data={this.state.tableHead} style={styles.head} textStyle={styles.tabletext}/> */}
                        <Rows
                          data={tableData4}
                          flexArr={[1, 1]}
                          textStyle={styles.tabletext}
                        />
                      </Table>
                    </View>
                    <View style={styles.tableFourcontainer}>
                      <Table
                        borderStyle={{borderWidth: 1, borderColor: '#8a53e5'}}>
                        {/* <Row data={this.state.tableHead} style={styles.head} textStyle={styles.tabletext}/> */}
                        <Rows
                          data={tableData5}
                          flexArr={[1, 1]}
                          textStyle={styles.tabletext}
                        />
                      </Table>
                    </View>

                    <TouchableOpacity
                      style={styles.button2}
                      onPress={() => this.save()}>
                      <Text style={styles.btnText2}> حفظ في الاستوديو</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ViewShot>
            </ScrollView>
          </View>
        </>
      );
    }
  }
}
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
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    fontSize: 21,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },
  POSyellow: {
    textAlign: 'left',
    marginLeft: wp('4%'),
    color: '#ffd775',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    marginBottom: hp('5%'),
    fontSize: 24,
  },

  POS11: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: wp('4%'),
    textAlign: 'left',
  },
  poscenteryellow: {
    fontFamily: 'Cairo-SemiBold',
    color: '#4EC447',
    fontSize: 25,
    textAlign: 'center',
  },
  poscenter: {
    fontFamily: 'Cairo-SemiBold',
    color: '#000',
    fontSize: 25,
    textAlign: 'center',
  },
  tinyLogo: {
    top: hp('5%'),
    height: hp('30%'),
    width: wp('60%'),
    marginLeft: wp('2%'),
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
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    marginRight: wp('2%'),
    marginTop: hp('10%'),
    width: wp('95%'),
    marginLeft: wp('2%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: hp('20%'),
  },

  Title: {
    marginTop: hp('1%'),
    color: '#4e31c1',
    marginRight: wp('4%'),
    fontSize: wp('9'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  allCredit: {
    marginTop: hp('1%'),
    color: '#4e31c1',
    //  marginRight:wp('10%'),
    //  marginLeft: wp('10%'),
    fontSize: wp('6'),
    alignSelf: 'center',

    fontFamily: 'Cairo-SemiBold',
    backgroundColor: '#fff',
  },
  Title05: {
    top: hp('-4%'),
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
  },
  tabletextred: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#f00',
  },
  boldRedText: {
    margin: 6,
    fontSize: wp('6'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#f00',
    fontWeight: 'bold',
  },
  tableTextGreen: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#4EC447',
  },

  tabletext: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
  },
  tabletextLabelRed: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#ff0000',
  },
  tabletextLabelRedBold: {
    margin: 6,
    fontSize: wp('7'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#ff0000',
    fontWeight: 'bold',
  },
  tablecontainer: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  tableOnecontainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  tableTwocontainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  tableFourcontainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  Title0: {
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  Title01: {
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  Title1: {
    top: hp('3%'),
    color: '#008000',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },

  Title5: {
    top: hp('1%'),
    color: '#ff0000',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  Title2: {
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },

  Title3: {
    top: hp('1%'),
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },

  Title6: {
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    fontFamily: 'Cairo-SemiBold',
  },

  button1: {
    marginTop: wp('36%'),
    backgroundColor: 'transparent',
    padding: wp('2%'),
    borderRadius: 50,
    width: wp('60%'),
    marginLeft: wp('-3%'),
    marginBottom: wp('5%'),
    borderRadius: 50,
    borderWidth: wp('0.5%'),
    borderColor: '#FFF',
    borderBottomWidth: wp('2%'),
  },
});

export default withTranslation()(AllAccountStatment);
