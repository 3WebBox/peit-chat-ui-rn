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
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import {config} from './config';

export default class ChatsListingScreen extends Component {
  constructor() {
    super();

    this.state = {
        chats: [],

        // the following are dummy data for testing purpose

        senderUuid: 'user-1',
        chatUuid: 'a6d0d1f4-adf6-4d57-8519-e7f053b108c9',
        apiKey: 'dde8c1d8-1e87-46ef-89ec-66724ea62ffb'
    };

    //this.socket = new WebSocket('wss://cloud.peit.io:5080/');
  }

  componentDidMount() {
    this.getChats();
  }

  getChats() {
    // get list of chats
    fetch(`${config.WWS}chats/get-chats/${this.state.senderUuid}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': this.state.apiKey
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      this.setState({
        chats: json.data
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity 
        style={{padding: 20}} 
        onPress={ () => Navigation.push(
          this.props.componentId,  {
            component: { 
              name: 'Chat',
              options: {
                  topBar: {
                      title: {
                          text: 'Chat with user-2'
                      }
                  }
              },
              passProps: {
                chatUuid: item.uuid
              }
            }
          }
        )}
      >
        <Text style={{fontSize: 11}}>{item.created_at}</Text>
        <Text style={{fontSize: 25}}>{item.uuid}</Text>
      </TouchableOpacity>
      );
  }
  
  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <FlatList 
            data={this.state.chats}
            renderItem={this.renderItem}
            keyExtractor={item => item.uuid}
          />
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
});