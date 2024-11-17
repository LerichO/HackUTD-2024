import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import tw from 'twrnc';
import { Dropdown } from 'react-native-element-dropdown';
import { LineChart } from 'react-native-chart-kit';
import { useFonts } from 'expo-font';
import SavingsFeature from '../savingsfeature';

export default function Home() {
  const [value, setValue] = useState<string>('1');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [isLoadingGraphs, setIsLoadingGraphs] = useState(false);

  const [fontsLoaded] = useFonts({
    'Nerko-One': require('../../assets/fonts/NerkoOne-Regular.ttf'),
    'Gilroy': require('../../assets/fonts/Gilroy-Regular.otf'),
  });

  const data = [
    { label: 'Domestic', value: '1' },
    { label: 'Bonds', value: '2' },
  ];

  const screenWidth = Dimensions.get('window').width;

  // Fetch tips dynamically based on the selected investment type
  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://hackutd-2024-flask-server.onrender.com/api/stocks/all/${value}`);
        const json = await response.json();
        setTips(json.tips || []);
      } catch (error) {
        console.error('Error fetching tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [value]);

  // Fetch graph data for multiple top companies
  const fetchGraphData = async (symbol: string) => {
    try {
      const response = await fetch(`https://hackutd-2024-flask-server.onrender.com/api/stocks/all/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        return (
          data?.data?.map((entry: any) => ({
            date: entry.date,
            close: entry.close,
          })) || []
        );
      } else {
        console.error(`Graph API Error for ${symbol}: ${response.status}`);
        return [];
      }
    } catch (err) {
      console.error(`Error fetching graph data for ${symbol}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingGraphs(true);
      try {
        const response = await fetch('https://hackutd-2024-flask-server.onrender.com/api/stocks/all');
        const result = await response.json();
        const topCompanies = result.data?.top_companies || [];

        const newGraphData: any = {};
        for (const company of topCompanies) {
          const graph = await fetchGraphData(company.symbol);
          newGraphData[company.symbol] = graph;
        }
        setGraphData(newGraphData);
      } catch (err) {
        console.error('Error fetching graph data:', err);
      } finally {
        setIsLoadingGraphs(false);
      }
    };

    fetchData();
  }, []);

  const formatGraphData = (data: any) => {
    return {
      labels: data.map((entry: any) => entry.date).slice(-5), // Display the last 5 dates
      datasets: [
        {
          data: data.map((entry: any) => entry.close).slice(-5), // Display the last 5 closing prices
          strokeWidth: 2, // Optional line thickness
        },
      ],
    };
  };

  const renderGraphItem = ({ item }: { item: [string, any] }) => {
    const [symbol, graph] = item;
    return (
      <View style={tw`mx-4`}>
        <Text style={tw`text-lg font-bold text-center`}>
          {symbol} Stock Price
        </Text>
        {graph.length ? (
          <LineChart
            data={formatGraphData(graph)}
            width={screenWidth * 0.8} // Adjust the graph width to fit the horizontal layout
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#f7f7f7',
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={tw`text-sm text-center text-red-500`}>
            No data available for {symbol}.
          </Text>
        )}
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#8AC8D0]`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-40`}
        showsVerticalScrollIndicator={true}
      >
        <View style={[tw``, { backgroundColor: '#8AC8D0' }]}>
          <Text style={[
            tw`text-4xl font-bold text-center mt-8`,
            {
              color: '#ffffff',
              fontFamily: 'Nerko-One',
            },
          ]}
          >
            BRIDGE
          </Text>
          <Text style={[
            tw`text-2xl text-center mt-4 mb-4`,
            {
              color: '#000000',
              fontFamily: 'Gilroy',
            },
          ]}
          >
            Building Paths To Financial Freedom
          </Text>
        </View>

        {/* Investment Selection Section */}
        <View style={tw`w-[90%] mx-auto my-8`}>
          <View style={tw`p-4`}>
            <Dropdown
              style={[
                tw`p-2 bg-white rounded`,
                { fontFamily: 'Gilroy' },
              ]}
              placeholderStyle={{ fontFamily: 'Gilroy' }}
              selectedTextStyle={{ fontFamily: 'Gilroy' }}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Investment Type"
              value={value}
              onChange={(item) => setValue(item.value)}
            />
          </View>

          {loading ? (
            <Text style={tw`text-center text-lg`}>Loading tips...</Text>
          ) : (
            <View style={tw`w-full items-center justify-center`}>
              {/* Replace this with your TipsCarouselWithDots */}
              <Text>Tips Carousel Placeholder</Text>
            </View>
          )}
        </View>

        {/* Graph Data in Horizontal Recycler View */}
        <View style={tw`w-full my-8`}>
          {isLoadingGraphs ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={Object.entries(graphData)}
              renderItem={renderGraphItem}
              keyExtractor={(item) => item[0]}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4`}
            />
          )}
        </View>
        {/* Savings Feature */}
        <SavingsFeature
          width={200}
          height={200}
          initialSavings={0}
          onSavingsUpdate={(amount) => {
            console.log('New savings amount:', amount);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
