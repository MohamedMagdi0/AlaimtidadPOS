// import React, { Component } from 'react';
// import {
//     StyleSheet,
//     View,
//     Button,
//     Switch,
//     FlatList,
//     Image,
//     ActivityIndicator,
//     TouchableOpacity,
//     Text,
//     PermissionsAndroid,
//     Platform
// } from 'react-native';
// import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
// import ViewShot from 'react-native-view-shot';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class TestPrinter extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             pairedDevices: [],
//             foundDevices: [],
//             imageURI: '',
//             bluetoothEnabled: false,
//             loading: false,
//             deviceName: ''
//         }
//     }

//     async componentDidMount() {
//         console.log("Platform.constants['Release']============>", Platform.constants['Release'].split(".")[0]);

//         if (Platform.constants['Release'].split(".")[0] >= 10) {
//             let granted = await PermissionsAndroid.requestMultiple(
//                 [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]);
//             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                 console.log('You can use the Bluetooth');
//             } else {
//                 console.log('Bluetooth permission denied');
//             }
//         }

//         this.refs.viewShot.capture().then(uri => {
//             this.setState({ imageURI: uri })
//             // console.log(uri)
//         })

//             .catch((e) => console.log('capture error', e))

//         BluetoothManager.checkBluetoothEnabled()
//             .then(async (enabled) => {
//                 this.setState({ bluetoothEnabled: enabled });
//                 if (enabled) {
//                     const address = await AsyncStorage.getItem('printerAddress')
//                     if (address) {
//                         this.connectBluetoothDevice(address, printerName)
//                     } else {
//                         console.log('address is null', address)
//                     }
//                 }
//             })
//             .catch((e) => console.log('error from enabled', e))

//         const printerName = await AsyncStorage.getItem('printerName')

//         this.setState({ deviceName: printerName })
//     }

//     render() {
//         return (
//             <>
//                 <ViewShot ref="viewShot" options={{ format: "jpg", result: 'base64', quality: 0.9 }} style={{ flex: 1, height: 200 }}>
//                     <View style={styles.viewShotContainer}>
//                         <Text style={styles.printedText}>تغير/اختيار الطابعة</Text>
//                     </View>
//                 </ViewShot>
//                 <View style={styles.container}>

//                     {this.state.loading && (<ActivityIndicator animating={true} size="large" color="#10B8E9" />)}

//                     <Text >حالة ال blutooth:{this.state.bluetoothEnabled ? "مفتوح" : "مغلق"}  </Text>
//                     <Text >يرجى فتح ال bluetooth</Text>

//                     <Switch value={this.state.bluetoothEnabled}
//                         onValueChange={(v) => {
//                             this.setState({
//                                 loading: true
//                             })
//                             if (!v) {
//                                 BluetoothManager.disableBluetooth().then(() => {
//                                     this.setState({
//                                         bluetoothEnabled: false,
//                                         loading: false
//                                     });
//                                 })
//                                     .catch((e) => console.log(e))

//                             } else {
//                                 this.enableBluetooth()
//                             }
//                         }}
//                     />
//                     <Button
//                         onPress={this.scanDevices}
//                         title="بحث"
//                         disabled={!this.state.bluetoothEnabled}
//                         color="#7d54e1"
//                     />
//                     <Text>الاجهزة المتصلة:<Text style={{ color: "blue" }}>{!this.state.deviceName ? 'لا يوجد اجهزة' : this.state.deviceName}</Text></Text>

//                     <Text>الاجهزة المترابطة:</Text>
//                     <FlatList
//                         data={this.state.pairedDevices}
//                         renderItem={this.renderDevices}
//                         keyExtractor={item => item.address}
//                     />
//                     <Text style={styles.bluetoothText}>الاجهزة المتاحة:</Text>
//                     <FlatList
//                         data={this.state.foundDevices}
//                         renderItem={this.renderDevices}
//                         keyExtractor={item => item.address}
//                     />
//                     <Button
//                         onPress={() => this.printTest(this.state.imageURI)}
//                         title="طباعة"
//                         disabled={!this.state.bluetoothEnabled}
//                         color="#7d54e1"
//                     />
//                 </View>

//             </>
//         );
//     }

//     printTest(uri) {
//         BluetoothEscposPrinter.printerInit().then(() => {
//             BluetoothEscposPrinter.printPic(uri, { width: 630 })
//                 .then(() => console.log('print succeeded!'))
//                 .catch((e) => console.log('error here', e))
//         })
//             .catch((e) => console.log('error init', e))
//         console.log('print it here')
//     }

//     enableBluetooth() {
//         this.setState({ loading: true })
//         console.log('inside function')
//         BluetoothManager.enableBluetooth()
//             .then((devices) => {
//                 this.setState({ loading: false, bluetoothEnabled: true })

//             })
//     };

//     scanDevices = () => {
//         this.setState({ loading: true })
//         console.log('inside scan devices')
//         BluetoothManager.scanDevices()
//             .then((s) => {
//                 console.log("inside then")
//                 var ss = JSON.parse(s);//JSON string
//                 console.log({ ss });
//                 this.setState({ pairedDevices: ss.paired, foundDevices: ss.found, loading: false })
//             })
//             .catch((e) => console.log('scan devices error', e));
//     }

//     renderDevices = ({ item }) => {
//         console.log("itemmmmmmmmmmmm", item)
//         return (
//             <>
//                 <TouchableOpacity onPress={() => this.connectBluetoothDevice(item?.address, item?.name)}>
//                     <Text style={styles.bluetoothText}>{item?.address} {item?.name}</Text>
//                 </TouchableOpacity>

//             </>
//         )
//     };

//     connectBluetoothDevice = async (address, name) => {
//         console.log('inside connect function')
//         // save address to async storage
//         console.log({ address });
//         try {
//             console.log('inside try')
//             await AsyncStorage.setItem('printerAddress', `${address}`)
//             await AsyncStorage.setItem('printerName', name ? name : "")

//         } catch (e) {
//             console.log('async storage error', e)
//         }
//         console.log(`b4BluetoothManager.connect`)
//         BluetoothManager.connect(address)
//             .then((s) => {
//                 console.log("********s", s);
//                 console.log('connected!')
//                 this.setState({ deviceName: name })
//                 // this.printIt()

//             })
//             .catch(() => { console.log('failed to connect!') })
//     }
// }

// const styles = StyleSheet.create({
//     viewShotContainer: {
//         flex: 1,
//         backgroundColor: "#fff",
//         height: 500
//     },
//     container: {
//         backgroundColor: "#fff"
//     },
//     image: {
//         width: 200,
//         justifyContent: 'center',
//         alignSelf: 'center',
//         marginBottom: 50,
//         backgroundColor: "#fff",
//     },
//     printedText: {
//         backgroundColor: "#fff",
//         fontSize: 24,
//         color: "#000",
//         alignSelf: "center",
//         fontFamily: "Cairo-SemiBold"
//     },
//     textContainer: {
//         height: 50,
//         backgroundColor: "#fff"
//     },
//     devicePressable: {
//         // backgroundColor: "grey",
//         marginVertical: 5,
//         paddingVertical: 5
//     },
//     bluetoothText: {
//         width: "100%",
//         backgroundColor: "#eee",
//         color: "#000",
//         paddingRight: 8,
//         paddingVertical: 4,
//         textAlign: "right",
//         // marginRight: 20
//         marginVertical: 10,
//         paddingVertical: 5
//     },
// })

// export default TestPrinter;

import {join} from 'patch-package/dist/path';
import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import ItemList from '../Components/ItemList';
import SamplePrint from '../Components/SamplePrint';
// import { styles } from './styles';

const TestPrinter = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
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
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
      },
      e => {
        setLoading(false);
        console.log(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = () => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        const devices = JSON.parse(s);
        console.log({devices});
        // const pairedDevices = s.paired;
        var found = devices.found;
        setFoundDs(found);
        let paired = devices?.paired;
        setPairedDevices(paired);
        console.log('foundfound', found);
        setLoading(false);

        // var fds = foundDs;
        // if (found && found.length) {
        //     fds = found;
        // }
        // setFoundDs(fds);
        setLoading(false);
      },
      er => {
        console.log({er});
        setLoading(false);
        // ignore
      },
    );
  };

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message:
            'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.bluetoothStatusContainer}>
                <Text style={styles.bluetoothStatus(bleOpend ? '#7d54e1' : '#A8A9AA')}>
                    Bluetooth {bleOpend ? 'Active' : 'In active'}
                </Text>
            </View> */}
      {/* {!bleOpend && <Text style={styles.bluetoothInfo}>Please activate your bluetooth</Text>} */}
      {/* <Text style={styles.sectionTitle}>Printers connected to the app:</Text> */}
      {/* {boundAddress.length > 0 && (
                <ItemList
                    label={name}
                    value={found}
                    onPress={() => unPair(boundAddress)}
                    actionText="Putus"
                    color="#E9493F"
                />
            )} */}
      <FlatList
        data={foundDs}
        renderItem={({item}) => (
          <ItemList
            // key={item?.address}
            label={item?.name}
            value={item?.address}
            onPress={() => connect(item)}
            actionText="اقتران"
            color="#7d54e1"
          />
        )}
        keyExtractor={item => item?.address}
      />
      {/* {boundAddress.length < 1 && (
                <Text style={styles.printerInfo}>There is no printer connected yet</Text>
            )} */}
      {/* <Text style={styles.sectionTitle}>Bluetooth connected to this cellphone:</Text> */}
      {loading ? <ActivityIndicator animating={true} /> : null}
      <View style={styles.containerList}>
        {pairedDevices.map((item, index) => {
          return (
            <ItemList
              key={index}
              onPress={() => connect(item)}
              label={item.name}
              value={item.address}
              connected={item.address === boundAddress}
              actionText="اقتران"
              color="#7d54e1"
            />
          );
        })}
      </View>
      <SamplePrint />
      <Button
        onPress={() => scanBluetoothDevice()}
        title="بحث"
        color="#7d54e1"
      />
      <View style={{height: 100}} />
    </ScrollView>
  );
};

export default TestPrinter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  title: {
    width: '100%',
    backgroundColor: '#eee',
    color: '#232323',
    paddingLeft: 8,
    paddingVertical: 4,
    textAlign: 'left',
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
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerList: {flex: 1, flexDirection: 'column'},
  bluetoothStatusContainer: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: 'white',
    paddingHorizontal: 14,
    marginBottom: 20,
  }),
  bluetoothInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFC806',
    marginBottom: 20,
  },
  sectionTitle: {fontWeight: 'bold', fontSize: 18, marginBottom: 12},
  printerInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E9493F',
    marginBottom: 20,
  },
});

// export default TestPrinter;
