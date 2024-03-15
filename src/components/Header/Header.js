import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, ENUMS } from '../../common';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';


class HeaderComponent extends React.Component {
  render() {
    return (
      <View style={styles.mainContainer} animated={true}>


        {
          this.props.backButton === false ? <View style={{ flex: 1 }}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: 20,
                marginLeft: 24,

                fontFamily: 'Poppins',
                marginTop: 4,
              }}>
              {this.props.headerText}
            </Text>
          </View> : <View style={{ flex: 1, flexDirection: "row" }}>

            <TouchableOpacity
              onPress={() => {
                requestAnimationFrame(() => {
                  this.props.navigation.goBack();
                });
              }}>
              <Icon
                name="arrowleft"
                style={styles.arrowBack}
                size={20}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: 20,


                fontFamily: 'Poppins',

              }}>
              {this.props.headerText}
            </Text>


          </View>
        }












        {
          this.props.refreshButton === true ? <TouchableOpacity onPress={this.props.onRefreshClick} style={{ alignItems: "flex-end", justifyContent: "center" }}>
            <Ionicons
              name="refresh"
              style={styles.arrowRefresh}
              size={25}
              color={COLORS.WHITE}
            />
          </TouchableOpacity> : null
        }

        {
          this.props.settingButton === true ? <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(ENUMS.SCREENS.SETTING)

          }} style={{ marginRight: 8, marginLeft: 8, alignItems: "flex-end", justifyContent: "center" }}>
            <Ionicons
              name="ios-settings-sharp"
              style={styles.arrowRefresh}
              size={25}
              color={COLORS.WHITE}
            />
          </TouchableOpacity> : null
        }




      </View>
    );
  }
}
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 70;
const styles = StyleSheet.create({
  mainContainer: {
    height: APPBAR_HEIGHT,
    backgroundColor: COLORS.BACKGROUND_COLOR,
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrowBack: {
    marginLeft: 20,
    marginRight: 20,
    height: 20,
    width: 20,
    marginTop: 4,

    color: COLORS.WHITE,
  },
  arrowRefresh: {
    color: COLORS.WHITE,
  },
});

export default HeaderComponent;
