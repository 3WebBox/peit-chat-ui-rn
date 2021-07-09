/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import { config } from './Chat/config';

import moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';

import LocalizedStrings from 'localized-strings';
import { lang } from './Chat/local/index';

export default class ChatsListingScreen extends Component {
  static get options() {
    return {
      statusBar: { backgroundColor: config.primaryColor, style: 'light' },
      popGesture: false,
      topBar: {
        animate: true,
        noBorder: true,
        backButton: { color: config.lightColor, showTitle: false },
        background: { color: config.primaryColor },
        title: { text: lang["en"].chatList.title },
        elevation: 0
      }
    };
  }

  constructor(props) {
    super(props);

    console.log(props);
    this.state = {
      chats: [],

      // the following are dummy data for testing purpose
      user: {
        uuid: props.user.uuid || null,
      }
    };
  }

  componentDidMount() {
    this.getChats();
  }

  getChats() {
    // get list of chats
    fetch(`${config.WWS}chats/get-chats/${this.state.user.uuid}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': this.props.apiKey
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
    console.log(item);
    var participants = JSON.parse(item.participants) ;
    
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
                user: this.state.user,
                langCode: 'en'
              }
            }
          }
        )}
      >
        <Text style={styles.date}>{moment(item.created_at).fromNow()}</Text>
        <View style={styles.participantsContainer}>
          { participants.map( (participant, key) => {
            var render = [];

            render.push(
              <Text key={`${key}-1`} style={styles.participant}>
                {participant}
              </Text>
            );

            if(key + 1 < participants.length) render.push( 
              <Icon 
                key={`${key}-2`} 
                name='md-arrow-forward' 
                size={15} 
                style={{paddingHorizontal: 10}} 
              />
            );

            return render;
          }) }
        </View>
      </Pressable>
    );
  }
  
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList 
          data={this.state.chats}
          renderItem={this.renderItem}
          keyExtractor={item => item.uuid}
        />
      </SafeAreaView>
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
  },
  date: {
    fontSize: config.smallFontSize, 
    color: '#999'
  },
  participantsContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  participant: {
    fontSize: config.largeFontSize,
  }
});