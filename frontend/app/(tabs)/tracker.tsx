import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Audio } from 'expo-av'; // Import the Audio module from expo-av

interface FinancialEntry {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  groupId?: string;
}

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Uncategorized');
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddIncome = async () => {
    if (amount.trim()) {
      const newEntry: FinancialEntry = {
        id: Math.random().toString(),
        amount: parseFloat(amount),
        type: 'income',
        category,
        groupId: Math.random().toString(),
      };
      setEntries([...entries, newEntry]);
      setAmount('');
      setCategory('Uncategorized');

      // Play the cash register sound
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/cash-register-purchase.mp3') // Add your sound file to the assets folder
        );
        await sound.playAsync();
        // Optionally unload the sound after playing
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }
  };

  const handleAddExpense = () => {
    if (amount.trim()) {
      const newEntry: FinancialEntry = {
        id: Math.random().toString(),
        amount: parseFloat(amount),
        type: 'expense',
        category,
        groupId: Math.random().toString(),
      };
      setEntries([...entries, newEntry]);
      setAmount('');
      setCategory('Uncategorized');
    }
  };

  const mergeEntries = (
    source: FinancialEntry,
    target: FinancialEntry,
    newCategory: string
  ) => {
    const targetGroupId = target.groupId || target.id;

    const updatedEntries = entries.map((entry) => {
      if (entry.groupId === source.groupId || entry.id === source.id) {
        return { ...entry, groupId: targetGroupId, category: newCategory };
      }
      return entry;
    });

    const targetEntryIndex = updatedEntries.findIndex((entry) => entry.id === target.id);
    if (targetEntryIndex >= 0) {
      updatedEntries[targetEntryIndex] = {
        ...updatedEntries[targetEntryIndex],
        amount: updatedEntries[targetEntryIndex].amount + source.amount,
        category: newCategory,
      };
    }

    return updatedEntries.filter((entry) => entry.id !== source.id);
  };

  const onDragEnd = ({ data, from, to }: any) => {
    const source = entries[from];
    const target = entries[to];

    if (source && target && source.groupId !== target.groupId) {
      Alert.prompt(
        'Merge Categories',
        'Enter a new category name for the grouped items:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (newCategory) => {
              if (newCategory) {
                const mergedEntries = mergeEntries(source, target, newCategory);
                setEntries(mergedEntries);
              }
            },
          },
        ],
        'plain-text',
        target.category || 'New Group'
      );
    } else {
      setEntries(data);
    }
  };

  const getGroupedEntries = (): FinancialEntry[] => {
    const groupedMap = entries.reduce((acc, entry) => {
      const groupId = entry.groupId || entry.id;
      if (!acc[groupId]) {
        acc[groupId] = { ...entry, amount: 0 };
      }
      acc[groupId].amount += entry.amount;
      return acc;
    }, {} as { [key: string]: FinancialEntry });

    return Object.values(groupedMap);
  };

  const netWorth = entries.reduce(
    (sum, e) => (e.type === 'income' ? sum + e.amount : sum - e.amount),
    0
  );

  const groupedBreakdown = entries.reduce(
    (acc, entry) => {
      acc[entry.type].push(entry);
      return acc;
    },
    { income: [] as FinancialEntry[], expense: [] as FinancialEntry[] }
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.header}>Irregular Income and Expense Tracker</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Enter category"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={handleAddIncome}
            >
              <Text style={styles.buttonText}>Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#F44336' }]}
              onPress={handleAddExpense}
            >
              <Text style={styles.buttonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subHeader}>Drag and Drop to Reorder or Group:</Text>
          <DraggableFlatList
            data={getGroupedEntries()}
            renderItem={({ item, drag }) => (
              <TouchableOpacity onLongPress={drag} style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    item.type === 'income' ? styles.incomeText : styles.expenseText,
                  ]}
                >
                  {item.type === 'expense' ? '- ' : ''}
                  ${item.amount.toFixed(2)} - {item.category || 'Uncategorized'}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            onDragEnd={onDragEnd}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text
              style={[
                styles.netWorth,
                netWorth >= 0 ? styles.positiveNetWorth : styles.negativeNetWorth,
              ]}
            >
              Net Worth: ${netWorth.toFixed(2)}
            </Text>
          </TouchableOpacity>
          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>Net Worth Breakdown</Text>
              <Text style={styles.breakdownHeader}>Income</Text>
              <FlatList
                data={groupedBreakdown.income}
                renderItem={({ item }) => (
                  <Text style={styles.modalText}>
                    ${item.amount.toFixed(2)} - {item.category || 'Uncategorized'}
                  </Text>
                )}
                keyExtractor={(item) => item.id}
              />
              <Text style={styles.breakdownHeader}>Expense</Text>
              <FlatList
                data={groupedBreakdown.expense}
                renderItem={({ item }) => (
                  <Text style={styles.modalText}>
                    -${item.amount.toFixed(2)} - {item.category || 'Uncategorized'}
                  </Text>
                )}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#8AC8D0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    marginVertical: 8,
    padding: 15,
    backgroundColor: '#e6f2ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007acc',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  incomeText: {
    color: 'green',
    fontWeight: 'bold',
  },
  expenseText: {
    color: 'red',
    fontWeight: 'bold',
  },
  netWorth: {
    marginTop: 20,
    marginBottom: 90,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    textAlign: 'center',
  },
  positiveNetWorth: {
    color: 'green',
  },
  negativeNetWorth: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginTop: '20%',
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  breakdownHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
