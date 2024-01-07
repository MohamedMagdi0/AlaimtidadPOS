import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';

const CompanyCard = ({company_id, company_name, image, functionality}) => {
  const [img, setImg] = useState();
  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  };
  const uri = `data:image/png;base64,${arrayBufferToBase64(image)}`;
  useEffect(() => {
    setImg(uri);
  }, []);
  return (
    <Pressable onPress={functionality} style={styles.adsl}>
      <Image style={styles.imgStyle} source={{uri: img}} />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  adsl: {
    width: Dimensions.get('window').width / 2,
    height: 120,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: '90%',
    height: '90%',
  },
});
export default CompanyCard;
