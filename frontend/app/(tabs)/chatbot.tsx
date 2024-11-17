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
import axios from 'axios';

const ChatbotPage: React.FC = () => {
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

    const userMessage = {
      _id: Math.random().toString(),
      text: inputText,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [userMessage]));
    setInputText(''); // Clear input field

    // Make an API call to fetch the chatbot's response
    axios
      .post('https://hackutd-2024-flask-server.onrender.com/api/chat', { message: inputText })
      .then((response) => {
        const botMessage = {
          _id: Math.random().toString(),
          text: response.data.reply, // Adjust based on API response structure
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
            avatar: '../../assets/images/moneyPig.png',
          },
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
      })
      .catch((error) => {
        console.error('Error fetching chatbot response:', error);
        const errorMessage = {
          _id: Math.random().toString(),
          text: 'Oops! Something went wrong. Please try again later.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
            avatar: '../../assets/images/moneyPig.png',
          },
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMessage]));
      });
  }, [inputText]);

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
            <Button title="New Chat" onPress={clearChat} color="#fff" />
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
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
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
  },
  sendButtonContainer: {
    backgroundColor: '#8AC8D0',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ChatbotPage;
