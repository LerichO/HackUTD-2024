import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.8;

// Replace this with your Alpha Vantage API key
const API_KEY = '0XBKOO31KEU6B1R4';
const BASE_URL = 'https://www.alphavantage.co/query';

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

const chartConfig = {
  backgroundGradientFrom: '#4E6766',
  backgroundGradientTo: '#4E6766',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
};

// Categories for low-risk options
const categories = {
  Domestic: ['AAPL', 'MSFT', 'GOOG'],
  Foreign: ['TSM', 'BABA', 'NIO'],
  Bonds: ['T-Bill', 'Municipal', 'Corporate Bond'], // Bonds will use mock data for demonstration
};

// Fetch live market data for a symbol using Alpha Vantage API
const fetchLiveMarketData = async (symbol: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
        apikey: API_KEY,
      },
    });

    console.log(`API Response for ${symbol}:`, response.data);

    const timeSeries = response.data['Time Series (5min)'];
    if (!timeSeries) {
      console.warn(`No time series data for ${symbol}`);
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labels = Object.keys(timeSeries).slice(0, 10).reverse();
    const datasets = [
      {
        data: labels.map((key) => parseFloat(timeSeries[key]['4. close'])),
      },
    ];

    return { labels, datasets };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error fetching live data for ${symbol}:`, error.message);
    } else if (error instanceof Error) {
      console.error(`General error fetching live data for ${symbol}:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return { labels: [], datasets: [{ data: [] }] }; // Fallback data
  }
};

// Mock data for bonds (as Alpha Vantage doesn't handle bonds)
const generateMockData = () => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
    },
  ],
});

const LowRiskOptionsWithLiveData = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>('Domestic');
  const [tipsAndGuides, setTipsAndGuides] = useState<TipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Fetch data for the selected category
  const fetchLiveDataForCategory = async () => {
    setLoading(true);

    try {
      const data = await Promise.all(
        categories[selectedCategory].map((symbol) =>
          selectedCategory === 'Bonds'
            ? Promise.resolve(generateMockData()) // Mock data for bonds
            : fetchLiveMarketData(symbol) // API data for Domestic and Foreign categories
        )
      );

      const parsedData = categories[selectedCategory].map((symbol, index) => ({
        title: `${symbol} Performance`,
        description: `Trends for ${symbol} in the ${selectedCategory} category.`,
        data: data[index].datasets[0].data.length ? data[index] : generateMockData(), // Fallback to mock data
      }));

      setTipsAndGuides(parsedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching category data:', error.message);
      } else if (error instanceof Error) {
        console.error('General error fetching category data:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDataForCategory();
  }, [selectedCategory]);

  const renderItem = ({ item }: { item: TipItem }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <LineChart
          data={item.data}
          width={ITEM_WIDTH - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  const dotPosition = Animated.divide(scrollX, SCREEN_WIDTH);

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {Object.keys(categories).map((category) => (
          <Text
            key={category}
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextSelected,
            ]}
            onPress={() => setSelectedCategory(category as keyof typeof categories)}
          >
            {category}
          </Text>
        ))}
      </View>

      <FlatList
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
        style={styles.flatList}
      />
      <View style={styles.dotContainer}>
        {tipsAndGuides.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: dotPosition.interpolate({
                  inputRange: [i - 1, i, i + 1],
                  outputRange: ['#aaa', '#fff', '#aaa'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#4E6766',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  categoryText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
  },
  categoryTextSelected: {
    backgroundColor: '#FFF',
    color: '#4E6766',
    fontWeight: 'bold',
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#4E6766',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E6766',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 16,
  },
  flatList: {
    width: SCREEN_WIDTH,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default LowRiskOptionsWithLiveData;
