import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const logo = require("../assets/images/FundeeIcon.png");
const SignUpPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Bridge</Text>
      {/* Add Logo */}
      <Image source={logo} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Username" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign-Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={styles.linkText}>Create One Here</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 35, // Adjust for spacing
  },
  headerTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10, // Centered text
  },
  logo: {
    width: 190, // Adjust width to fit the design
    height: 150, // Adjust height to fit the design
  },
  formContainer: {
    backgroundColor: "#A8DADC",
    width: "100%",
    height: "80%", // Adjust width to make it more compact
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 15,
  },
  input: {
    width: "95%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFF", // Matches the design
    borderRadius: 30, // Rounded corners
    backgroundColor: "#FFF",
    color: "#000",
  },
  button: {
    backgroundColor: "#FF8784",
    paddingVertical: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 15,
    borderRadius: 30, // Rounded corners
    width: "100%",
    justifyContent: "center",
    marginVertical: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#000",
  },
  linkText: {
    color: "#1D3557",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
