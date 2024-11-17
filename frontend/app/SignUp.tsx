import { router, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useFonts } from 'expo-font';
import tw from 'twrnc';
import CustomLoadingIndicator from "./CustomLoadingIndicator";

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [fontsLoaded] = useFonts({
    'Nerko-One': require('../assets/fonts/NerkoOne-Regular.ttf'),
    'Gilroy': require('../assets/fonts/Gilroy-Regular.otf'),
  });

  const logo = require("../assets/images/FundeeIcon.png");
  const logo2 = require("../assets/images/Google.png");

  // Manage loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout); // Clear timeout on unmount
  }, []);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  const handleSignUp = () => {
    router.push('/(tabs)/home');
  };

  if (!fontsLoaded) {
    return null;
  }

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
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity 
        style={tw`absolute top-12 left-4`}
        onPress={() => router.back()}
      >
        <Text style={tw`text-3xl`}>←</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Bridge</Text>
      <Image 
        source={logo} 
        style={styles.logo}
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign-Up</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your preferred username"
          />
          <Text style={styles.helperText}>Choose a unique username for your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            secureTextEntry 
          />
          <Text style={styles.helperText}>Use 8+ characters with mix of letters, numbers & symbols</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            secureTextEntry
          />
          <Text style={styles.helperText}>Re-enter your password to confirm</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign-Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={logo2} style={styles.logo2} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.linkText}>Login Here</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8AC8D0',
  },
  headerTitle: {
    fontFamily: 'Nerko-One',
    fontSize: 50,
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 190,
    height: 150,
  },
  logo2: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  formContainer: {
    backgroundColor: "#A8DADC",
    width: "100%",
    height: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: 'Nerko-One',
    fontSize: 40,
    color: "#ffffff",
    marginBottom: 25,
  },
  inputContainer: {
    width: "95%",
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Gilroy',
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
    paddingLeft: 15,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 30,
    backgroundColor: "#FFF",
    color: "#000",
    fontFamily: 'Gilroy',
  },
  helperText: {
    fontFamily: 'Gilroy',
    fontSize: 12,
    color: "#1D3557",
    paddingLeft: 15,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#FF8784",
    paddingVertical: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: 'Gilroy',
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 15,
    borderRadius: 30,
    width: "85%",
    justifyContent: "center",
    marginVertical: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#000",
    fontFamily: 'Gilroy',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#000",
    fontFamily: 'Gilroy',
  },
  linkText: {
    color: "#1D3557",
    fontFamily: 'Gilroy',
    textDecorationLine: "underline",
  },
});

export default SignUpPage;