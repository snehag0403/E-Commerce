import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Typography } from '../../theme/Colors';

const { width } = Dimensions.get('window');

const WishlistSkeleton = ({ theme, itemCount = 5 }) => {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-width, width]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const SkeletonBox = ({ width, height, borderRadius = 5, style = {} }) => (
    <View style={[
      {
        width,
        height,
        borderRadius,
        backgroundColor: theme.text === Typography.Colors.white ? '#2a2a2a' : '#f0f0f0',
        overflow: 'hidden',
      },
      style
    ]}>
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: theme.text === Typography.Colors.white 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.8)',
          },
          animatedStyle,
        ]}
      />
    </View>
  );

  const SkeletonItem = () => (
    <View style={styles.subContainer}>
      <View style={styles.imageContainer}>
        <SkeletonBox width={87} height={77} borderRadius={5} />
      </View>
      <View style={styles.productAmount}>
        <SkeletonBox width={150} height={16} style={{ marginBottom: 8 }} />
        <SkeletonBox width={100} height={14} />
      </View>
      <View style={styles.amountIcon}>
        <SkeletonBox width={80} height={16} style={{ marginBottom: 20 }} />
        <SkeletonBox width={20} height={20} borderRadius={10} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Skeleton */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <SkeletonBox width={120} height={22} />
        <View style={styles.deleteAll}>
          <SkeletonBox width={70} height={16} />
          <SkeletonBox width={20} height={20} borderRadius={10} />
        </View>
      </View>

      {/* List Items Skeleton */}
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}

      {/* Button Skeleton */}
      <View style={styles.buttonContainer}>
        <SkeletonBox 
          width={width - 60} 
          height={50} 
          borderRadius={25} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 45,
    paddingTop: 55,
    paddingBottom: 16,
  },
  subContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    elevation: 1,
    marginBottom: 10,
  },
  imageContainer: {
    padding: 18,
  },
  productAmount: {
    justifyContent: 'center',
    gap: 8,
    flex: 1.3,
  },
  amountIcon: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingRight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    marginTop: 20,
  },
  deleteAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
  },
});

export default WishlistSkeleton;