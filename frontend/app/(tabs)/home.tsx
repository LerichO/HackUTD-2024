import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Dropdown } from 'react-native-element-dropdown';
import TipsCarouselWithDots from '../carouselwithdots'; // Adjust path as needed

export default function Home() {
 const [value, setValue] = useState<string | null>(null);
 
 const data = [
   { label: 'Domestic', value: '1' },
   { label: 'Bonds', value: '2' },
   { label: 'Foreign', value: '3' },
 ];

 // In your Home component
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
  // Add more bonds data...
];

const foreignTips = [
  {
    title: "Global Market Index",
    description: "MSCI World Index Performance",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        data: [100, 102, 104, 101, 105, 108]
      }]
    }
  },
  // Add more foreign investment data...
];
 
  const getCurrentTips = () => {
    switch(value) {
      case '1': return domesticTips;
      case '2': return bondsTips;
      case '3': return foreignTips;
      default: return [];
    }
  };

  
 return (
    <SafeAreaView style={tw`flex-1 bg-[#8AC8D0]`}>
      <ScrollView  
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-40`}
        showsVerticalScrollIndicator={true}
      >    
        <View style={[tw``, { backgroundColor: '#8AC8D0' }]}>
          <Text style={[tw`text-4xl font-bold text-center mt-8`, { color: '#000000' }]}>
            BRIDGE
          </Text>
          <Text style={[tw`text-2xl text-center mt-4 mb-4`, {color: '#000000'}]}>
            Building Paths To Financial Freedom
          </Text>
        </View>

        {/* Investment Selection Section */}
       <View style={tw`w-[90%] mx-auto my-8`}>
        <View style={tw`p-4`}>
          <Dropdown
            style={tw`p-2 bg-white rounded`}
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
          
          

        <View style={[tw` mb-8`, { backgroundColor: '#8AC8D0' }]}>
          <Text style={[tw`text-4xl font-bold text-center mt-8`, { color: '#000000' }]}>
            BRIDGE
          </Text>
          <Text style={[tw`text-2xl text-center mt-4 mb-4`, {color: '#000000'}]}>
            Building Paths To Financial Freedom
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
 );
}