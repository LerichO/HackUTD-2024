import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Dropdown } from 'react-native-element-dropdown';
import TipsCarouselWithDots from '../carouselwithdots'; // Ensure this path is correct
import SavingsFeature from '../savingsfeature';
import { useFonts } from 'expo-font';

export default function Home() {
  const [value, setValue] = useState<string | undefined>(undefined); // Changed null to undefined for the correct type

 const [fontsLoaded] = useFonts({
    'Nerko-One': require('../../assets/fonts/NerkoOne-Regular.ttf'),
    'Gilroy': require('../../assets/fonts/Gilroy-Regular.otf'),
  });

  const data = [
    { label: 'Domestic', value: '1' },
    { label: 'Bonds', value: '2' },
  ];

  // Domestic tips
  const domesticTips = [
    {
      title: "US Stock Market Performance",
      description: "S&P 500 Monthly Returns",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          data: [100, 105, 103, 108, 112, 115]
        }]
      }
    },
    {
      title: "401k Growth Projection",
      description: "Average Account Balance Growth",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          data: [50000, 52000, 54000, 55500, 57000, 59000]
        }]
      }
    },
    {
      title: "Dividend Yields",
      description: "Average Dividend Percentage",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          data: [2.5, 2.7, 2.6, 2.8, 2.9, 3.0]
        }]
      }
    }
  ];

  // Bonds tips
  const bondsTips = [
    {
      title: "Treasury Yields",
      description: "10-Year Treasury Yield Trend",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          data: [3.5, 3.6, 3.8, 3.7, 3.9, 4.0]
        }]
      }
    },
    // Add more bonds data if needed...
  ];

  // Function to get current tips based on selected investment
  const getCurrentTips = () => {
    switch(value) {
      case '1': return domesticTips;
      case '2': return bondsTips;
      default: return [];
    }
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
              fontFamily: 'Nerko-One'
            }
          ]}>
            BRIDGE
          </Text>
          <Text style={[
            tw`text-2xl text-center mt-4 mb-4`, 
            {
              color: '#000000',
              fontFamily: 'Gilroy'
            }
          ]}>
            Building Paths To Financial Freedom
          </Text>
        </View>

        {/* Investment Selection Section */}
        <View style={tw`w-[90%] mx-auto my-8`}>
          <View style={tw`p-4`}>
            <Dropdown
              style={[
                tw`p-2 bg-white rounded`,
                { fontFamily: 'Gilroy' }
              ]}
              placeholderStyle={{ fontFamily: 'Gilroy' }}
              selectedTextStyle={{ fontFamily: 'Gilroy' }}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Investment Type"
              value={value}
              onChange={item => setValue(item.value)}
            />
          </View>
          
          {value && (
            <View style={tw`w-full items-center justify-center`}>
              <TipsCarouselWithDots 
                tipsAndGuides={getCurrentTips()}
                onIndexChange={(index) => {
                  console.log('Current tip index:', index);
                }}
              />
            </View>
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
