import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {decode as atob, encode as btoa} from 'base-64';

function ClassificationCard({
  calssificationId,
  arabicName,
  englishName,
  image,
  functionality,
}) {
  const [img, setImg] = useState();
  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // console.log(btoa(binary));
    return binary;
    // return btoa(binary);
  };
  const uri = `data:image/png;base64,${arrayBufferToBase64(image.data)}`;
  useEffect(() => {
    setImg(uri);
  }, []);
  return (
    <Pressable onPress={functionality} style={styles.adsl}>
      <View style={styles.cardContainer}>
        <Image width={100} height={100} source={{uri: img}} />

        <Text style={styles.textStyle}>{englishName}</Text>
        <Text style={styles.textStyle}>{arabicName}</Text>
        {/* <Text>

                    {calssificationId}
                </Text> */}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  adsl: {
    width: Dimensions.get('window').width / 2,
    height: 150,
    //marginLeft:wp('25%'),
    // backgroundColor: "blue",
    marginVertical: 5,
    // padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: '#4e31c1',
    width: '90%',
    height: '100%',
    display: 'flex',
    flex: 1,
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 15,
    alignSelf: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#FFFAFA',
  },
});

export default ClassificationCard;
