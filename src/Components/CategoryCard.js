import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {decode as atob, encode as btoa} from 'base-64';
import {NumericFormat} from 'react-number-format';

const CategoryCard = ({
  category_currency,
  category_value,
  image,
  functionality,
  disable,
  cards_category_id,
  availableBundle,
}) => {
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
  };
  const uri = `data:image/png;base64,${arrayBufferToBase64(image?.data)}`;
  useEffect(() => {
    // console.log({ availableBundle });
    // console.log({ availableItemId });
    // console.log(cards_category_id !== availableItemId?.card_category_id);
    setImg(uri);
  }, []);

  return (
    <Pressable
      style={{
        ...styles.container,
        backgroundColor: disable ? '#D3D3D3' : '#4e31c1',
      }}
      onPress={functionality}
      disabled={disable}
      // availableItemId?.map((availableItem) => {
      //             return cards_category_id !== availableItemId?.card_category_id}

      //    )
    >
      <View style={styles.imageContainer}>
        <Image width={200} height={100} source={{uri: img}} />
      </View>
      <View style={styles.textContainer}>
        <Text style={{...styles.textStyle, color: disable ? 'grey' : '#fff'}}>
          {!disable ? (
            <NumericFormat
              renderText={value => (
                <Text style={styles.textStyle}> {value}</Text>
              )}
              value={availableBundle?.sell_price + availableBundle?.discount}
              displayType={'text'}
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={0}
            />
          ) : (
            'غير متوفر'
          )}
        </Text>
        <Text style={styles.textStyle}>
          {!disable ? category_currency : ''}
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: "grey",
    backgroundColor: '#4e31c1',
    marginVertical: '5%',
    paddingVertical: '5%',
    borderRadius: 10,
  },
  imageContainer: {
    // backgroundColor: "black",
    width: '40%',
    // height: "100%",
    display: 'flex',
    flex: 1,
    // borderRadius: 10,
    // marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // paddingVertical: 5
  },
  textContainer: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: "green",
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
});

export default CategoryCard;
