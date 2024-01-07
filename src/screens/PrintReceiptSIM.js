import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
// import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
// import { TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Clipboard from '@react-native-clipboard/clipboard';
// import CameraRoll from '@react-native-community/cameraroll';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {BarCodeView} from 'com.alaimtidad.group';
import QRCode from 'react-native-qrcode-svg';
import API_URL from '../screens/URL';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {hsdLogo} from '../Components/DummyLogo';

var {height, width} = Dimensions.get('window');
const d = new Date();
var date = new Date().getDate(); //Current Date
var month = new Date().getMonth() + 1; //Current Month
var year = new Date().getFullYear(); //Current Year
var hours = new Date().getHours(); //Current Hours
var min = new Date().getMinutes(); //Current Minutes
var sec = new Date().getSeconds(); //Current Seconds
class PrintReceiptSIM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pairedDevices: [],
      foundDevices: [],
      imageURI: '',
      soldCards: this.props.route.params.arrStr,
      image: '',
      company: this.props.route.params.company,
      bluetoothEnabled: false,
      counter: '',
      flagShow: false,
      loading: false,
      deviceName: '',
      // cardData: {}
      foundDs: [],
      pairedDevices: [],
      bleOpend: false,
    };
  }

  async SaveImageIngallary() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      console.log('PermissionsAndroid.RESULTS.GRANTED==>', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this?.refs?.viewShot2?.capture().then(async uri => {
          console.log('do something with ', uri);
          CameraRoll?.save(uri, 'photo')
            .then(() => {
              Alert.alert('تم حفظها بنجاح');
            })
            .catch(e => console.log('error in saving', e));
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async checkBluetoothEnabled() {
    console.log('checkBluetoothEnabled');
    try {
      const isEnabled = await BluetoothManager.isBluetoothEnabled();
      console.log('******************isEnabled', isEnabled);
      this.setState({bluetoothEnabled: isEnabled, bleOpend: isEnabled});
    } catch (error) {
      console.log('Bluetooth check error:', error);
      // Handle the error
    }
  }

  async componentDidMount() {
    console.log('this.props.route.params', this.props.route.params);
    // this.setState({ cardData: item })
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        // setBleOpend(Boolean(enabled));
        console.log('enabled==> ', enabled);
        this.setState({bluetoothEnabled: enabled, bleOpend: enabled});
        this.setState({loading: false});
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show(
            'Device Not Support Bluetooth !',
            ToastAndroid.LONG,
          );
        },
      );
    }
    if (this.state.pairedDevices.length < 1) {
      this.scanDevices();
    }
  }

  async componentDidMount() {
    this.checkBluetoothEnabled();
    this.setState({flagShow: true});

    setTimeout(() => {
      this?.refs?.viewShot?.capture().then(uri => {
        this.setState({imageURI: uri}, async () => {
          const address = await AsyncStorage.getItem('printerAddress');
          const printerName = await AsyncStorage.getItem('printerName');

          this.setState({deviceName: printerName});
          if (address) {
            this.connectBluetoothDevice(address, printerName);
          } else {
            console.log('address is null', address);
          }
        });
      });
    }, 2000);

    // BluetoothManager.checkBluetoothEnabled()
    //     .then((enabled) => {
    //         this.setState({ bluetoothEnabled: enabled })
    //     })
    //     .catch((e) => console.log('error from enabled', e))
  }

  getPrinterAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('printerAddress');
      return address;
    } catch (e) {
      // error reading value
    }
  };

  render() {
    return (
      <>
        <ScrollView>
          <ViewShot
            ref="viewShot"
            options={{format: 'jpg', result: 'base64', quality: 0.9}}>
            <ViewShot ref="viewShot2" options={{format: 'jpg', quality: 0.9}}>
              <View style={{backgroundColor: '#fff'}}>
                {this.renderReceipt()}
              </View>
            </ViewShot>
          </ViewShot>
          {this.state.flagShow === true ? (
            <TouchableOpacity
              style={styles.button2}
              onPress={() => this.SaveImageIngallary()}>
              <Text style={styles.btnText2}>حفظ في الاستوديو</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <Text style={styles.bluetoothText}>
            حالة ال blutooth:{this.state.bluetoothEnabled ? 'مفتوح' : 'مغلق'}{' '}
          </Text>
          <Text style={styles.bluetoothText}>يرجى فتح ال bluetooth</Text>

          <Switch
            value={this.state.bleOpend}
            onValueChange={v => {
              this.setState({
                loading: true,
              });
              if (!v) {
                BluetoothManager.disableBluetooth().then(
                  () => {
                    this.setState({
                      bluetoothEnabled: false,
                      bleOpend: false,
                      loading: false,
                      foundDs: [],
                      pairedDevices: [],
                    });
                  },
                  err => {
                    console.log('err', err);
                  },
                );
              } else {
                BluetoothManager.enableBluetooth().then(
                  r => {
                    this.enableBluetooth();
                    var paired = [];
                    if (r && r.length > 0) {
                      for (var i = 0; i < r.length; i++) {
                        try {
                          paired.push(JSON.parse(r[i]));
                        } catch (e) {
                          //ignore
                        }
                      }
                    }
                    this.setState({
                      bleOpend: true,
                      bluetoothEnabled: true,
                      loading: false,
                      pairedDevices: paired,
                    });
                  },
                  err => {
                    this.setState({
                      loading: false,
                    });
                    console.log('errrr', err);
                  },
                );
              }
            }}
          />

          <Button
            onPress={this.scanDevices}
            title="بحث"
            disabled={!this.state.bluetoothEnabled}
          />
          {this.state.loading && (
            <ActivityIndicator animating={true} size="large" color="#10B8E9" />
          )}
          <Text style={styles.bluetoothText}>
            الاجهزة المتصلة:
            <Text style={{color: 'blue'}}>
              {!this.state.deviceName ? 'لا يوجد اجهزة' : this.state.deviceName}
            </Text>
          </Text>

          <Text style={styles.bluetoothText}>الاجهزة المترابطة:</Text>
          <FlatList
            data={this.state.pairedDevices}
            renderItem={this.renderPairedDevices}
            keyExtractor={item => item.address}
          />
          <Text style={styles.bluetoothText}>الاجهزة المتاحة:</Text>
          <FlatList
            data={this.state.foundDevices}
            renderItem={this.renderFoundDevices}
            keyExtractor={item => item.address}
          />
        </ScrollView>
      </>
    );
  }

  // renderPairedDevices = ({ item }) => (
  //     <>
  //         <TouchableOpacity onPress={() => this.connectBluetoothDevice(item.address, item.name)}>
  //             <Text>{item.address} {item.name}</Text>
  //         </TouchableOpacity>
  //     </>
  // );
  // renderFoundDevices = ({ item }) => (
  //     <>
  //         <TouchableOpacity onPress={() => this.connectBluetoothDevice(item.address, item.name)}>
  //             <Text>{item.address} {item.name}</Text>
  //         </TouchableOpacity>
  //     </>
  // );
  renderPairedDevices = ({item}) => (
    <>
      <TouchableOpacity
        onPress={() => this.connectBluetoothDevice(item?.address, item?.name)}>
        <Text>
          {item?.address} {item?.name}
        </Text>
      </TouchableOpacity>
    </>
  );
  renderFoundDevices = ({item}) => (
    <>
      <TouchableOpacity
        onPress={() => this.connectBluetoothDevice(item?.address, item?.name)}>
        <Text>
          {item?.address} {item?.name}
        </Text>
      </TouchableOpacity>
    </>
  );

  // connectBluetoothDevice = async (address, name) => {
  //     console.log('inside connect function')
  //     // save address to async storage
  //     try {
  //         await AsyncStorage.setItem('printerAddress', `${address}`)
  //         await AsyncStorage.setItem('printerName', name)

  //     } catch (e) {
  //         console.log('async storage error', e)
  //     }
  //     BluetoothManager.connect(address)
  //         .then(() => {
  //             console.log('connected!')
  //             this.setState({ deviceName: name })
  //             this.printIt()
  //             // this.printIt()

  //         })
  //         .catch(() => { console.log('failed to connect!') })
  // }

  connectBluetoothDevice = async (address, name) => {
    //console.log('inside connect function')
    // save address to async storage
    try {
      await AsyncStorage.setItem('printerAddress', `${address}`);
      await AsyncStorage.setItem('printerName', name);
    } catch (e) {
      //console.log('async storage error', e)
    }
    // BluetoothManager.connect(address)
    //     .then(() => {
    //         //console.log('connected!')
    //         this.setState({ deviceName: name })
    //         this.printIt()
    //         // this.printIt()

    //     })
    //     .catch(() => { //console.log('failed to connect!') })
    // setLoading(true);
    console.log('in connect');
    console.log(this.state.soldCards);
    // console.log({ name, address });
    this.setState({deviceName: name});

    // this.state({ loading: true })
    this.setState({loading: true});
    BluetoothManager.connect(address).then(
      s => {
        console.log('sssss', s);
        this.printIt();
        this.setState({deviceName: name});
        this.setState({loading: false});
        // this.state({ loading: false })
        // setLoading(false);
        // setBoundAddress(address);
      },
      e => {
        this.setState({loading: false});
        // this.state({ loading: false })
        console.log(e);
        // this.printIt()
      },
      // this.printIt()
    );
  };

  // scanDevices = () => {
  //     this.setState({ loading: true })
  //     console.log('inside scan devices')
  //     BluetoothManager.scanDevices()
  //         .then((s) => {
  //             var ss = JSON.parse(s);//JSON string
  //             this.setState({ pairedDevices: ss.paired, foundDevices: ss.found, loading: false })
  //         }, (er) => {
  //             // alert('error' + JSON.stringify(er));
  //         })
  //         .catch((e) => console.log(e))
  // }

  // printIt() {

  //     BluetoothEscposPrinter.printerInit().then(() => {
  //         // let base64 = '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'
  //         // let base643 = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  //         // let blackBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAP+gAAD/oBTSsSOAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAABNRSURBVHic7d1NyK95Xcfxz1WjmNKTMDnJpI4a0aY2GhkKWVEUQuVDEYhmBC0i002rqEVIRYSrBCkjhDJCC63UopjBNskwFC5cRInKFGMPaqWCk/Brcc6ZOefM/fB/uK7r9/R6wVme+/4Os/i8+f3vuWcppQSA/izL8uwkP5Tk+5M8L8lzk3xzkmcmeSzJv93880iSD5ZSPlbpVBq0CACAfizLck+Sn07yxiQvS/LVR/z1R5N8IMlvlVI+ufpxdEUAAHRgWZYlyU8k+bUk33rml3s8yTuTvK2U8plzb6NPAgCgccuyPC/Je5O8dOUv/cUkv1hKedfKX5cOfFXtAwC43LIsr0jycNYf/yR5VpLfW5bl7cuyHPNRAgPwAgDQqGVZfjbJO5I8bYdv91dJXldK+d8dvhcN8AIA0KBlWd6S5Hezz/gnN/5rgj9elsUuTMK/aIDG3Bz/t1f41j+S5DcrfF8q8BEAQEMqjv/t3lhKeXflG9iYAABoRCPjnySfT/LCUsrnah/CdnwEANCAhsY/Sb4hyS/VPoJteQEAqKyx8b/lS0leVEp5rPYhbMMLAEBFjY5/cuP/J/Dm2kewHQEAUEnD43/Lj9Y+gO34CACggg7G/5YXlVI+UfsI1ucFAGBnHY1/kryq9gFsQwAA7Kiz8U+S76x9ANsQAAA76XD8k+Q5tQ9gGwIAYAedjn+S3Ff7ALYhAAA21vH4J8m9tQ9gGwIAYEOdj3+SfKH2AWxDAABsZIDxTxK/CXBQAgBgA4OMf5J8pvYBbEMAAKxsoPFPkk/VPoBtCACAFQ02/kny17UPYBt+FTDASgYc/88nubeU8pXah7A+LwAAKxhw/JPkw8Z/XAIA4EyDjn+SvKv2AWxHAACcYeDx/9tSyt/UPoLt+BkAgBMNPP5J8l2llIdrH8F2vAAAnGDw8f9D4z8+LwAARxp8/D+W5HtKKV+sfQjbEgAARxh8/P8zyUtLKZ+sfQjb8xEAwIEGH/8vJ3mN8Z+HAAA4wATj/2OllI/UPoT9CACAa0wy/h+ufQj7EgAAVzD+jEoAAFzC+DMyAQBwAePP6AQAwF2MPzMQAAC3Mf7MQgAA3GT8mYkAAIjxZz4CAJie8WdGAgCYmvFnVgIAmJbxZ2YCAJiS8Wd2AgCYjvEHAQBMxvjDDQIAmIbxhycJAGAKxh/uJACA4Rl/eCoBAAzN+MPFBAAwLOMPlxMAwJCMP1xNAADDMf5wPQEADMX4w2EEADAM4w+HEwDAEIw/HEcAAN0z/nA8AQB0zfjDaQQA0C3jD6cTAECXjD+cRwAA3TH+cD4BAHTF+MM6BADQDeMP6xEAQBeMP6xLAADNM/6wPgEANM34wzYEANAs4w/bEQBAk4w/bEsAAM2ZYPx/3PhTmwAAmjLJ+H+o9iEgAIBmGH/YjwAAmmD8YV8CAKjO+MP+BABQlfGHOgQAUI3xh3oEAFCF8Ye6BACwO+MP9QkAYFfGH9ogAIDdGH9ohwAAdmH8oS0CANic8Yf2CABgU8Yf2iQAgM0Yf2iXAAA2YfyhbQIAWJ3xh/YJAGBVxh/6IACA1Rh/6IcAAFZh/KEvAgA4m/GH/ggA4CzGH/okAICTGX/olwAATmL8oW8CADia8Yf+CQDgKMYfxiAAgIMZfxiHAAAOYvxhLAIAuJbxh/EIAOBKxh/GJACASxl/GJcAAC5k/GFsAgB4CuMP4xMAwB2MP8xBAABPMP4wDwEAJDH+MBsBAMww/q82/nAnAQCTm2T8P1j7EGiNAICJGX+YlwCASRl/mJsAgAkZf0AAwGSMP5AIAJiK8QduEQAwCeMP3E4AwASMP3A3AQCDM/7ARQQADMz4A5cRADAo4w9cRQDAgIw/cB0BAIMx/sAhBAAMxPgDhxIAMAjjDxxDAMAAjD9wLAEAnTP+wCkEAHTM+AOnEgDQKeMPnEMAQIeMP3AuAQCdMf7AGgQAdMT4A2sRANAJ4w+sSQBAB4w/sDYBAI0z/sAWBAA0zPgDWxEA0CjjD2xJAECDjD+wNQEAjTH+wB4EADTE+AN7EQDQCOMP7EkAQAOMP7A3AQCVGX+gBgEAFRl/oBYBAJUYf6AmAQAVGH+gNgEAO5tg/F9j/KF9AgB2NMn4/2XtQ4DrCQDYifEHWiIAYAfGH2iNAICNDT7+j8f4Q5cEAGxogvF/tfGHPgkA2IjxB1omAGADxh9onQCAlRl/oAcCAFZk/IFeCABYifEHeiIAYAXGH+iNAIAzGX+gRwIAzmD8gV4JADiR8Qd6JgDgBMYf6J0AgCMZf2AEAgCOYPyBUQgAOJDxB0YiAOAAxh8YjQCAaxh/YEQCAK5g/IFRCQC4hPEHRiYA4ALGHxidAIC7GH9gBgIAbmP8gVkIALjJ+AMzEQAQ4w/MRwAwPeMPzEgAMDXjD8xKADAt4w/MTAAwJeMPzE4AMB3jDyAAmIzxB7hBADAN4w/wJAHAFIw/wJ0EAMObYPxfY/yBYwkAhjbJ+P9F7UOA/ggAhmX8AS4nABiS8Qe4mgBgOMYf4HoCgKEYf4DDCACGYfwBDicAGILxBziOAKB7xh/geAKArhl/gNMIALpl/AFOJwDokvEHOI8AoDvGH+B8AoCuGH+AdQgAumH8AdYjAOiC8QdYlwCgecYfYH0CgKYZf4BtCACaZfwBtiMAaJLxB9iWAKA5xh9gewKAphh/gH0IAJph/AH2IwBogvEH2JcAoDrjD7A/AUBVxh+gDgFANcYfoB4BQBXGH6AuAcDujD9AfQKAXRl/gDYIAHZj/AHaIQDYhfEHaIsAYHPGH6A9AoBNGX+ANgkANmP8AdolANiE8QdomwBgdROM/2uNP9A7AcCqJhn/P699CMC5BACrMf4A/RAArML4A/RFAHA24w/QHwHAWYw/QJ8EACcz/gD9EgCcxPgD9E0AcDTjD9A/AcBRjD/AGAQABzP+AOMQABzE+AOMRQBwLeMPMB4BwJWMP8CYBACXMv4A4xIAXMj4A4xNAPAUxh9gfAKAOxh/gDkIAJ5g/AHmIQBIYvwBZiMAMP4AExIAkzP+AHMSABMz/gDzEgCTMv4AcxMAEzL+AAiAyRh/AJJkKaXUvoGdLMvypiS/X/uOjRh/gCMIgEksy/KyJA8leXrlU7Zg/AGOJAAmsCzL/UkeTnJf7Vs2YPwBTuBnAObwRzH+ANxGAAxuWZZXJXlF7Ts2YPwBzuAjgIEty7Ik+cck31H7lpUZf4AzeQEY20/G+ANwAQEwttfXPmBlxh9gJT4CGNSyLM9M8l9JnlH7lpUYf4AVeQEY1w/E+ANwCQEwru+rfcBKHk/yOuMPsC4BMK7n1j5gBbfG/wO1DwEYjQAYV++/+Mf4A2xIAIzrObUPOIPxB9iYABjX02ofcIbPJvl47SMARiYAxvWZ2gec4b4kDy7L8uLahwCMSgCMq+cASJL7IwIANiMAxvVY7QNWIAIANiIAxvX3tQ9YiQgA2IBfBTyoZVnuzY1XgFEi79Ekryyl/HPtQwBGMMo4cJdSyn8k+WjtO1Z06yXgRbUPARiBABjb+2ofsLL7kzwkAgDO5yOAgS3L8qwkn0jyTbVvWdmjSb63lPIvtQ8B6JUXgIGVUr6Y5G2179iAlwCAM3kBGNyyLE9P8k9Jnl/7lg14CQA4kReAwZVSHk/yhiT/V/uWDXgJADiRAJhAKeUjSX6h9h0bEQEAJxAAkyilvDPJO2rfsRERAHAkPwMwkWVZ7knyniSvrX3LRvxMAMCBvABMpJTylSQ/leS9tW/ZiJcAgAMJgMmIAAASATAlEQCAAJiUCACYmwCYmAgAmJcAmJwIAJiTAEAEAExIAJBEBADMRgDwBBEAMA8BwB1EAMAcBABPIQIAxicAuJAIABibAOBSIgBgXAKAK4kAgDEJAK4lAgDGIwA4iAgAGIsA4GAiAGAcAoCjiACAMQgAjiYCAPonADiJCADomwDgZCIAoF8CgLOIAIA+CQDOJgIA+iMAWIUIAOiLAGA1IgCgHwKAVYkAgD4IAFYnAgDaJwDYhAgAaJsAYDMiAKBdAoBNiQCANgkANicCANojANiFCABoiwBgNyIAoB0CgF2JAIA2CAB2JwIA6hMAVCECAOoSAFQjAgDqEQBUNUkEPCgCgNYIAKqbIAK+JSIAaIwAoAkiAGBfAoBmiACA/QgAmiICAPYhAGiOCADYngCgSSIAYFsCgGZNFAEvrH0IMB8BQNMmiYCHRACwNwFA80QAwPoEAF0QAQDrEgB0QwQArEcA0BURALAOAUB3RADA+QQAXRIBAOcRAHRLBACcTgDQNREAcBoBQPdEAMDxBABDEAEAxxEADEMEABxOADAUEQBwGAHAcEQAwPUEAEMSAQBXEwAMSwQAXE4AMDQRAHAxAcDwRADAUwkApiACAO4kAJiGCAB4kgBgKiIA4AYBwHREAIAAYFIiAJidAGBaIgCYmQBgaiIAmJUAYHoiAJiRAICIAGA+AgBuEgHATAQA3EYEALMQAHAXEQDMQADABUQAMDoBAJcQAcDIBABcQQQAoxIAcA0RAIxIAMABRAAwGgEABxIBwEgEABxBBACjEABwJBEAjEAAwAlEANA7AQAnEgFAzwQAnEEEAL0SAHAmEQD0SADACkQA0BsBACsRAUBPBACsSAQAvRAAsDIRAPRAAMAGRADQOgEAGxEBQMsEAGxIBACtEgCwMREAtEgAwA4miYAHRQD0QwDATiaIgOdFBEA3BADsSAQArRAAsLOJIuCB2ocAlxMAUMEkEfCQCIB2CQCoRAQANQkAqEgEALUIAKhMBAA1CABogAgA9iYAoBEiANiTAICGiABgLwIAGiMCgD0IAGiQCAC2JgCgUSIA2JIAgIaJAGArAgAaJwKALQgA6IAIANYmAKATIgBYkwCAjogAYC0CADojAoA1CADokAgAziUAoFMiADiHAICOiQDgVAIAOicCgFMIABiACACOJQBgECIAOIYAgIGIAOBQAgAGIwKAQwgAGJAIAK4jAGBQIgC4igCAgYkA4DICAAYnAoCLCACYgAgA7iYAYBIiALidAICJiADgFgEAkxEBQCIAYEoiABAAMCkRAHMTADAxEQDzEgAwOREAcxIAgAiACQkAIIkIgNkIAOAJIgDmIQCAO4gAmIMAAJ5CBMD4BABwIREAYxMAwKVEAIxLAABXEgEwJgEAXEsEwHgEAHAQEQBjEQDAwUQAjEMAAEcRATAGAQAcTQRA/wQAcBIRAH0TAMDJRAD0SwAAZxEB0CcBAJxNBEB/BACwikki4MFlWV5Q+Q5YhQAAVjNBBDw/N14CXlD5DjibAABWJQKgDwIAWJ0IgPYJAGATIgDaJgCAzYgAaJcAADYlAqBNAgDYnAiA9ggAYBciANoiAIDdiABohwAAdiUCoA0CANidCID6BABQhQiAugQAUI0IgHoEAFCVCIA6BABQnQiA/QkAoAkiAPYlAIBmiADYjwAAmiICYB8CAGiOCIDtCQCgSSIAtiUAgGaJANiOAACaJgJgGwIAaJ4IgPUJAKALIgDWJQCAbogAWI8AALoiAmAdAgDojgiA8wkAoEsiAM4jAIBuiQA4nQAAuiYC4DQCAOieCIDjCQBgCCIAjiMAgGGIADicAACGIgLgMAIAGI4IgOsJAGBIIgCuJgCAYYkAuJwAAIYmAuBiAgAYngiApxIAwBREANxJAADTEAHwJAEATEUEwA0CAJiOCAABAExKBDA7AQBMSwQwMwEATE0EMCsBAExPBDAjAQAQEcB8BADATSKAmQgAgNuIAGYhAADuIgKYgQAAuIAIYHQCAOASIoCRCQCAK4gARrWUUmrfANC8ZVnuSfKeJK+tfctGPpXk5aWUR2sfwj68AAAcYJKXgD9bluUZtQ9hHwIA4EATRMBLkryz9hHsQwAAHGGCCHjDsiw/X/sItudnAABOMPjPBHwuyQOllP+ufQjb8QIAcILBXwK+Mclbax/BtrwAAJxh4JeA/0nyglLK52ofwja8AACcYeCXgK/LjX8uBiUAAM40cAT8cO0D2I6PAABWMuDHAV9K8uxSypdrH8L6vAAArGTAl4BnJnl57SPYhgAAWNGAEfBA7QPYhgAAWNlgEXBf7QPYhgAA2MBAESAABiUAADYySAR8be0D2IYAANjQABHw77UPYBsCAGBjnUfAY7UPYBsCAGAHHUeAABiUAADYSacR8EjtA9iG3wQIsLOOfmPgJ0spfg/AoLwAAOyso5eAD9U+gO0IAIAKOomA99c+gO34CACgooY/DniklPKS2kewHS8AABU1/BLwq7UPYFteAAAa0NhLwEdLKd9d+wi25QUAoAENvQR8IcnPVL6BHQgAgEY0EAElyRtLKR+v9P3ZkQAAaEjlCPj1UsqfVvi+VCAAABpzWwS8e8dv+xtJfnnH70dlfggQoGHLsrw5yW8nuWejb/F4kp8rpfzBRl+fRgkAgMYty/KKJH+S5L6Vv/QnkryplPKRlb8uHfARAEDjSil/l+TbkvxKks+v8CU/m+StSb7d+M/LCwBAR5Zl+fokb0ny+iQvPvKv/0OS9yX5nVLKGiFBxwQAQKeWZXkgyQ8meWWS+5Pce/PP1yT51ySfvvnnkSTvL6V8utKpNOj/AdANASEkfQNSAAAAAElFTkSuQmCC'
  //         BluetoothEscposPrinter.printPic(this.state.imageURI, { width: 630 })
  //             .then(() => console.log('print succeeded!'))
  //             .catch((e) => console.log('error', e))
  //     })
  //         .catch((e) => console.log('error', e))
  //     console.log('print it here')
  // };

  // enableBluetooth() {
  //     this.setState({ loading: true })
  //     console.log('inside function')
  //     BluetoothManager.enableBluetooth()
  //         .then((devices) => {
  //             console.log('inside then', devices)
  //             this.setState({ loading: false, bluetoothEnabled: true })

  //         }).catch((e) => console.log(e))
  // };

  scanDevices = () => {
    // this.setState({ loading: true })
    // //console.log('inside scan devices')
    // BluetoothManager.scanDevices()
    //     .then((s) => {
    //         //console.log("inside scan devices.then", s);
    //         var ss = JSON.parse(s);//JSON string
    //         //console.log({ ss });
    //         this.setState({ pairedDevices: ss?.paired, foundDevices: ss?.found, loading: false })
    //     }, (er) => {
    //         // alert('error' + JSON.stringify(er));
    //     })
    //     .catch((e) => //console.log("scan devices err", e))

    try {
      let blueTooth = async () => {
        const permissions = {
          title: 'HSD bluetooth requests permission to access bluetooth',
          message:
            'Bluetooth HSD requires access to bluetooth in order to connect to the bluetooth printer',
          buttonNeutral: 'Next Time',
          buttonNegative: 'No',
          buttonPositive: 'Yes',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        // console.log("in scanDevices", bluetoothConnectGranted, "***", PermissionsAndroid.RESULTS.GRANTED);
        if (PermissionsAndroid.RESULTS.GRANTED) {
          // console.log("in scanDevices in 1st if condition");
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );

          console.log('bluetoothScanGranted', bluetoothScanGranted);
          if (PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({loading: true});
            console.log('in scanDevices in 2nd if condition');
            BluetoothManager.scanDevices()
              .then(
                s => {
                  console.log('in then', s);
                  // console.log();
                  const devices = JSON.parse(s);
                  console.log({devices});
                  // const pairedDevices = s.paired;
                  var found = devices.found;
                  // setFoundDs(found);
                  // this.setState({ foundDs: found })
                  console.log('after foundDs', found);
                  let paired = devices?.paired;
                  // setPairedDevices(paired)
                  // this.setState({ pairedDevices: paired })
                  //console.log("foundfound", found);
                  //  this.setState({ loading: false);

                  this.setState({
                    pairedDevices: paired,
                    foundDevices: found,
                    loading: false,
                  });
                  // var fds = foundDs;
                  // if (found && found.length) {
                  //     fds = found;
                  // }
                  // setFoundDs(fds);
                  this.setState({loading: false});
                },
                er => {
                  console.log({er});
                  this.setState({loading: false});
                  // ignore
                },
              )
              .catch(error => {
                console.log('error', error);
              });
          }
        } else {
          console.log(' in else');
          // ignore akses ditolak
        }
      };
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  };

  scanBluetoothDevice = async () => {
    this.setState({loading: true});
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        this.scanDevices();
        this.setState({loading: false});
      } else {
        this.setState({loading: false});
      }
    } catch (err) {
      this.setState({loading: false});
    }
  };

  async printIt() {
    console.log('in print it');
    // BluetoothEscposPrinter.printerInit().then(() => {
    // let base64 = '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'
    // let base643 = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    // let blackBase64 = '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'
    console.log('this.state.imageURI', this.state.imageURI);
    if (this.state.deviceName === 'InnerPrinter') {
      await BluetoothEscposPrinter.printPic(this.state.imageURI, {width: 630});
    } else {
      // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      // await BluetoothEscposPrinter.printColumn(
      //     [148],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['__________________________________________________'],
      //     {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //     [32],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     [`${this.state.company}`],
      //     {},
      // );
      // // await BluetoothEscposPrinter.printText(
      // //     `${this.state.company}`,
      // //     {},
      // // );

      // await BluetoothEscposPrinter.printColumn(
      //     [148],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['__________________________________________________'],
      //     {},
      // );
      // // await BluetoothEscposPrinter.printText(
      // //     '__________________________________________________',
      // //     {},
      // // );
      // await BluetoothEscposPrinter.printColumn(
      //     [50],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['AMOUNT'],
      //     {},
      // );

      // // await BluetoothEscposPrinter.printText(
      // //     `AMOUNT`,
      // //     {},
      // // );

      // // await BluetoothEscposPrinter.printText(
      // //     ` ${this.props.route.params.category}`,
      // //     {},
      // // );

      // await BluetoothEscposPrinter.printColumn(
      //     [50],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     [` ${this.props.route.params.category}`],
      //     {},
      // );

      // // await BluetoothEscposPrinter.printText(
      // //     `Pin-code`,
      // //     {},
      // // );
      // await BluetoothEscposPrinter.printColumn(
      //     [50],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     [`Pin-code`],
      //     {},
      // );

      // // await BluetoothEscposPrinter.printText(
      // //     `${this.state.soldCards[0]?.pin}`,
      // //     {},
      // // );

      // await BluetoothEscposPrinter.printColumn(
      //     [50],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     [`${this.state.soldCards[0]?.pin}`],
      //     {},
      // );
      // // await BluetoothEscposPrinter.printText(
      // //     `company: ${this.state.soldCards[0]?.sell_price}`,
      // //     {},
      // // );

      // await BluetoothEscposPrinter.printQRCode(
      //     `${this.state.soldCards[0]?.pin}`,
      //     280,
      //     BluetoothEscposPrinter.ERROR_CORRECTION.L,
      // ); //.then(()=>{alert('done')},(err)=>{alert(err)});
      // await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

      // await BluetoothEscposPrinter.printColumn(
      //     [100],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['================================================'],
      //     {},
      // );

      //  let columnWidths = [8, 20, 20];

      await BluetoothEscposPrinter.printText('-------------', {});
      // await BluetoothEscposPrinter.printPic(hsdLogo, { width: 630, left: 630 / 2 });

      await BluetoothEscposPrinter.printPic(this.state.imageURI, {width: 630});

      this.state.imageURI, {width: 630};
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
    }
    // await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

    // .then(() => console.log('print succeeded!'))
    // .catch((e) => console.log('error', e))
    // })
    //     .catch((e) => console.log('error', e))
    console.log('print it here');
  }

  enableBluetooth() {
    console.log('enabling');
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        // setBleOpend(Boolean(enabled));
        console.log('enabled==> ', enabled);
        this.setState({bluetoothEnabled: enabled, bleOpend: enabled});
        this.setState({loading: false});
      },
      err => {
        err;
      },
    );

    this.scanBluetoothDevice();
    this.setState({loading: true});
    //console.log('inside function')
    // BluetoothManager.enableBluetooth()
    //     .then((devices) => {
    //         //console.log('inside then', devices)
    //         this.setState({ loading: false, bluetoothEnabled: true })

    //     }).catch((e) => //console.log(e))
  }

  copyToClipboard = pin => {
    Clipboard.setString(pin);
    Alert.alert('تم نسخها');
  };

  renderReceipt = () => {
    return (
      <>
        <View style={{backgroundColor: '#ffffff', marginBottom: 20}}>
          <Image
            style={{
              width: 400,
              height: 200,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            source={{uri: this.props.route.params.image}}
          />
          <View style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 24,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginTop: -5,
              }}>
              {' '}
              الحالة: {this.props.route.params.response.status}{' '}
            </Text>
            {this.props.route.params.transCode == '' ? (
              <></>
            ) : (
              <>
                <Text
                  style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                  {' '}
                  رقم العملية: {this.props.route.params.transCode}
                </Text>
              </>
            )}
            {this.props.route.params.soldtoname == '' ? (
              <></>
            ) : (
              <>
                <Text
                  style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                  {' '}
                  مبيوعة الي: {this.props.route.params.soldtoname}
                </Text>
              </>
            )}
            <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
              {' '}
              رقم الفاتورة: {this.props.route.params.reciptNumber}
            </Text>
            <Text
              style={{
                color: '#000',
                fontSize: 24,
                paddingBottom: 2,
                alignSelf: 'center',
              }}>
              - - - - - - - - - - - - - - - - - - - - - -
            </Text>

            <View>
              <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                {' '}
                عملية: {this.props.route.params.type}
              </Text>
              <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                {' '}
                المبلغ: {this.props.route.params.category}
              </Text>
              <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                {' '}
                رقم الهاتف: {this.props.route.params.soldtophone}
              </Text>
              <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                {' '}
                التاريخ: {date + '/' + month + '/' + year}
              </Text>
              <Text style={{color: '#000', fontSize: 23, alignSelf: 'center'}}>
                {' '}
                الوقت: {hours + ':' + min + ':' + sec}
              </Text>

              <Image
                style={styles.tinyLogo1}
                source={this.props.route.params.aimtidadImage}
              />
            </View>
          </View>
        </View>
      </>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: wp('1%'),
    marginTop: hp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    // marginTop:hp('-1%'),
  },
  barcode: {
    height: 40,
    width: 300,
    marginTop: 20,
    alignSelf: 'center',
  },
  whiteImage: {
    height: 20,
  },
  bluetoothText: {
    width: width,
    backgroundColor: '#eee',
    color: '#000',
    paddingRight: 8,
    paddingVertical: 4,
    textAlign: 'right',
    marginRight: 20,
  },
  button2: {
    top: 6,
    marginTop: 8,
    padding: 2,
    width: 260,
    height: 39,
    marginLeft: 2,
    marginBottom: 10,
    borderWidth: 0.8,
    borderRadius: 6,
    borderColor: '#F2FFFF',
    backgroundColor: '#023882',
    alignSelf: 'center',
  },

  btnText2: {
    color: '#fff',
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    //fontFamily:"JannaLT-Regular",
    //marginTop:wp('0%'),
  },
  tinyLogo: {
    width: 400,
    height: 200,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tinyLogo1: {
    width: 220,
    height: 90,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    width: width,
    backgroundColor: '#eee',
    color: '#000',
    paddingRight: 8,
    paddingVertical: 4,
    textAlign: 'right',
    marginRight: 20,
  },
  wtf: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    textAlign: 'left',
  },
  address: {
    flex: 1,
    textAlign: 'right',
  },
});

export default PrintReceiptSIM;
