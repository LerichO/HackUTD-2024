import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions} from 'react-native';
import { Stack, router } from 'expo-router';
import tw from 'twrnc';
import CustomLoadingIndicator from './CustomLoadingIndicator';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Add Stack.Screen to hide the header
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  const handleLogin = () => {
    router.push('/Login');
  };

  const handleSignUp = () => {
    router.push('/SignUp');
  };

  if (!showContent) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <CustomLoadingIndicator
          imageSource={require('../assets/images/regularPig.png')}
          width={200}
          height={200}
          isLoading={isLoading}
          onExitComplete={handleLoadingComplete}
          direction="top-to-bottom"
          duration={1500}
        />
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={tw`flex-1`}>
        <View style={[tw`h-[50%]`, { backgroundColor: '#4E6766' }]}>
          <Text style={[tw`text-5xl font-bold text-center mt-10`, { color: '#000000' }]}>
            BRIDGE
          </Text>
          <Image 
            source={require('../assets/images/moneyPig.png')}
            style={tw`w-60 h-60 mt-4 self-center`}
            resizeMode="contain"
          />
        </View>
        <View style={[tw`h-[50%]`, { backgroundColor: '#8AC8D0' }]}>
          <View style={tw`px-6 pt-8 items-center`}>
            <Text style={[tw`text-2xl font-bold mb-2 text-center`, { color: '#4E6766' }]}>
              Mission:
            </Text>
            <Text style={[tw`text-lg leading-6 text-center`, { color: '#4E6766' }]}>
              Bridging the gap in financial services by providing accessible, user-friendly banking 
              solutions for everyone. We empower individuals who face barriers to traditional banking, 
              ensuring financial inclusion and prosperity for all communities.
            </Text>
          </View>

          <View style={tw`flex-1 justify-end mb-20`}>
            <View style={tw`flex-row justify-center gap-8`}>
              <TouchableOpacity 
                style={[
                  tw`rounded-full py-3 px-12`,
                  { backgroundColor: '#FF8784' }
                ]}
                onPress={handleLogin}
              >
                <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  tw`rounded-full py-3 px-12`,
                  { backgroundColor: '#FF8784' }
                ]}
                onPress={handleSignUp}
              >
                <Text style={tw`text-white text-lg font-semibold`}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
      
      <View 
        style={[
          tw`absolute w-full items-center`, 
          { 
            top: '42.3%', 
            zIndex: 10,
            left: -20,
            right: -20,
            width: SCREEN_WIDTH + 40,
          }
        ]}
      >
        <Image 
          source={require('../assets/images/bridgeIcon.png')}
          style={{
            width: SCREEN_WIDTH + 40,
            height: 80,
          }}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2D5BA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8AC8D0',
  },
});