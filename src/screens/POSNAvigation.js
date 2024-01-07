import * as React from 'react';

import {
  Button,
  Platform,
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  //  useWindowDimensions
} from 'react-native';
import 'react-native-gesture-handler';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import FirstPage from './FirstPage';
// import SecondPage from './SecondPage';
// import ThirdPage from './ThirdPage';
// import PosSentSIM from './PosSentSIM';
// import Aboutme from './Aboutme';
// import POSCreditTransefere from './POSCreditTransefere'
// import CustomSidebarMenu from './CustomSidebarMenu';
// import i18n from '../screens/i18n';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PosBuyCreditCart from '../screens/PosBuyCreditCart'
// import ReportPOS from './ReportPOS';
// import SimCards from './ReportsPOS/SimCards';
// import SoldPOS from './ReportsPOS/SoldPOS';
// import AccountStatmentPOS from './ReportsPOS/AccountStatmentPOS';
// import DailyMovementPOS from './ReportsPOS/DailyMovementPOS';
// import DiscountPoints from './ReportsPOS/DiscountPoints';
// import WinAccountPOS from './ReportsPOS/WinAccountPOS';
// import AllAccountStatment from './ReportsPOS/AllAccountStatment';
// import SendedMoney from './ReportsPOS/SendedMoney';
// import TakenMoney from './ReportsPOS/TakenMoney';
// import Sim_Category from '../screens/Sim_Category'
// import Sim_Zain from '../screens/Sim_Zain'
// import Logout from '../screens/Logout'
import Registration from '../screens/Registration';
import LoginEmtdad from '../screens/LoginEmtdad';
// import ConfirmIdentity from '../screens/ConfirmIdentity';
// import VerificationCode from '../screens/VerificationCode'
// import Pos_homepage from '../screens/Pos_homepage';
// import InitialPage from '../screens/InitialPage'
// import POS_Fill_the_machine from './POS_Fill_the_machine'
// import whoWeEmtdad from './whoWeEmtdad'
// import FirstPageReport from './FirstPageReport'
// import NewPassword from '../NewPassword';
/////////////////////////////////////////////////////////////////////////
// import IraqCell from './Companies/IraqCell'
// import tishknet from './Companies/tishknet'
// import shahid from './Companies/shahid'
// import ninntedo from './Companies/ninntedo'
// import Amazon from './Companies/Amazon'
// import ebay from './Companies/ebay'
// import free_fire from './Companies/free_fire'
// import skype from './Companies/skype'
// import minecraft from './Companies/minecraft'
// import netflix from './Companies/netflix'
// import tarin from './Companies/tarin'
// import newroz from './Companies/newroz'
// import ftth from './Companies/ftth'
// import fastlink from './Companies/fastlink'
// import fifa from './Companies/fifa'
// import ADSL from './Companies/ADSL'
// import ZainData from './Companies/ZainData'
// import AsiaCellData from './Companies/AsiaCellData'
// import leage_of_legend from './Companies/leage_of_legend'
// import price_mobile_legend from './Companies/price_mobile_legend'
/////////////////////////////////////////////////////////////////////////////////////
import Test from './Test';
import PrintReceipt from './PrintReceipt';
import PrintReceiptSIM from './PrintReceiptSIM';

// import GooglePlay from '../screens/Companies/GooglePlay'
// import Xbox from '../screens/Companies/Xbox'
// import Korek from '../screens/Companies/Korek'
// import Pubg from '../screens/Companies/Pubg'
// import Itunes from '../screens/Companies/Itunes'
// import Asiacell from '../screens/Companies/Asiacell'
// import Karim from '../screens/Companies/Karim'
// import Zain from '../screens/Companies/Zain';
// import steam from '../screens/Companies/steam'
// import mastercard from '../screens/Companies/mastercard'
// import playstation from '../screens/Companies/playstation'
// import razer from '../screens/Companies/razer'
// import spotify from '../screens/Companies/spotify'
// import runscape from '../screens/Companies/runscape'
// import roblox from '../screens/Companies/roblox'
// import macfee from '../screens/Companies/macfee'
// import lords from '../screens/Companies/lords'
// import likeee from '../screens/Companies/likeee'
// import horizone_fi from '../screens/Companies/horizone_fi'
// import fortunite from '../screens/Companies/fortunite'
// import conquer from '../screens/Companies/conquer'
// import blue_tv from '../screens/Companies/blue_tv'
// import bigo_live from '../screens/Companies/bigo_live'
// import blade_soul from '../screens/Companies/blade_soul'
// import iqonline from '../screens/Companies/iqonline'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const NavigationDrawerStructure = props => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};

function LoginStack({navigation}) {
  return (
    <Stack.Navigator initialRouteName="Login">
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

      {/* TESt */}

      <Stack.Screen
        name="test"
        component={Test}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PrintReceipt"
        component={PrintReceipt}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PrintReceiptSIM"
        component={PrintReceiptSIM}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function POSNAvigation() {
  return (
    <NavigationContainer>
      <LoginStack />
    </NavigationContainer>
  );
}

export default POSNAvigation;
