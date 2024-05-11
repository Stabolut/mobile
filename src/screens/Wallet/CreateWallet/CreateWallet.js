import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid, Dimensions
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { store } from '../../../store';

import RNFetchBlob from 'rn-fetch-blob';
import { COLORS, ENUMS,THEME } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import { ethers } from 'ethers';
//import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../../components/dropDownHolder';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RNFS from 'react-native-fs';
import { request, PERMISSIONS } from 'react-native-permissions';

const windowHeight = Dimensions.get('window').height;
class CreateWallet extends React.Component {
  state = {
    mnemonicsArray: [],
    mnemonic: '',
    address: '',
  };

  newWallet = async () => {
    let mnemonic = ethers.utils.HDNode.entropyToMnemonic(
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
     
      const fileURI = 'file://' + path;
      return { path, fileURI };
    } catch (err) {
      console.log(err.message);
      return null;
    }
  };


  copyToClipBoard = () => {
    try {
      Clipboard.setString(this.state.mnemonic);
      DropDownHolder.alert(
        'sucess',
        'Copy',
        `The wallet information has been successfully copied to the clipboard.`,
      );
    }
    catch (e) {
      DropDownHolder.alert(
        'sucess',
        'Copy',
        `Facing some problem to copy wallet information to the clipboard.`,
      );

    }

  };


  downloadMnemonics = async () => {
    this.saveFile()
  }

  saveFile = async (fileUri) => {
    try {



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


      const fileName = 'mnemonics.txt';
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const fileContents = this.state.mnemonic;
      // console.log("Recehd that point", filePath, fileContents)
      try {
        //   await RNFS.writeFile(filePath, fileContents, 'utf8');


        //   const privateDir = RNFetchBlob.fs.dirs.DocumentDir;
        //   console.log("privateDir",privateDir)
        //   RNFetchBlob.fs.writeFile(`${privateDir}/example.txt`, 'Hello World!', 'utf8')
        //     .then(() => console.log('File saved to private internal storage directory'))
        //     .catch((err) => console.log("strull", err));

        // const internalFilePath = filePath; // Replace with your internal file path
        // const externalDir = RNFetchBlob.fs.dirs.DownloadDir; // Get the device's external storage directory
        // const externalFilePath = `${externalDir}/example.txt`; // Replace with your desired file name and path

        // RNFetchBlob.fs
        //   .cp(internalFilePath, externalFilePath)
        //   .then(() => {
        //     console.log('File copied to external storage:', externalFilePath);
        //   })
        //   .catch((err) => {
        //     console.log('Error copying file:', err);
        //   });


        // Define the file name and path
        const fileContent = this.state.mnemonic;
        const fileName = `Stabolut-Mnemonics-${Date.now()}.txt`;
        const internalFilePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
        const externalDir = RNFetchBlob.fs.dirs.DownloadDir;
        const externalFilePath = `${externalDir}/${fileName}`;

        // Write the file to the device's internal storage
        RNFetchBlob.fs
          .writeFile(internalFilePath, fileContent, 'utf8')
          .then(() => {
            console.log('File saved to internal storage:', internalFilePath);

            // Copy the file to the device's external storage
            return RNFetchBlob.fs.cp(internalFilePath, externalFilePath);
          })
          .then(() => {
            console.log('File downloaded to external storage:', externalFilePath);
          })
          .catch((err) => {
            console.log('Error writing/downloading file:', err);
          });

        DropDownHolder.alert(
          'Success',
          'Copy', "Mnemonics file download in mobile")
        console.log('File saved successfully!');
      } catch (error) {
        console.log(error.message);
      }


    } catch (error) {
      alert("We are facing some issues downloading the mnemonics. Please carefully copy these mnemonics and write them somewhere safe")

    }
  }







  render() {

    let selectedTheme = store.getState().authReducer?.theme
    let theme = THEME[selectedTheme]
    return (
      <React.Fragment>
        <StatusBarNU
          backgroundColor={theme?.BACKGROUND_COLOR}
         
        />
        <View style={[styles.mainContainer,{ backgroundColor: theme?.BACKGROUND_COLOR,}]}>
          <ScrollView>
            <View style={styles.mainContainerChild1}>
              <View style={[styles.mainContainerChild1View1, { paddingHorizontal: 32 }]}>
                <Text style={[styles.mainContainerChild1View1Text_1,{ color: theme?.WHITE,}]}>
                  Your Secret Phrase
                </Text>
                <Text style={[styles.mainContainerChild1View1Text_2,{ color: theme?.SMALL_HEADING_TEXT,}]}>
                  Write down or copy these words in the right order and save
                  them somewhere safe
                </Text>
              </View>


              <View style={[styles.mainContainerChild1View2, { padding: windowHeight >= 630 ? 16 : 0 }]}>
                {this.state.mnemonicsArray.map((item, index) => (
                  <View
                    key={index}
                    style={styles.mainContainerChild1View2View1}>
                    <Text style={{ color: theme?.SMALL_HEADING_TEXT }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: theme?.WHITE,
                        marginLeft: 2,
                      }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 4 }}>
                <TouchableOpacity
                  onPress={this.copyToClipBoard}
                  style={{ marginRight: 24, justifyContent: "center", alignItems: "center" }}
                >
                  <Ionicons size={25} color={theme?.WHITE} name="copy" />
                  <Text
                    style={{
                      color: theme?.WHITE,
                      fontSize: 14,
                      fontWeight: '700',
                      fontFamily: 'Poppins',
                    }}>
                    COPY
                  </Text>
                </TouchableOpacity>



              </View>




            </View>
          </ScrollView>

          <View style={styles.mainContainerChild2}>
            <View style={styles.alertStyleMain}>
              <Text style={styles.alertStyleText1}>
                Do Not share your phrase with anyone as this gives full access to
                your wallet!
              </Text>

              <Text style={styles.alertStyleText2}>
                US₿ support will never reach out to ask for it
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
    flex: 1
  },
  mainContainerChild1: {
    flex: 1,
    paddingTop: 30
  },

  mainContainerChild1View1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  mainContainerChild1View1Text_1: {
    fontFamily: 'Poppins',
    fontSize: 22
  },
  mainContainerChild1View1Text_2: {
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Poppins',
  },

  mainContainerChild1View2: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    //alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center'

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
    fontFamily: 'Poppins'
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
