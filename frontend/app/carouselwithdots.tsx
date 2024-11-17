import React, { useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Dimensions, 
  ViewToken, 
  Animated
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import tw from 'twrnc';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.8; 

type TipItem = {
  title: string;
  description: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
};

type Props = {
  tipsAndGuides: TipItem[];
  onIndexChange?: (index: number) => void;
};

const TipsCarouselWithDots = ({ tipsAndGuides, onIndexChange }: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0] && onIndexChange) {
      onIndexChange(viewableItems[0].index || 0);
    }
  }, [onIndexChange]);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const renderItem = ({ item, index }: { item: TipItem; index: number }) => {
    const position = Animated.subtract(index * SCREEN_WIDTH, scrollX);
    const isDisappearing = position.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0.5, 1, 0.5]
    });
    
    const scale = isDisappearing.interpolate({
      inputRange: [0.5, 1],
      outputRange: [0.92, 1]
    });
    const translateY = position.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [15, 0, 15]
    });

    const chartConfig = {
      backgroundGradientFrom: '#4E6766',
      backgroundGradientTo: '#4E6766',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false
    };

    return (
      <View style={{ width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            opacity: isDisappearing,
            transform: [{ scale }, { translateY }],
            width: ITEM_WIDTH,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View
            style={[
              tw`rounded-3xl`,
              {
                width: '100%',
                backgroundColor: '#4E6766',
                padding: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            <Text 
              style={[
                tw`text-2xl font-bold mt-1 text-center`,
                { color: 'white', width: '100%' }
              ]}
            >
              {item.title}
            </Text>
            <Text 
              style={[
                tw`text-base mb-2 text-center`,
                { color: 'white', width: '100%' }
              ]}
            >
              {item.description}
            </Text>
            <View style={tw`items-center justify-center w-full`}>
              <LineChart
                data={item.data}
                width={ITEM_WIDTH - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };
  
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <FlatList
        ref={flatListRef}
        data={tipsAndGuides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={{ width: SCREEN_WIDTH }}
      />
    </View>
  );
};

export default TipsCarouselWithDots;