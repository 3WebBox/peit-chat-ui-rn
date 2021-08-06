/**
 * @format
 */

import React from 'react';
import { Navigation } from 'react-native-navigation';

import ChatsListingScreen from './src/screens/chats_listing_screen';
import ChatScreen from './src/screens/Chat/Chat';
import ConfigAppScreen from './src/screens/config_app_screen';

Navigation.registerComponent('ChatsListing', () => ChatsListingScreen);
Navigation.registerComponent('Chat', () => ChatScreen);
Navigation.registerComponent('ConfigScreen', () => ConfigAppScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        id: 'AppStackNav',
        children: [{ component: {
          name: 'ConfigScreen',
          options: {
            topBar: { title: { text: 'PIET CHAT DEMO' } }
          }
        } }]
      }
    }
  });
});

Navigation.setDefaultOptions({
  statusBar: {
    style: 'light',
    backgroundColor: '#4d089a'
  },
  topBar: {
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
});
