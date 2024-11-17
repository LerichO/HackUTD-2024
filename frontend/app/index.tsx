import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Stack, router } from 'expo-router';
import tw from 'twrnc';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import { useFonts } from 'expo-font';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [fontsLoaded] = useFonts({
  'Nerko-One': require('../assets/fonts/NerkoOne-Regular.ttf'),
  'Gilroy': require('../assets/fonts/Gilroy-Regular.otf'),
});

  const playSnortingSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/pig-oink.mp3') // Ensure this path is correct
      );
      setSound(sound); // Save the sound instance
      await sound.playAsync(); // Play the sound
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error playing sound:', error.message); // Log the error message
      } else {
        console.error('Unknown error occurred while playing sound:', error); // Handle unknown errors
      }
    }
  };
  

  // Cleanup sound instance on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Release the sound resource
      }
    };
  }, [sound]);

  // Manage loading and sound playback
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      playSnortingSound(); // Play sound when loading completes
    }, 3000);

    return () => clearTimeout(loadingTimeout); // Clear timeout on unmount
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

  if (!fontsLoaded) {
  return null;
}

 
  return (
    <View style={tw`flex-1`}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={tw`flex-1`}>
        <View style={[tw`h-[50%]`, { backgroundColor: '#4E6766' }]}>
          <Text style={[tw`text-5xl font-bold text-center mt-10`, { color: '#000000', fontFamily: 'Nerko-One' }]}>
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
            <Text style={[tw`text-2xl font-bold mb-2 text-center`, { color: '#4E6766', fontFamily: 'Nerko-One' }]}>
              Mission:
            </Text>
            <Text style={[tw`text-lg leading-6 text-center`, { color: '#4E6766', fontFamily: 'Gilroy' }]}>
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
                <Text style={[tw`text-white text-lg font-semibold`, { fontFamily: 'Gilroy' }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  tw`rounded-full py-3 px-12`,
                  { backgroundColor: '#FF8784' }
                ]}
                onPress={handleSignUp}
              >
                <Text style={[tw`text-white text-lg font-semibold`, { fontFamily: 'Gilroy' }]}>Sign Up</Text>
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
