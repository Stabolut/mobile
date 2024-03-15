import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {COLORS, ENUMS, Images} from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';

class Warning extends React.Component {
  state = {
    toggleCheckBox1: false,
    toggleCheckBox2: false,
    toggleCheckBox3: false,
    disable: true,
  };
  enableButton = () => {
    if (
      this.state.toggleCheckBox1 &&
      this.state.toggleCheckBox2 &&
      this.state.toggleCheckBox3
    )
      this.setState({disable: false});
    else this.setState({disable: true});
  };

  render() {
    return (
      <React.Fragment>
        <StatusBarNU
          backgroundColor={COLORS.BACKGROUND_COLOR}
          barStyle="light-content"
        />

        <View style={styles.mainContainer}>
          <View style={styles.mainContainerChild1}>
            <View style={styles.mainContainerChild1View1}>
              <Text style={styles.mainContainerChild1View1Text_1}>
                Back up your wallet now!
              </Text>
              <Text style={styles.mainContainerChild1View1Text_2}>
                In the next step you will see Secret Phrase (12 words) that
                allows you to recover a wallet
              </Text>
            </View>

            <View style={styles.mainContainerChild1View2}>
              <Image style={styles.image} source={Images.frame4}></Image>
            </View>
          </View>

          <View style={styles.mainContainerChild2}>
            <ScrollView>
              <View>
                <View style={styles.WarningMessageView}>
                  <View
                    style={{
                      flexDirection: 'row',
                    
                    }}>
                    <Text
                      style={{
                        width: '85%',
                        color: COLORS.SMALL_HEADING_TEXT,
                        marginRight: 8,
                        fontFamily: 'Poppins',
                      }}>
                      If I lose my secret phrase, my funds will be lost forever
                    </Text>
                    <CheckBox
                     style={{marginTop:4}}
                      disabled={false}
                      value={this.state.toggleCheckBox1}
                      onValueChange={newValue =>
                        this.setState({toggleCheckBox1: newValue}, () => {
                          this.enableButton();
                        })
                      }
                      tintColors={{true: COLORS.WHITE}}
                    />
                  </View>
                </View>
                <View style={styles.WarningMessageView}>
                  <View
                    style={{
                      flexDirection: 'row',
                    
                    }}>
                    <Text
                      style={{
                        width: '85%',
                        color: COLORS.SMALL_HEADING_TEXT,
                        marginRight: 8,
                        fontFamily: 'Poppins',
                      }}>
                      If I expose or share my secret phrase to anybody, my funds
                      can get stolen
                    </Text>
                    <CheckBox
                    style={{marginTop:4}}
                      disabled={false}
                      value={this.state.toggleCheckBox2}
                      onValueChange={newValue => {
                        this.setState({toggleCheckBox2: newValue}, () => {
                          this.enableButton();
                        });
                      }}
                      tintColors={{true: COLORS.WHITE}}
                    />
                  </View>
                </View>

                <View style={styles.WarningMessageView}>
                  <View
                    style={{
                      flexDirection: 'row',
                     
                    }}>
                    <Text
                      style={{
                        width: '85%',
                        color: COLORS.SMALL_HEADING_TEXT,
                        marginRight: 8,
                        fontFamily: 'Poppins',
                      }}>
                      USB Wallet support will NEVER reach out to ask for it
                    </Text>
                    <CheckBox
                     style={{marginTop:4}}
                    
                      disabled={false}
                      value={this.state.toggleCheckBox3}
                      onValueChange={newValue =>
                        this.setState({toggleCheckBox3: newValue}, () => {
                          this.enableButton();
                        })
                      }
                      tintColors={{true: COLORS.WHITE}}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  disabled={this.state.disable}
                  onPress={() => {
                    this.props.navigation.navigate(
                      `${ENUMS.SCREENS.CREATE_WALLET}`,
                    );
                  }}
                  style={[
                    styles.btnStyleContinue,
                    {
                      opacity: this.state.disable === true ? 0.4 : 1,
                    },
                  ]}>
                  <Text style={styles.textStyleContinue}>Continue</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    marginBottom: 24,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  mainContainerChild1View1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  mainContainerChild1View1Text_1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    fontFamily: 'Poppins',
  },

  mainContainerChild1View1Text_2: {
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.SMALL_HEADING_TEXT,
    fontFamily: 'Poppins',
  },

  mainContainerChild1View2: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  checkbox: {
    color: COLORS.HEADING_BLACK_COLOR,
  },

  mainContainerChild1View2View1: {
    padding: 8,
    marginRight: 8,
    marginBottom: 12,
    textAlign: 'center',
    borderRadius: 3,
    borderColor: COLORS.APP_NORMAL_TEXT_COLOR_BALCK,
    borderWidth: 0.3,
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

  WarningMessageView: {
    width: '100%',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.SLIDER_BORDER_COLOR,
    marginBottom: 16,
  },
  btnStyleContinue: {
    height: 50,

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

export default Warning;
