import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import i18n from '../screens/i18n';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from './URL';
import {useTranslation} from 'react-i18next';

const CustomSidebarMenu = props => {
  const {t} = useTranslation();
  const BASE_PATH =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
  const proileImage = 'react_logo.png';

  const [date, setDate] = React.useState('');

  React.useEffect(() => {
    newMainFunction();
  }, []);

  const newMainFunction = async () => {
    try {
      const user_id = await AsyncStorage.getItem('userIdInUsers');
      const user_type_id = await AsyncStorage.getItem('user_type_id');

      const response = await axios.post(
        API_URL +
          `getuserdata?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {userId: parseInt(user_id), userTypeId: parseInt(user_type_id)},

        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      setDate(response.data.message[0].creation_date);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/*Top Large Image */}
      <View style={styles.sideMenuProfileIcon}></View>
      <Text style={styles.LogoText}>{t('alaimtidad')}</Text>
      <Text style={styles.dateTitle}> تاريخ التسجيل </Text>
      <Text style={styles.dateTitle}> {date} </Text>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: wp('68%'),
    height: wp('10%'),

    alignSelf: 'center',
    top: hp('2%'),
    backgroundColor: 'transparent',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  LogoText: {
    color: '#4e31c1',
    alignSelf: 'center',
    top: hp('1%'),
    fontSize: wp('18%'),
    fontFamily: 'Cairo-SemiBold',
  },
  dateTitle: {
    color: '#4e31c1',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
  },
});

export default CustomSidebarMenu;
