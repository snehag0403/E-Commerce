
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Typography } from '../../theme/Colors';
import useAuthStore from '../../stores/useAuthStore';

const { width } = Dimensions.get('window');

const SkeletonLoader = () => {
  const themeMode = useAuthStore((state) => state.theme);
  const theme = themeMode === 'dark' 
    ? {
        background: Typography.Colors.black,
        skeleton: '#2a2a2a',
        shimmer: '#3a3a3a',
      }
    : {
        background: Typography.Colors.white,
        skeleton: '#e0e0e0',
        shimmer: '#f0f0f0',
      };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={[1]} // Single item to render skeleton
        renderItem={() => null}
        ListHeaderComponent={() => (
          <SkeletonContent theme={theme} />
        )}
        ListFooterComponent={() => (
          <SkeletonFooter theme={theme} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const ShimmerEffect = ({ width: w, height: h, borderRadius = 0, style = {} }) => {
  const animatedValue = useSharedValue(0);
  
  const themeMode = useAuthStore((state) => state.theme);
  const theme = themeMode === 'dark' 
    ? {
        skeleton: '#2a2a2a',
        shimmer: '#3a3a3a',
      }
    : {
        skeleton: '#e0e0e0',
        shimmer: '#f0f0f0',
      };

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedValue.value,
      [0, 0.5, 1],
      [0.3, 1, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <View
      style={[
        {
          width: w,
          height: h,
          backgroundColor: theme.skeleton,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: theme.shimmer,
            borderRadius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const SkeletonContent = ({ theme }) => {
  return (
    <>
      {/* Header Skeleton */}
      <View style={[styles.headerSkeleton, { backgroundColor: theme.background }]}>
        <View style={styles.headerContent}>
          <ShimmerEffect width={120} height={20} borderRadius={4} />
          <ShimmerEffect width={40} height={40} borderRadius={20} />
        </View>
      </View>

      {/* Categories Skeleton */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoryMainContainer}>
          <ShimmerEffect width={65} height={65} borderRadius={32} />
          <ShimmerEffect width={80} height={16} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
        
        <View style={styles.categoryListContainer}>
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={() => (
              <View style={styles.categoryItem}>
                <ShimmerEffect width={62} height={62} borderRadius={31} />
                <ShimmerEffect width={50} height={14} borderRadius={4} style={{ marginTop: 8 }} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>

      {/* Carousel Skeleton */}
      <View style={styles.carouselContainer}>
        <ShimmerEffect width={width} height={344.67} borderRadius={0} />
        <View style={styles.dotsContainer}>
          {[1, 2, 3].map((_, index) => (
            <ShimmerEffect key={index} width={17} height={3} borderRadius={4} style={{ marginHorizontal: 4 }} />
          ))}
        </View>
      </View>

      {/* Trending Offers Skeleton */}
      <View style={styles.trendingContainer}>
        <ShimmerEffect width={140} height={24} borderRadius={4} style={{ marginLeft: 20, marginBottom: 15 }} />
        <FlatList
          data={[1, 2, 3]}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
          renderItem={() => (
            <View style={styles.trendingCard}>
              <ShimmerEffect width={160} height={120} borderRadius={8} />
              <View style={styles.cardContent}>
                <ShimmerEffect width={30} height={30} borderRadius={15} style={{ marginTop: 10 }} />
                <ShimmerEffect width={80} height={16} borderRadius={4} style={{ marginTop: 8 }} />
                <ShimmerEffect width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Deals of the Day Skeleton */}
      <View style={styles.dealsContainer}>
        <ShimmerEffect width={160} height={24} borderRadius={4} style={{ marginLeft: 20, marginBottom: 15 }} />
      </View>
    </>
  );
};

const SkeletonFooter = ({ theme }) => {
  return (
    <View style={styles.footerContainer}>
      {/* Deal Cards Grid Skeleton */}
      <View style={styles.dealGrid}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.dealCard}>
            <ShimmerEffect width="100%" height={180} borderRadius={8} />
            <View style={styles.dealCardContent}>
              <ShimmerEffect width="80%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
              <ShimmerEffect width="60%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Our Collection Skeleton */}
      <View style={styles.collectionContainer}>
        <ShimmerEffect width={140} height={24} borderRadius={4} style={{ marginBottom: 15 }} />
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={styles.productCard}>
            <ShimmerEffect width={120} height={120} borderRadius={8} />
            <View style={styles.productContent}>
              <ShimmerEffect width="100%" height={16} borderRadius={4} />
              <ShimmerEffect width="80%" height={14} borderRadius={4} style={{ marginTop: 4 }} />
              <View style={styles.priceContainer}>
                <ShimmerEffect width={60} height={14} borderRadius={4} />
                <ShimmerEffect width={40} height={12} borderRadius={4} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Skeleton
  headerSkeleton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop:40
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Categories Skeleton
  categoriesContainer: {
    paddingTop: 11,
    flexDirection: 'row',
  },
  categoryMainContainer: {
    paddingLeft: 8,
    flex: 0.18,
    alignItems: 'center',
  },
  categoryListContainer: {
    flex: 0.8,
  },
  categoryItem: {
    width: 90,
    alignItems: 'center',
    marginRight: 10,
  },

  // Carousel Skeleton
  carouselContainer: {
    paddingTop: 40,
    position: 'relative',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Trending Skeleton
  trendingContainer: {
    paddingTop: 20,
  },
  trendingCard: {
    width: 160,
  },
  cardContent: {
    alignItems: 'center',
  },

  // Deals Skeleton
  dealsContainer: {
    paddingTop: 20,
  },

  // Footer Skeleton
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 30,
  },
  dealCard: {
    width: '47%',
  },
  dealCardContent: {
    paddingHorizontal: 8,
  },

  // Collection Skeleton
  collectionContainer: {
    paddingTop: 20,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  productContent: {
    flex: 1,
    marginLeft: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default SkeletonLoader;