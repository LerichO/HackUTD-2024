import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Alert,
} from 'react-native';

const TaxEstimator = () => {
  const [income, setIncome] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [estimatedTax, setEstimatedTax] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateTax = () => {
    Keyboard.dismiss(); // Dismiss the keyboard after clicking the button

    // Validation
    if (!income || !taxRate) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    const incomeValue = parseFloat(income);
    const taxRateValue = parseFloat(taxRate);

    if (isNaN(incomeValue) || isNaN(taxRateValue)) {
      setErrorMessage('Both inputs must be numeric.');
      return;
    }

    if (incomeValue < 0 || taxRateValue < 0) {
      setErrorMessage('Inputs cannot be negative.');
      return;
    }

    // Reset error message and calculate tax
    setErrorMessage('');
    const tax = (incomeValue * taxRateValue) / 100;
    setEstimatedTax(tax);
  };

  const resetFields = () => {
    setIncome('');
    setTaxRate('');
    setEstimatedTax(null);
    setErrorMessage('');
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tax Estimator</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Income ($):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your income"
          value={income}
          onChangeText={setIncome}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tax Rate (%):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter tax rate"
          value={taxRate}
          onChangeText={setTaxRate}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={calculateTax}>
        <Text style={styles.buttonText}>Calculate Tax</Text>
      </TouchableOpacity>

      {estimatedTax !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Estimated Tax: ${estimatedTax.toFixed(2)}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetFields}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#8AC8D0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 23,
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF8784',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: '#4E6766',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  resultText: {
    fontSize: 18,
    color: '#155724',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default TaxEstimator;
