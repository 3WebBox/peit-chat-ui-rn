/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  Keyboard,
  Platform,
  Pressable,
  Linking
} from 'react-native';

import Message from './Message';
import InputForm from './InputForm';

import PietLogo from './assets/peit/squar_icon.svg';

import { config } from './config';

import LocalizedStrings from 'localized-strings';
import { lang } from './local/index';

class Chat extends Component {
  constructor(props) {
    super();

    this.ScrollView = React.createRef();

    this.state = {
      ws: null,
      isConnecting: true,
      connectionError: false,
      headerHeight: 0,

      page: 1,
      stayUp: false,
      messages: null,

      user: props.user || null,
      chatUuid: props.chatUuid || null,
      langCode: props.langCode || 'en',

      participants: [],
    };
  }

  async getHeaderHeight() {
    const e = await Navigation.constants();
    var height = 0;

    if(Platform.OS !== 'ios') height = e.statusBarHeight;

    this.setState({ headerHeight:  height });
  }

  componentDidMount() {
    this.getHeaderHeight();
    this.getMessages();
  }

  onRefresh() {
    this.setState({
      page: ++this.state.page,
      stayUp: true
    }, () => this.getMessages() )
  }

  getMessages() {
    var baseURL = `${config.WWS}messages/get-messages/`;
    var chatUuid = this.state.chatUuid;
    var filters = `?resPerPage=30&&page=${this.state.page}`;

    fetch(baseURL + chatUuid + filters, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': this.props.apiKey || config.API_KEY
      }
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.status == 'success') {
        var messages = this.state.messages || [];
        messages = messages.concat(json.data);

        this.setState({ messages: messages});
  
        // connect to chat
        this.connect();
      }
      else {
        Alert.alert(
          lang["en"].g.oops, 
          lang["en"].g.somethingWentWrong,
          [{ text: lang["en"].g.continue }]
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  connect = () => {
    var ws = new WebSocket(config.WWS);
    var connectInterval;
    var chatUuid = this.state.chatUuid;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "set-chat", chat_uuid: chatUuid }));

      this.setState({ ws: ws, isConnecting: false });

      this.timeout = 250;
      clearTimeout(connectInterval);
    };

    ws.onclose = e => {
      console.log(e);

      this.setState({ 
        connectionError: true, 
        error: e, 
        isConnecting: false 
      });

      this.timeout = this.timeout * 2;
      connectInterval = setTimeout( this.check, Math.min(10000, this.timeout) );
    };

    ws.onerror = err => {
      console.error( err );
      ws.close();
    };

    ws.onmessage = d => {
      var finalizedData = JSON.parse(d.data);

      if(finalizedData.action == 'ping') {
        ws.send(JSON.stringify({ action: 'pong' }));
        return null;
      }

      if(finalizedData.action == 'pong') return null;

      var msg = {
        uuid: finalizedData.uuid,
        sender_uuid: finalizedData.sender_uuid,
        chat_uuid: finalizedData.chat_uuid,
        type: finalizedData.type,
        content: finalizedData.content
      }

      var messages = this.state.messages || [];

      messages.unshift(msg);

      console.log(messages);

      this.setState({ messages: messages });
    }
  };

  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect();
  };

  _renderMessages() {
    var render = [];
    var messages = this.state.messages || [];
    
    messages.map(msg => {
      render.unshift( <Message
          key={msg.uuid}
          messageUuid={msg.uuid}
          renderProfileImageSpace={false}
          messageType={msg.type}
          messageContent={msg.content}
          messageDate={msg.created_at}
          messageSource={this.state.user.uuid == msg.sender_uuid ? 'sent' : 'received'}
        />
      );
    });

    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
          paddingBottom: 50,
        }}
        style={[styles.scrollView]}
        
        refreshControl={
          <RefreshControl
            refreshing={this.state.isConnecting}
            onRefresh={() => this.onRefresh()}
          />
        }

        ref={ref => { this.scrollView = ref }}
        onContentSizeChange={() => {
          if(this.state.stayUp == false)
            this.scrollView.scrollToEnd({ animated: true })
        }}

        onScrollBeginDrag={Keyboard.dismiss}
      >
        {render}
      </ScrollView>
    );
  }

  render() {

    if(!this.state.user) return <View style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size={30} color={config.primaryColor} />
    </View>

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView 
          behavior={Platform.select({ ios: 'padding' })} 
          keyboardVerticalOffset={(Platform.OS === 'ios') ? 90 : -200}
          style={{flex: 1}}
        >

        {this._renderMessages()}

        {this.state.isConnecting 
        ? <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
            <ActivityIndicator color={config.primaryColor} size={20} /> 
            <Text style={{paddingLeft: 15, color: config.primaryColor, fontSize: config.smallFontSize}}>
              {lang['en'].g.connecting}
            </Text>
        </View>
        : <Pressable 
          style={styles.peitContainer}
          onPress={() => Linking.openURL(config.PEIT_URL)}
        >
          <PietLogo height={20} width={20} />
          <Text style={styles.peitPoweredBy}>
            Chat powered by PEIT.io
          </Text>
        </Pressable>}

        <InputForm
          websocket={this.state.ws}
          userUuid={this.state.user.uuid}
          chatUuid={this.state.chatUuid}
          messagesScrollView={this.scrollView}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  peitContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingLeft: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginLeft: 10,
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#fefefe'
  },

  peitPoweredBy: {
    paddingLeft: 10,
    fontSize: 9,
    color: '#aaa'
  }
});

export default Chat;