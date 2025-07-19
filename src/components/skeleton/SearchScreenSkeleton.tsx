import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Typography } from '../../theme/Colors';

const { width } = Dimensions.get('window');
const numColumns = 4;
const itemWidth = (width - 60) / numColumns;

// Individual skeleton item component
const SkeletonItem = () => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.skeletonImage, animatedStyle]} />
      <Animated.View style={[styles.skeletonText, animatedStyle]} />
    </View>
  );
};

// Skeleton row component (4 items per row)
const SkeletonRow = () => {
  return (
    <View style={styles.row}>
      {Array.from({ length: numColumns }).map((_, index) => (
        <SkeletonItem key={`skeleton-item-${index}`} />
      ))}
    </View>
  );
};

// Section header skeleton
const SkeletonSectionHeader = () => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.skeletonSectionHeader, animatedStyle]} />
  );
};

// Search bar skeleton
const SkeletonSearchBar = () => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.skeletonSearchBar, animatedStyle]} />
  );
};

// Main skeleton component
const SearchScreenSkeleton = ({ themeMode = 'light' }) => {
  const theme = themeMode === 'dark' 
    ? { background: Typography.Colors.black }
    : { background: Typography.Colors.white };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search bar skeleton */}
      <View style={styles.searchContainer}>
        <SkeletonSearchBar />
      </View>

      {/* Content skeleton */}
      <View style={styles.contentContainer}>
        {/* Generate multiple sections */}
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <View key={`skeleton-section-${sectionIndex}`}>
            {/* Section header skeleton */}
            <View style={styles.sectionHeaderContainer}>
              <SkeletonSectionHeader />
            </View>
            
            {/* Section items skeleton (2 rows per section) */}
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <SkeletonRow key={`skeleton-row-${sectionIndex}-${rowIndex}`} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginVertical: 10,
  },
  skeletonSearchBar: {
    height: 55.5,
    backgroundColor: '#E1E9EE',
    borderRadius: 15,
    width: width - 60,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  sectionHeaderContainer: {
    paddingVertical: 15,
  },
  skeletonSectionHeader: {
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '40%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainer: {
    width: itemWidth,
    alignItems: 'center',
    paddingVertical: 10,
  },
  skeletonImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#E1E9EE',
    marginBottom: 7,
  },
  skeletonText: {
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: itemWidth - 20,
  },
});

export default SearchScreenSkeleton;