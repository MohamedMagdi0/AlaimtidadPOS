import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSidebarMenu from './CustomSidebarMenu';
// import i18n from '../screens/i18n';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from './URL';
/////////////////////////////////////////////////
// Screens
// -------
import Pos_homepage from './Pos_homepage';
import whoWeEmtdad from './whoWeEmtdad';
import FirstPage from './FirstPage';
import POSCreditTransefere from './POSCreditTransefere';
import PosBuyCreditCart from './PosBuyCreditCart';
import POS_Fill_the_machine from './POS_Fill_the_machine';
import NewPassword from './NewPassword';
import LoginEmtdad from './LoginEmtdad';
import FirstPageReport from './FirstPageReport';
import SecondPage from './SecondPage';
import ConnectionType from './ConnectionType';
import Aboutme from './Aboutme';
import Logout from './Logout';
import Registration from './Registration';
import ConfirmIdentity from './ConfirmIdentity';
import VerificationCode from './VerificationCode';
import NotificationScreen from './NotificationScreen';
/////////////////////////////////////////////////
// Icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

//////////////////////////////////////////////////////////////
// Reports
//--------
import SIMCardReport from './ReportsPOS/SimCardReport';
import AllAccountStatment from './ReportsPOS/AllAccountStatment';
import Dailymovementhomepage from './ReportsPOS/dailymovementhomepage';
import TakenMoney from './ReportsPOS/TakenMoney';
import SendedMoney from './ReportsPOS/SendedMoney';
import DailyMovementPOS from './ReportsPOS/DailyMovementPOS';
import ReportPOS from './ReportPOS';
import SimCards from './ReportsPOS/SimCards';
import SimCardsPayCards from './SimCardsPayCards';
import AccountStatmentPOS from './ReportsPOS/AccountStatmentPOS';
import WinAccountPOS from './ReportsPOS/WinAccountPOS';
import DiscountPoints from './ReportsPOS/DiscountPoints';
import SoldPOS from './ReportsPOS/SoldPOS';
import DrawnMoney from './ReportsPOS/DrawnMoney';
import PaidMoney from './ReportsPOS/PaidMoney';
import CompensatedMoney from './ReportsPOS/CompensatedMoney';
import SystemTransferMoney from './ReportsPOS/SystemTransferMoney';
import PrintedMoney from './ReportsPOS/PrintedMoney';
import CompensatedMoneyOfDeletedCards from './ReportsPOS/CompensatedMoneyOfDeletedCards';
import ReprintReciept from './ReportsPOS/ReprintReciept';
import DebtAmountPOS from './ReportsPOS/debtAmountPOS';
//////////////////////////////////////////////////////////////
import TestPrinter from './TestPrinter';
import CompanyClassification from './CompanyClassification';
import CompanyCategories from './CompanyCategories';
import {useTranslation} from 'react-i18next';
import SimCompanyCategories from './SimCompanyCategories';
import SimCompanyClassification from './SimCompanyClassification';
import CompanyDataModal from '../Components/CompanyDataModal';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = props => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <TouchableOpacity onPress={toggleDrawer}>
      {/*Donute Button Image */}
      <View>
        <Feather name="menu" size={27} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

function LogoutStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const MainView = () => {
    if (website.info == null) {
      console.log('if', website.info);
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#4e31c1" />
        </View>
      );
    } else {
      return (
        <>
          <Stack.Navigator
            initialRouteName="Logout"
            screenOptions={{
              headerTitleAlign: 'center',
              headerLeft: () => <CompanyDataModal />,
              headerRight: () => (
                <NavigationDrawerStructure navigationProps={navigation} />
              ),
              headerStyle: {
                backgroundColor: '#4e31c1', //Set Header color
              },
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'bold', //Set Header text style
              },
            }}>
            <Stack.Screen
              name="Logout"
              component={Logout}
              options={{
                headerTintColor: 'white',
                title: 'تسجيل خروج',
                headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
              }}
            />

            <Stack.Screen
              name="Login"
              component={LoginEmtdad}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="test"
              component={Test}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="ConfirmIdentity"
              component={ConfirmIdentity}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VerificationCode"
              component={VerificationCode}
              options={{
                headerTitleStyle: {alignSelf: 'center'},
                headerTitle: () => (
                  <>
                    <View style={{paddingLeft: wp('13%'), alignSelf: 'center'}}>
                      <Image
                        source={require('../../assets/lastlogo.png')}
                        style={{justifyContent: 'center'}}
                      />
                    </View>
                  </>
                ),
              }}
            />

            <Stack.Screen
              name="SaleCarts"
              component={FirstPage}
              options={{
                headerTintColor: 'white',
                title: 'بيع الكارتات',
                headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
              }}
            />
            <Stack.Screen
              name="Pos_homepage"
              component={Pos_homepage}
              options={{
                headerTintColor: 'white',
                title: 'الصفحة الرئيسية',
                headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
              }}
            />
          </Stack.Navigator>
        </>
      );
    }
  };

  return MainView();
}

function ReprintRecieptStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="ReprintReciept"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="Aboutme"
            component={ReprintReciept}
            options={{
              headerTintColor: 'white',
              title: 'مبيعات اليوم',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function SIMCardStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="SIMCard"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="SIMCard"
            component={SIMCardReport}
            options={{
              headerTintColor: 'white',
              title: 'التعيئة اليومية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function AboutMeStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="Aboutme"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="Aboutme"
            component={Aboutme}
            options={{
              headerTintColor: 'white',
              title: 'حسابى',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function NewPasswordStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="NewPassword"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="NewPassword"
            component={NewPassword}
            options={{
              headerTintColor: 'white',
              title: 'كلمة السر',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginEmtdad}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="test"
            component={Test}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ConfirmIdentity"
            component={ConfirmIdentity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VerificationCode"
            component={VerificationCode}
            options={{
              headerTitleStyle: {alignSelf: 'center'},
              headerTitle: () => (
                <>
                  <View style={{paddingLeft: wp('13%'), alignSelf: 'center'}}>
                    <Image
                      source={require('../../assets/lastlogo.png')}
                      style={{justifyContent: 'center'}}
                    />
                  </View>
                </>
              ),
            }}
          />

          <Stack.Screen
            name="SaleCarts"
            component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="Pos_homepage"
            component={Pos_homepage}
            options={{
              headerTintColor: 'white',
              title: 'الصفحة الرئيسية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function WhoWeEmtdadstack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="whoWeEmtdad"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="whoWeEmtdad"
            component={whoWeEmtdad}
            options={{
              headerTintColor: 'white',
              title: 'من نحن',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function ChangeAndTestPrinter({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="TestPrinter"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="TestPrinter"
            component={TestPrinter}
            options={{
              headerTintColor: 'white',
              title: 'اختبار الطباعة',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function NotificationStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="Notification"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="TestPrinter"
            component={NotificationScreen}
            options={{
              headerTintColor: 'white',
              title: 'الاشعارات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function ConnectionTypeStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="ConnectionType"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="ConnectionType"
            component={ConnectionType}
            options={{
              headerTintColor: 'white',
              title: 'نوع الاتصال',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function ReportScreenStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="Reports"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="Report"
            component={ReportPOS}
            options={{
              headerTintColor: 'white',
              title: 'التقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCompanyClassification"
            component={SimCompanyClassification}
            // component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SoldPOS"
            component={FirstPageReportStack}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SimCards"
            component={SimCards}
            options={{
              headerTitleStyle: {alignSelf: 'center'},
              headerTitle: (
                <>
                  <View style={{paddingLeft: wp('13%'), alignSelf: 'center'}}>
                    <Image
                      source={require('../../assets/lastlogo.png')}
                      style={{justifyContent: 'center'}}
                    />
                  </View>
                </>
              ),
            }}
          />
          <Stack.Screen
            name="AccountStatmentPOS"
            component={AccountStatmentPOS}
            options={{
              headerTintColor: 'white',
              title: 'كشف حساب',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="AllAccountStatment"
            component={AllAccountStatment}
            options={{
              headerTintColor: 'white',
              title: 'كشف حساب',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="SendedMoney"
            component={SendedMoney}
            options={{
              headerTintColor: 'white',
              title: 'الرصيد المرسل',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="TakenMoney"
            component={TakenMoney}
            options={{
              headerTintColor: 'white',
              title: 'رصيد التحويلات المستلم',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="WinAccountPOS"
            component={WinAccountPOS}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="DailyMovementPOS"
            component={DailyMovementPOS}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="DiscountPoints"
            component={DiscountPoints}
            options={{
              headerTitleStyle: {alignSelf: 'center'},
              // headerTitle: () => (
              //   <>
              //     <View style={{ paddingLeft: wp('13%'), alignSelf: 'center' }}>
              //       <Image
              //         source={require('../../assets/lastlogo.png')}
              //         style={{ justifyContent: 'center' }}
              //       />
              //     </View>
              //   </>
              // ),
            }}
          />
          <Stack.Screen
            name="SaleCarts"
            component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SIM"
            component={SecondPage}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCardsPayCards"
            component={SimCardsPayCards}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function POS_Fill_the_machineStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="POS_Fill_the_machine"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="POS_Fill_the_machine"
            component={POS_Fill_the_machine}
            options={{
              headerTintColor: 'white',
              title: 'تعبئة الجهاز',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="Pos_homepage"
            component={Pos_homepage}
            options={{
              headerTintColor: 'white',
              title: 'الصفحة الرئيسية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function POSCreditTransefereStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (website.info == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="SendCredit"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="SendCredit"
            component={POSCreditTransefere}
            options={{
              headerTintColor: 'white',
              title: 'تحويل رصيد',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="Pos_homepage"
            component={Pos_homepage}
            options={{
              headerTintColor: 'white',
              title: 'الصفحة الرئيسية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function FirstPageReportStack({navigation, route}) {
  // console.log("route++++++++++", route);
  const calssificationId = route?.params?.calssificationId;
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="FirstPageReport"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="FirstPageReport"
            initialParams={{calssificationId}}
            component={FirstPageReport}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCompanyClassification"
            component={SimCompanyClassification}
            // component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="SoldPOS"
            component={SoldPOS}
            options={{
              headerTintColor: 'white',
              title: 'تقارير',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function FirstScreenStack({navigation}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({
    info: null,
  });
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  if (website.info == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        <Stack.Navigator
          initialRouteName="CompanyClassification"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="CompanyClassification"
            component={CompanyClassification}
            // component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="SaleCarts"
            component={FirstPage}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SIM"
            component={SecondPage}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCardsPayCards"
            component={SimCardsPayCards}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="PosBuyCreditCart"
            component={PosBuyCreditCart}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginEmtdad}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SoldPOS"
            component={FirstPageReportStack}
            options={{
              headerTintColor: 'white',
              title: 'الكارتات المباعة',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

function Pos_homepageStack({navigation, route}) {
  const [commercialName, setcommercialName] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [website, setWebsite] = React.useState({info: null});
  React.useEffect(() => {
    (async () => {
      let pos_commercial_name = '';
      let virtualMoneyBalance = '';
      try {
        pos_commercial_name = await AsyncStorage.getItem('commercialName');
        virtualMoneyBalance = await AsyncStorage.getItem('virtualMoneyBalance');
        const response = await axios.get(
          API_URL +
            `alaimtidad?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log({response});
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again');
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          setcommercialName(pos_commercial_name);
          setMoney(virtualMoneyBalance);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  console.log({website});
  if (website.info == null) {
    console.log('iffffffff', website.info);
    return (
      <View style={styles.container}>
        {/* <Text>hiiiiii</Text> */}
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    return (
      <>
        {/* <Text>magzziiiiiiiiiiiiii</Text> */}
        <Stack.Navigator
          name="Test"
          initialRouteName="Pos_homepage"
          screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: () => <CompanyDataModal />,
            headerRight: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#4e31c1', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="Pos_homepage"
            component={Pos_homepage}
            initialParams={route.params}
            options={{
              title: 'الصفحة الرئيسية',
              headerTintColor: 'white',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          {/* </Stack.Navigator> */}

          <Stack.Screen
            name="SaleCarts"
            component={FirstPage}
            options={{
              title: 'بيع الكارتات',
              headerTintColor: '#fff',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SIM"
            component={SecondPage}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCardsPayCards"
            component={SimCardsPayCards}
            options={{
              headerTintColor: 'white',
              title: 'التعبئة الالكترونية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />

          <Stack.Screen
            name="dailymovementhomepage"
            component={Dailymovementhomepage}
            options={{
              headerTintColor: 'white',
              title: 'الحركة اليومية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="CompanyClassification"
            component={CompanyClassification}
            options={{
              headerTintColor: 'white',
              title: 'تصنيف الشركات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="CompanyCategories"
            component={CompanyCategories}
            options={{
              headerTintColor: 'white',
              title: 'فئات الشركات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SimCompanyCategories"
            component={SimCompanyCategories}
            options={{
              headerTintColor: 'white',
              title: 'فئات الشركات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="AllAccountStatment"
            component={AllAccountStatment}
            options={{
              headerTintColor: 'white',
              title: 'كشف حساب',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SendCredit"
            component={POSCreditTransefere}
            options={{
              headerTintColor: 'white',
              title: 'تحويل رصيد',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="POS_Fill_the_machine"
            component={POS_Fill_the_machine}
            options={{
              headerTintColor: 'white',
              title: 'تعبئة الجهاز',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="NewPassword"
            component={NewPassword}
            options={{
              headerTintColor: 'white',
              title: 'كلمة السر',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="TakenMoney"
            component={TakenMoney}
            options={{
              headerTintColor: 'white',
              title: 'رصيد التحويلات المستلم',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SendedMoney"
            component={SendedMoney}
            options={{
              headerTintColor: 'white',
              title: 'الرصيد المرسل',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="DailyMovementPOS"
            component={DailyMovementPOS}
            options={{
              headerTintColor: 'white',
              title: 'الحركة اليومية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="DrawnMoney"
            component={DrawnMoney}
            options={{
              headerTintColor: 'white',
              title: 'الرصيد المسحوب',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="PaidMoney"
            component={PaidMoney}
            options={{
              headerTintColor: 'white',
              title: 'الاموال المسددة',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="CompensatedMoney"
            component={CompensatedMoney}
            options={{
              headerTintColor: 'white',
              title: 'ارصدة تعويضية',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="SystemTransferMoney"
            component={SystemTransferMoney}
            options={{
              headerTintColor: 'white',
              title: 'ارصدة تحويل نظام',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="debtAmountPOS"
            component={DebtAmountPOS}
            options={{
              headerTintColor: 'white',
              title: 'الاموال التى تدين بها',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="PrintedMoney"
            component={PrintedMoney}
            options={{
              headerTintColor: 'white',
              title: 'ارصدة مستلمة مطبوعة',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="CompensatedMoneyOfDeletedCards"
            component={CompensatedMoneyOfDeletedCards}
            options={{
              headerTintColor: 'white',
              title: 'ارصدة تعويض الكارتات الملغاة',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
          <Stack.Screen
            name="PosBuyCreditCart"
            component={PosBuyCreditCart}
            options={{
              headerTintColor: 'white',
              title: 'بيع الكارتات',
              headerTitleStyle: {fontFamily: 'Cairo-SemiBold'},
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

const Test = props => {
  const {t} = useTranslation();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: '#4e31c1',
        drawerItemStyle: {
          marginVertical: 5,
        },
        drawerLabelStyle: {
          fontSize: 19,
          fontFamily: 'Cairo-SemiBold',
        },
        drawerActiveBackgroundColor: '#4e31c1',
        drawerInactiveBackgroundColor: '#ffffff',
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="Pos_homepage"
        options={{
          drawerLabel: t('Pos_homepage', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <FontAwesome5
              name="home"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={Pos_homepageStack}
        initialParams={props.route.params}
      />

      <Drawer.Screen
        name="SaleCarts"
        options={{
          drawerLabel: t('SaleCartsDrawer', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <FontAwesome5
              name="credit-card"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={FirstScreenStack}
      />

      <Drawer.Screen
        name="SendCredit"
        options={{
          drawerLabel: t('SendCredit', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <FontAwesome5
              name="money-check"
              size={20}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={POSCreditTransefereStack}
      />
      <Drawer.Screen
        name="POS_Fill_the_machine"
        options={{
          drawerLabel: t('POS_Fill_the_machinepos', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <Fontisto
              name="shopping-pos-machine"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={POS_Fill_the_machineStack}
      />
      <Drawer.Screen
        name="Reports"
        options={{
          drawerLabel: t('Reports', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <Feather
              name="file-text"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={ReportScreenStack}
      />
      <Drawer.Screen
        name="ReprintReciept"
        options={{
          drawerLabel: t('ReprintReciept', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <Feather
              name="file-text"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={ReprintRecieptStack}
      />

      <Drawer.Screen
        name="SIMCardReport"
        options={{
          drawerLabel: 'التعبئة اليومية',
          drawerIcon: ({focused, size}) => (
            <Feather
              name="file-text"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={SIMCardStack}
      />
      <Drawer.Screen
        name="whoWeEmtdad"
        options={{
          drawerLabel: t('whoWeEmtdad', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="contacts"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={WhoWeEmtdadstack}
      />
      <Drawer.Screen
        name="ConnectionType"
        options={{
          drawerLabel: t('ConnectionType', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="cast-connected"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={ConnectionTypeStack}
      />
      <Drawer.Screen
        name="NewPassword"
        options={{
          drawerLabel: t('NewPassword', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="form-textbox-password"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={NewPasswordStack}
      />

      <Drawer.Screen
        name="Aboutme"
        options={{
          drawerLabel: t('Aboutme', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="account-cash"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={AboutMeStack}
      />

      {/* <Drawer.Screen
        name="TestPrinter"
        options={{
          drawerLabel: t('TestPrinter', { order: 1 })
          ,
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="printer"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={ChangeAndTestPrinter}
      /> */}

      <Drawer.Screen
        name="Notification"
        options={{
          drawerLabel: t('notification', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <Ionicons
              name="notifications"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={NotificationStack}
      />

      <Drawer.Screen
        name="logout"
        options={{
          drawerLabel: t('Logout', {order: 1}),
          drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="logout"
              size={size}
              color={focused ? '#fff' : '#4e31c1'}
            />
          ),
        }}
        component={LogoutStack}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#4e31c1',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: hp('30%'),
    borderWidth: 0.5,
    height: hp('50%'),
    width: wp('80%'),
    borderBottomWidth: wp('2%'),
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    backgroundColor: '#cde6ff80',
  },
  modalView: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderColor: '#4e31c1',
    borderRadius: 30,
    borderWidth: 10,
    padding: wp('20%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: wp('90%'),
    alignSelf: 'center',
  },
  text: {
    color: '#4e31c1',
    fontSize: 25,
    marginTop: hp('0%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
  },
  text2: {
    color: '#4e31c1',
    fontSize: 16,
    marginTop: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
  },
  text21: {
    color: '#4e31c1',
    fontSize: 17,
    marginTop: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    //alignSelf:'center'
  },
  text3: {
    color: '#4e31c1',
    fontSize: 20,
    marginTop: hp('1%'),
    alignSelf: 'center',
    fontFamily: 'Cairo-SemiBold',
  },
});

export default Test;
