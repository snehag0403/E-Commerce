import {StyleSheet, View} from 'react-native';
import React from 'react';
import { Typography } from '../../theme/Colors';

const CustomSliderThumb = () => {
  return (
    <View style={styles.mainView}>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Typography.Colors.primary,
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Typography.Colors.lightpurple,
    borderWidth: 4,
    top: 1,
  },
  innerView: {
    backgroundColor: Typography.Colors.lightblack,
    height: 28,
    width: 28,
    borderRadius: 7,
    zIndex:2
  },
});
export default CustomSliderThumb;
