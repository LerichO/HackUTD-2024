import { useFonts } from 'expo-font';
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { GiftedChat, Bubble, IMessage } from 'react-native-gifted-chat';

const ChatbotPage: React.FC = () => {
const [fontsLoaded] = useFonts({
    'Nerko-One': require('../../assets/fonts/NerkoOne-Regular.ttf'),
    'Gilroy': require('../../assets/fonts/Gilroy-Regular.otf'),
  });

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // Function to initialize with a welcome message
  const initializeMessages = () => {
    setMessages([
      {
        _id: 1,
        text: 'Welcome to the financial chatbot! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: '../../assets/images/moneyPig.png',
        },
      },
    ]);
  };

  // Initialize with a welcome message on component mount
  React.useEffect(() => {
    initializeMessages();
  }, []);

  // Function to handle sending messages
  const onSend = useCallback(() => {
    if (inputText.trim() === '') return;

    const newMessage = {
      _id: Math.random().toString(),
      text: inputText,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
    setInputText(''); // Clear input field

    // Simulate bot response with basic financial queries
    setTimeout(() => {
      const responseText = generateFinancialResponse(newMessage.text);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(),
            text: responseText,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Chatbot',
              avatar: '../../assets/images/moneyPig.png',
            },
          },
        ])
      );
    }, 1000);
  }, [inputText]);

  // Function to generate a financial response based on the user's query
  const generateFinancialResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();

    // Hardcoded basic financial responses
    if (query.includes('loan')) {
      return 'A loan is money borrowed that is expected to be paid back with interest. The main factors involved are the loan amount, interest rate, and repayment period.';
    }
    if (query.includes('interest')) {
      return 'Interest is the cost of borrowing money, typically expressed as an annual percentage rate (APR). It’s calculated based on the principal amount, the interest rate, and the duration of the loan.';
    }
    if (query.includes('compound interest')) {
      return 'Compound interest is calculated on both the initial principal and the accumulated interest. The formula for compound interest is: A = P(1 + r/n)^(nt), where A is the amount, P is the principal, r is the interest rate, t is the time, and n is the number of compounding periods per year.';
    }
    if (query.includes('simple interest')) {
      return 'Simple interest is calculated using the formula: Interest = Principal × Rate × Time. For example, if you borrow $100 at a 5% interest rate for 3 years, your interest is $15.';
    }
    if (query.includes('stock')) {
      return 'I can’t provide real-time stock prices, but you can check them on any financial news website or use a stock tracking app like Google Finance or Yahoo Finance.';
    }
    if (query.includes('budget')) {
      return 'A budget is a financial plan that helps you allocate income for expenses, savings, and investments. Would you like help creating a budget plan?';
    }
    if (query.includes('currency')) {
      return 'I can’t provide real-time currency conversion rates, but websites like XE.com or apps like Revolut can help you with that.';
    }
    return 'I’m sorry, I didn’t understand that. Could you ask a financial question?';
  };

  // Function to clear the chat and start a new conversation
  const clearChat = () => {
    initializeMessages();
  };

  // Customize chat bubble appearance
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#8AC8D0',
        },
        right: {
          backgroundColor: '#4E6766',
        },
      }}
      textStyle={{
        left: {
          color: '#fff',
        },
        right: {
          color: '#fff',
        },
      }}
    />
  );
 if (!fontsLoaded) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Chatbot</Text>
          <View style={styles.buttonContainer}>
            <Button title="New Chat" onPress={clearChat} color="#fff"/>
          </View>
        </View>

        {/* Chat Section */}
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            user={{
              _id: 1,
            }}
            showUserAvatar={false}
            renderInputToolbar={() => null} // Disable GiftedChat's default input toolbar
            inverted={true}
            maxComposerHeight={200}
            listViewProps={{
              style: { flex: 1 },
              contentContainerStyle: { flexGrow: 1 },
              scrollEventThrottle: 400,
            }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={onSend}
          />
          <View style={styles.sendButtonContainer}>
            <Button title="Send" onPress={onSend} color="#fff" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 65,
    paddingBottom: 20,
    backgroundColor: '#8AC8D0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontFamily: 'Nerko-One'
  },
  headerText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Nerko-One'
  },
  buttonContainer: {
    width: 130,
    borderRadius: 20,
    backgroundColor: '#FF8784',
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 95 : 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
    backgroundColor: '#fff',
    fontFamily: 'Gilroy'
  },
  sendButtonContainer: {
    backgroundColor: '#8AC8D0',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ChatbotPage;
