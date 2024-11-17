import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import tw from 'twrnc';

interface SavingsFeatureProps {
  width: number;
  height: number;
  initialSavings?: number;
  onSavingsUpdate?: (amount: number) => void;
}

const SavingsFeature: React.FC<SavingsFeatureProps> = ({
  width,
  height,
  initialSavings = 0,
  onSavingsUpdate,
}) => {
  const [currentSavings, setCurrentSavings] = useState(initialSavings);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add');
  const [tempGoal, setTempGoal] = useState('');

  // Calculate fill percentage
  const fillPercentage = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;
  const clampedFillPercentage = Math.min(100, Math.max(0, fillPercentage));

  const handleActionPress = (type: 'add' | 'withdraw') => {
    if (savingsGoal <= 0) {
      Alert.alert(
        "No Goal Set",
        "Please set a savings goal before adding or withdrawing money.",
        [{ text: "OK" }]
      );
      return;
    }
    setActionType(type);
    setShowActionModal(true);
  };

  const handleSavingsAction = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (actionType === 'add') {
      const newSavings = currentSavings + amount;
      setCurrentSavings(newSavings);
      
      // Check if goal is reached and show alert
      if (savingsGoal > 0 && newSavings >= savingsGoal) {
        Alert.alert(
          "Congratulations! 🎉",
          `You've reached your savings goal! Your new goal is $${(savingsGoal + 50).toFixed(2)}!`,
          [{ text: "Continue", onPress: () => setSavingsGoal(savingsGoal + 50) }]
        );
      }
    } else {
      if (currentSavings >= amount) {
        setCurrentSavings(prev => prev - amount);
      } else {
        Alert.alert("Insufficient Savings", "You don't have enough savings to withdraw this amount.");
        return;
      }
    }

    setInputAmount('');
    setShowActionModal(false);
  };

  const handleSetGoal = () => {
    const newGoal = parseFloat(tempGoal);
    if (isNaN(newGoal) || newGoal <= 0) {
      Alert.alert("Invalid Goal", "Please enter a valid goal amount.");
      return;
    }

    setSavingsGoal(newGoal);
    
    // Check if current savings already exceed new goal
    if (currentSavings >= newGoal) {
      Alert.alert(
        "Congratulations! 🎉",
        `You've already reached this goal! Your new goal is $${(newGoal + 50).toFixed(2)}!`,
        [{ text: "Continue", onPress: () => setSavingsGoal(newGoal + 50) }]
      );
    }
    
    setTempGoal('');
    setShowGoalModal(false);
  };

  return (
    <View style={tw`items-center`}>
      {/* Savings Visualization Container */}
      <View style={[styles.imageContainer, { width, height }]}>
        {/* Filled pig (clipped) */}
        <Image
          source={require('../assets/images/goldenPig.png')}
          style={[styles.image, { width, height }]}
          resizeMode="contain"
        />
        {/* Mask that covers the unfilled portion */}
        <View 
          style={[
            styles.mask, 
            { 
              height: `${100 - clampedFillPercentage}%`,
              backgroundColor: '#8AC8D0'
            }
          ]} 
        />
        {/* Transparent overlay pig */}
        <Image
          source={require('../assets/images/goldenPig.png')}
          style={[styles.overlayImage, { 
            width, 
            height, 
            opacity: 0.3,
          }]}
          resizeMode="contain"
        />
      </View>

      <View style={tw`mt-4 items-center`}>
        <Text style={tw`text-lg font-bold`}>Current Savings: ${currentSavings.toFixed(2)}</Text>
        {savingsGoal > 0 && (
          <Text style={tw`text-base`}>Goal: ${savingsGoal.toFixed(2)} ({clampedFillPercentage.toFixed(1)}%)</Text>
        )}
      </View>

      <View style={tw`flex-row mt-4 justify-center gap-2`}>
        <TouchableOpacity
          style={[tw`px-4 py-2 rounded-full`, { backgroundColor: '#FF8784' }]}
          onPress={() => handleActionPress('add')}
        >
          <Text style={tw`text-white font-semibold`}>Add Savings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[tw`px-4 py-2 rounded-full`, { backgroundColor: '#4E6766' }]}
          onPress={() => handleActionPress('withdraw')}
        >
          <Text style={tw`text-white font-semibold`}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[tw`px-4 py-2 rounded-full`, { backgroundColor: '#8AC8D0' }]}
          onPress={() => setShowGoalModal(true)}
        >
          <Text style={tw`text-white font-semibold`}>Set Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Action Modal (Add/Withdraw) */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-2xl w-80`}>
            <Text style={tw`text-xl font-bold mb-4`}>
              {actionType === 'add' ? 'Add to Savings' : 'Withdraw from Savings'}
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={inputAmount}
              onChangeText={setInputAmount}
            />
            <View style={tw`flex-row justify-end gap-2`}>
              <TouchableOpacity
                onPress={() => {
                  setShowActionModal(false);
                  setInputAmount('');
                }}
                style={tw`px-4 py-2`}
              >
                <Text style={tw`text-gray-600`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavingsAction}
                style={[tw`px-4 py-2 rounded-lg`, { backgroundColor: '#FF8784' }]}
              >
                <Text style={tw`text-white font-semibold`}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Set Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="slide"
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-2xl w-80`}>
            <Text style={tw`text-xl font-bold mb-4`}>Set Savings Goal</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
              placeholder="Enter goal amount"
              keyboardType="numeric"
              value={tempGoal}
              onChangeText={setTempGoal}
            />
            <View style={tw`flex-row justify-end gap-2`}>
              <TouchableOpacity
                onPress={() => {
                  setShowGoalModal(false);
                  setTempGoal('');
                }}
                style={tw`px-4 py-2`}
              >
                <Text style={tw`text-gray-600`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSetGoal}
                style={[tw`px-4 py-2 rounded-lg`, { backgroundColor: '#FF8784' }]}
              >
                <Text style={tw`text-white font-semibold`}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#8AC8D0',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8AC8D0',
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#8AC8D0',
  },
});

export default SavingsFeature;