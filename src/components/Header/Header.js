import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, ENUMS } from '../../common';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';


class HeaderComponent extends React.Component {
  
  render() {
    console.log("theme color",this?.props?.theme?.BACKGROUND_COLOR)
    return (
      <View style={[styles.mainContainer,{backgroundColor: this?.props?.theme?.BACKGROUND_COLOR,}]} animated={true}>


        {
          this.props.backButton === false ? <View style={{ flex: 1 }}>
            <Text
              style={{
                color: this?.props?.theme?.WHITE,
                fontSize: 20,
                marginLeft: 24,

                fontFamily: 'Poppins',
                marginTop: 4,
              }}>
              {this?.props?.headerText}
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
                style={[styles.arrowBack,{ color: this?.props?.theme?.WHITE}]}
                size={20}
                color={this?.props?.theme?.WHITE}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: this?.props?.theme?.WHITE,
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
              style={[styles.arrowRefresh,{color:this?.props?.theme?.WHITE}]}
              size={25}
              color={theme.WHITE}
            />
          </TouchableOpacity> : null
        }

        {
          this.props.settingButton === true ? <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(ENUMS.SCREENS.SETTING)

          }} style={{ marginRight: 8, marginLeft: 8, alignItems: "flex-end", justifyContent: "center" }}>
            <Ionicons
              name="ios-settings-sharp"
              style={[styles.arrowRefresh,{color:this?.props?.theme?.WHITE}]}
              size={25}
              color={theme.WHITE}
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
    
    alignItems: 'center',
    flexDirection: 'row',
   
  },
  arrowBack: {
    marginLeft: 15,
    marginRight: 20,
    height: 20,
    width: 20,
    marginTop: 4,

  },
  arrowRefresh: {
    color: COLORS.WHITE,
  },
});

export default HeaderComponent;
