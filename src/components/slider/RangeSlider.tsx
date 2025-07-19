import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomSliderThumb from '../sliderThumb/CustomSliderThumb';
import { Typography } from '../../theme/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface RangeSliderParams {
  values: [number, number];
  setValues: (values: [number, number]) => void;
  minLimit?: number;
  maxLimit?: number;
}

const RangeSlider: React.FC<RangeSliderParams> = ({ 
  values, 
  setValues, 
  minLimit = 0,
  maxLimit = 100000 
}) => {
  return (
    <View style={styles.container}>
      <MultiSlider
        values={values}
        onValuesChange={setValues}
        sliderLength={SCREEN_WIDTH-70}
        min={minLimit}
        max={maxLimit}
        step={1}
        allowOverlap={false}
        onValuesChangeFinish={setValues}
        trackStyle={styles.trackStyle}
        selectedStyle={styles.selectedStyle}
        customMarker={() => <CustomSliderThumb />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:20,
    paddingVertical:10
  },
  trackStyle: {
    height: 4,
    borderRadius:8,
    backgroundColor: Typography.Colors.lightpurple,
  },
  selectedStyle: {
    backgroundColor: Typography.Colors.navyblue
  },
  mainView: {
    position: 'absolute',
    top: -25,
    width: 50,
    alignItems: 'center',
  },
  labelText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});

export default RangeSlider;