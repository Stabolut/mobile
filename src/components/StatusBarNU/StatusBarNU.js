import React from "react";
import {
  View,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";

import { COLORS } from "../../common";
export default ({ backgroundColor, ...props }) => {

  return (

    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={COLORS.BACKGROUND_COLOR} {...props} />
      </SafeAreaView>
    </View>

  );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },

});
