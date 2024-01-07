import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Text,
} from 'react-native';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';

//import i18n from 'i18n-js';
import POSInfo from '../../../components/POSInfo';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
// import { CardItem } from 'native-base';
const DiscountPoints = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <ImageBackground
      source={require('../../../assets/backgroumd34.png')}
      style={{height: '100%', width: '100%', flex: 1}}>
      <ScrollView>
        <View>
          <POSInfo />
        </View>
        <Card containerStyle={styles.cardCnt}>
          {/* <Card.Image source={require('../../../assets/statistics2.png')} style={{ height:40,width:40}} /> */}

          <View style={{borderRadius: 20}}>
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo_600SemiBold',
                fontSize: wp('5%'),
              }}>
              {t('discountpoints2')} 2000 {t('point')}
            </Text>
          </View>
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
    shadowRadius: 20,
    elevation: 1, // This is for Android
    backgroundColor: '#4e31c170',
    borderRadius: 20,
  },
});

export default DiscountPoints;
