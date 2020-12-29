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
  Pressable,
  FlatList,
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import {config} from '../../config';

export default class ChatsListingScreen extends Component {
  constructor() {
    super();

    this.state = {
        chats: [],

        // the following are dummy data for testing purpose
    };
  }

  componentDidMount() {

    this.getChats();
  }

  getChats() {
    // get list of chats
    fetch(`${config.WWS}chats/get-chats/${this.props.senderUuid}`, {
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
        chats: json.data
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem = ({item}) => {
    return (
      <Pressable 
        style={ ({pressed}) => [
          styles.chatContainer,
          pressed ? styles.chatContainerPressed : styles.chatContainerUnpressed
        ]} 
        onPress={() => Navigation.push(
          this.props.componentId,  {
            component: { 
              name: 'Chat',
              options: {
                  topBar: {
                      title: {
                          text: `MESSAGES`
                      }
                  }
              },
              passProps: {
                chatUuid: item.uuid,
                apiKey: this.props.apiKey,
                senderUuid: this.props.senderUuid
              }
            }
          }
        )}
      >
        <Text style={{fontSize: 11, color: '#999'}}>{item.created_at}</Text>
        <Text style={{fontSize: 25}}>{
          JSON.parse(item.participants).map( (participant) => {
            return `${participant}    `
          })
        }</Text>
      </Pressable>
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
  chatContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatContainerUnpressed: {
    backgroundColor: 'white',
  },
  chatContainerPressed: {
    backgroundColor: '#f9f9f9'
  }
});