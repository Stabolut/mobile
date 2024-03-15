import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid, AlertIOS
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { COLORS, ENUMS } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import { ethers } from 'ethers';
import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../../components/dropDownHolder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import
FontAwesome5
  from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS } from 'react-native-permissions';
import { err } from 'react-native-svg/lib/typescript/xml';

class CreateWallet extends React.Component {
  state = {
    mnemonicsArray: [],
    mnemonic: '',
    address: '',
  };

  newWallet = async () => {
    const mnemonic = ethers.utils.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16),
    );



    var splitMnemoncisArray = mnemonic.split(' ');

    this.setState({
      mnemonic: mnemonic,
      mnemonicsArray: splitMnemoncisArray,
    });
  };
  componentDidMount() {
    this.newWallet();
  }

  writeToTextFile = async (fileName, content) => {
    const path = RNFS.DocumentDirectoryPath + '/' + fileName;
    try {
      await RNFS.writeFile(path, content, 'utf8');
      console.log('File written!');
      const fileURI = 'file://' + path;
      return { path, fileURI };
    } catch (err) {
      console.log(err.message);
      return null;
    }
  };


  copyToClipBoard = () => {
    Clipboard.setString(this.state.mnemonic);
    DropDownHolder.alert(
      'Success',
      'Copy',
      `Wallet information copied to clipboard`,
    );
  };

  generateFilePath() {
    const fileName = `abc.txt`;
    let filePath;
    let fileUri;
    if (Platform.OS === 'android') {
      filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
      fileUri = `file://${filePath}`;
    } else {
      filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
      fileUri = filePath;
    }
    return { filePath, fileUri };
  }








  downloadMnemonics = async () => {
    const fileName = 'example.txt';
    const content = 'This is an example file.';
    const { path, fileURI } = await this.writeToTextFile(fileName, content);
    console.log("path", path, "fileURI", fileURI)
    this.saveFile()

    // try {
    //   await CameraRoll.save(fileURI, { type: 'photo' });
    //   console.log('File saved to gallery!');
    // } catch (err) {
    //   console.log(err.message);
    // }
  }

  saveFile = async (fileUri) => {
    try {

      // Generate the file path and file URI
      const { filePath } = this.generateFilePath();
      console.log("filePath", filePath)

      // Request permission to write to external storage on Android
      if (Platform.OS === 'android') {
        const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        const granted = await request(permission);
        if (granted !== 'granted') {
          // Permission denied, handle the error or show a message
          if (granted === 'denied') {
            ToastAndroid.show('Permission denied, please enable the storage permission', ToastAndroid.LONG);
          } else {
            ToastAndroid.show('Permission not granted', ToastAndroid.SHORT);
          }
          return;
        }
      }
      console.log("Recehd that point")

      // // Write some text to the file
      // const text = 'Hello, world!';
      // console.log("File path", filePath)
      // await RNFetchBlob.fs.writeFile(filePath, text, 'utf8');
      // console.log("i am reacehd there")

      // // Fetch the text file from the file URI
      // const response = await RNFetchBlob.config({
      //   //  fileCache: true,
      //   //  appendExt: 'txt',
      //   //  path: filePath,
      //   //  addAndroidDownloads: {
      //   //    useDownloadManager: true,
      //   // //   notification: true,
      //   // //   path: filePath,
      //   // //   mime: 'text/plain',
      //   //  },
      //   //  trusty: true,
      //   //  useUtf8: true,
      // }).fetch('GET', fileUri);

      // Show a success message
      // if (Platform.OS === 'android') {
      //   ToastAndroid.show('File saved successfully', ToastAndroid.SHORT);
      // } else {
      //   AlertIOS.alert('Success', 'File saved successfully');
      // }
    } catch (error) {
    //   // Handle the error or show a message
    //   // if (error.message.includes('permission denied')) {
    //   //   if (Platform.OS === 'android') {
    //   //     ToastAndroid.show('Permission denied, please enable the storage permission', ToastAndroid.LONG);
    //   //   } else {
    //   //     AlertIOS.alert('Error', 'Permission denied, please enable the storage permission');
    //   //   }
    //   // } else {
    //   console.log(
    //     "scdv", error
    //   )
    //   console.error(error);
    //   // }
    }
  }







  render() {
    return (
      <React.Fragment>
        <StatusBarNU
          backgroundColor={COLORS.BACKGROUND_COLOR}
          barStyle="light-content"
        />
        <View style={styles.mainContainer}>
          <ScrollView>
            <View style={styles.mainContainerChild1}>
              <View style={styles.mainContainerChild1View1}>
                <Text style={styles.mainContainerChild1View1Text_1}>
                  Your Secret Phrase
                </Text>
                <Text style={styles.mainContainerChild1View1Text_2}>
                  Write down or copy these words in the right order and save
                  them somewhere safe
                </Text>
              </View>

              <View style={styles.mainContainerChild1View2}>
                {this.state.mnemonicsArray.map((item, index) => (
                  <View
                    key={index}
                    style={styles.mainContainerChild1View2View1}>
                    <Text style={{ color: COLORS.SMALL_HEADING_TEXT }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.WHITE,
                        marginLeft: 2,
                      }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24}}>
                <TouchableOpacity
                  onPress={this.copyToClipBoard}
                  style={{marginRight:12}}
                >
                  <Ionicons style={{ marginLeft: 5 }} size={25} color={COLORS.WHITE} name="copy" />
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontSize: 14,
                      fontWeight: '700',
                      fontFamily: 'Poppins',
                    }}>
                    COPY
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.downloadMnemonics}
                  style={{ marginLeft: 16, alignItems: "baseline" }}>
                  <FontAwesome5 style={{ marginLeft: 12 }} size={25} color={COLORS.WHITE} name="cloud-download-alt" />

                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontSize: 14,
                      fontWeight: '700',
                      fontFamily: 'Poppins',
                    }}>
                    Download
                  </Text>
                </TouchableOpacity>
              </View>




            </View>
          </ScrollView>

          <View style={styles.mainContainerChild2}>
            <View style={styles.alertStyleMain}>
              <Text style={styles.alertStyleText1}>
                Do Not share your phrase to anyone as this gives full access to
                your wallet!
              </Text>

              <Text style={styles.alertStyleText2}>
                EuroB support will NEVER reach out to ask for it
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(
                  `${ENUMS.SCREENS.MNEMONICS_VERIFICATION}`,
                  {
                    actualMnemonics: this.state.mnemonic,
                    mnemonics: this.state.mnemonicsArray,
                  },
                );
              }}
              style={styles.btnStyleContinue}>
              <Text style={styles.textStyleContinue}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  mainContainerChild1: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 40,
  },

  mainContainerChild1View1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  mainContainerChild1View1Text_1: {
    fontFamily: 'Poppins',
    fontSize: 22,
    color: COLORS.WHITE,
  },
  mainContainerChild1View1Text_2: {
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.SMALL_HEADING_TEXT,
    fontFamily: 'Poppins',
  },

  mainContainerChild1View2: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  mainContainerChild1View2View1: {
    padding: 8,
    marginRight: 8,
    marginBottom: 12,
    textAlign: 'center',
    borderRadius: 3,
    borderColor: COLORS.APP_NORMAL_TEXT_COLOR_BALCK,
    borderWidth: 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainerChild2: {
    marginBottom: 24,
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  alertStyleMain: {
    width: '100%',
    padding: 16,
    opacity: 0.7,
    backgroundColor: COLORS.ALERT_BACKGROUND_COLOR,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertStyleText1: {
    color: COLORS.ALERT_BOLD_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  alertStyleText2: {
    color: COLORS.ALERT_NORMAL_COLOR,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins',
  },

  btnStyleContinue: {
    height: 50,
    width: '100%',
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.WHITE,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },

  textStyleContinue: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default CreateWallet;
