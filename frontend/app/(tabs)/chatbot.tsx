import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GiftedChat, Bubble, IMessage } from 'react-native-gifted-chat';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // Function to initialize with a welcome message
  const initializeMessages = () => {
    setMessages([
      {
        _id: 1,
        text: 'Welcome to the chatbot! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://placeimg.com/140/140/any',
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

    // Simulate bot response
    setTimeout(() => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(),
            text: `You said: "${newMessage.text}". How can I help further?`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Chatbot',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ])
      );
    }, 1000);
  }, [inputText]);

  // Function to clear the chat and start new conversation
  const clearChat = () => {
    initializeMessages();
  };

  // Customize chat bubble appearance
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#4E6766',
        },
        right: {
          backgroundColor: '#8AC8D0',
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
    backgroundColor: '#4E6766',
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
    backgroundColor: '#000',
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
    paddingBottom: Platform.OS === 'ios' ? 90 : 20,
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
    backgroundColor: '#4E6766',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ChatbotPage;