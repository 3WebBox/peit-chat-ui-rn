/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
} from 'react-native';

import Message from '../componants/message/message';
import InputForm from '../componants/InputForm/InputForm';

import {config} from '../../config';

export default class ChatScreen extends Component {
  constructor() {
    super();

    this.ScrollView = React.createRef();

    this.state = {
        open: false,
        ws: null,
        messages: [],

        // the following are dummy data for testing purpose
    };

    //this.socket = new WebSocket('wss://cloud.peit.io:5080/');
  }

  componentDidMount() {
    this.connect();
    this.getMessages();
  }

  // GET INITIAL MESSAGES
  getMessages() {
    fetch(`${config.WWS}messages/get-messages/${this.props.chatUuid}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': this.props.apiKey
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        messages: json.data || []
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  timeout = 250;

  connect = () => {
    var ws = new WebSocket(config.WWS);
    let that = this;
    var connectInterval;

    ws.onopen = () => {
      ws.send(JSON.stringify( {action: "set-chat", chat_uuid: this.props.chatUuid}));

      this.setState({ ws: ws });

      that.timeout = 250; 
      clearTimeout(connectInterval); 
    };

    ws.onclose = e => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout;
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); 
    };

    ws.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };

    ws.onmessage = d => {
      var finalizedData = JSON.parse(d.data);

      var msg = {
        uuid: finalizedData.uuid,
        sender_uuid: finalizedData.sender_uuid,
        chat_uuid: finalizedData.chat_uuid,
        type: finalizedData.type,
        content: finalizedData.content
      }

      var messages = this.state.messages;
      messages.push(msg);

      this.setState({
        messages: messages
      });

      console.log(msg);
    }
  };

  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect();
  };
  
  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              flexDirection:'column',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }}
            style={styles.scrollView}
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
          >
            {this.state.messages.map( msg => {
              return <Message 
                key={msg.uuid}
                showProfileImage={true}
                renderProfileImageSpace={false}
                messageType={msg.type}
                messageContent={msg.content}
                messageSource={this.props.senderUuid == msg.sender_uuid ? 'sent' : 'received'}
              />
            })}
          </ScrollView>
          <KeyboardAvoidingView 
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled 
            keyboardVerticalOffset={0}
          >
            <InputForm 
              websocket={this.state.ws}
              senderUuid={this.props.senderUuid}
              userUuid={this.props.userUuid}
              chatUuid={this.props.chatUuid}
              apiKey={this.props.apiKey}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  }
});