/**
 * @format
 */
/*
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);


*/

import React from 'react';
import { Navigation } from 'react-native-navigation';

import ChatsListingScreen from './chats_listing_screen';
import ChatScreen from './chat_screen';

Navigation.registerComponent('ChatsListing', () => ChatsListingScreen);
Navigation.registerComponent('Chat', () => ChatScreen);

Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot({
        root: {
            stack: {
                id: 'AppStackNav',
                children: [
                    {
                        component: {
                            name: 'ChatsListing',
                            options: {
                                topBar: {
                                    title: {
                                        text: 'PIET Chat Demo'
                                    }
                                }
                            }
                        }
                    }
                ]
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
        color: 'white'
      },
      backButton: {
        color: 'white'
      },
      background: {
        color: '#4d089a'
      }
    }
});
