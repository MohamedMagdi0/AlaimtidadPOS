import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from 'react-native';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';
//import i18n from 'i18n-js';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
const SimCards = ({navigation, route}) => {
  const {t} = useTranslation();
  const [path, SetImage] = React.useState('');

  React.useEffect(() => {
    if (route.params.company == 'asiacell') {
      //setPath(require('../../assets/Logos/Asiacell/box.png'))
      SetImage(require('../../../assets/Logos/Asiacell/box.png'));
    } else if (route.params.company == 'zain') {
      SetImage(require('../../../assets/Logos/Zain/tttt.png'));
    } else if (route.params.company == 'korek') {
      SetImage(require('../../../assets/Logos/KorekCards/box.png'));
    }
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/backgroumd34.png')}
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
      }}>
      <ScrollView>
        <View>{/* <POSInfo/> */}</View>
        <Image source={path} style={styles.ImageAsiacell1} />

        <Card containerStyle={styles.cardCnt}>
          <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
            <Card.Title
              style={{color: '#4e31c1', fontSize: 20, marginTop: hp('2%')}}>
              {t('simcards')}
            </Card.Title>
          </View>
          {/* <Card.Image source={require('../../../assets/statistics2.png')} style={{ height:40,width:40}} /> */}
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#fff',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('category')} : 1000
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#fff',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('Companyname')} : Asiacell
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#fff',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('thedate')} : 24/10/2020 3:10pm
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#fff',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('price')} : 1400
          </Text>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#4e31c170',
  },
  ImageAsiacell1: {
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.97,
    height: Dimensions.get('window').height * 0.17,
  },
});

export default SimCards;
