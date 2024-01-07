import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import whoWeEmtdad from '../screens/whoWeEmtdad';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../screens/URL';

function CompanyDataModal({}) {
  const [modalVisible, setmodalVisible] = React.useState(false);

  const [website, setWebsite] = useState({
    info: null,
  });

  useEffect(() => {
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
          //   setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          //   setcommercialName(pos_commercial_name);
          //   setMoney(virtualMoneyBalance)
          console.log('response.data.message[0]', response.data.message[0]);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      <TouchableOpacity onPress={() => setmodalVisible(true)}>
        <Image
          source={require('../../assets/24_7_icon2.png')}
          style={{
            marginTop: hp('0%'),
          }}
          onPress={whoWeEmtdad}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AntDesign
                style={{
                  marginTop: hp('-8%'),
                  alignSelf: 'flex-end',
                  marginRight: wp('-18%'),
                }}
                name="closecircle"
                size={24}
                color="#f00"
                onPress={() => setmodalVisible(false)}
              />

              <Text style={styles.text}>شركة الامتداد</Text>

              <Text style={styles.text2}>للخدمات اللوجيستية</Text>
              {/* <Text style={styles.text2}>الرائدة في</Text>
<Text style={styles.text2}>مجال الحلول الالكترونية</Text> */}
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text3}>للتواصل معنا </Text>
                <Text style={styles.text3}>يرجى الاتصال ب</Text>
              </View>
              <Text
                style={styles.text21}
                onPress={() =>
                  Linking.openURL(
                    `tel:+964${website?.info?.website_phonenumber}`,
                  )
                }>
                {website?.info?.website_phonenumber}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text3}>للتواصل معنا </Text>
                <Text style={styles.text3}>عبر الواتساب</Text>
              </View>
              <Text
                style={styles.text21}
                onPress={() =>
                  Linking.openURL(
                    `whatsapp://send?text=hello&phone=+964${website?.info?.website_whatsapp}`,
                  )
                }>
                {website?.info?.website_whatsapp}
              </Text>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={styles.text8}
                  // https://itlandcanada.com/noor-alkisaa/
                  //https://alaimtidad-itland.com
                  onPress={() =>
                    Linking.openURL(`${website?.info?.website_name}`)
                  }>
                  visit our website Alaimtidad
                </Text>
              </View>

              {/* 
      <TouchableHighlight
        style={styles.button2}
        onPress={() => {
          setmodalVisible(false);
        }}
      >
        <Text style={styles.btnText2}>  {t('ok')}</Text>
      </TouchableHighlight> */}
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

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
  text8: {
    color: '#4e31c1',
    fontSize: 14,
    marginTop: hp('1%'),
    //fontFamily:'Cairo-SemiBold',
    alignSelf: 'center',
  },
});

export default CompanyDataModal;
