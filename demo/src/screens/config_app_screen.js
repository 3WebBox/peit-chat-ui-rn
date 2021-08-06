/*
 *
 *  This screen is for user to setup the chat
 *  configuration for testing purposes
 * 
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import { config } from './Chat/config';

import LocalizedStrings from 'localized-strings';
import { lang } from './Chat/local/index';

export default class ConfigAppScreen extends Component {
  static get options() {
    return {
      statusBar: { backgroundColor: config.primaryColor, style: 'light' },
      popGesture: false,
      topBar: {
        animate: true,
        noBorder: true,
        backButton: { color: config.lightColor, showTitle: false },
        background: { color: config.primaryColor },
        title: { text: lang["en"].setup.title },
        elevation: 0
      }
    };
  }

  constructor() {
    super();

    this.state = {
      apiKey: null,
      userUuid: null,
      senderUuid: null,
    }
  }

  render() {
    let fields = [
      {
        label: lang['en'].setup.apiKey,
        description: lang['en'].setup.apiKeyDescription,
        placeholder: lang['en'].g.typeHere,
        value: this.state.apiKey,
        onChangeText: (text) => this.setState({ apiKey: text })
      },
      {
        label: lang['en'].setup.senderUuid,
        description: lang['en'].setup.senderUuidDescription,
        placeholder: lang['en'].g.typeHere,
        value: this.state.senderUuid,
        onChangeText: (text) => this.setState({ senderUuid: text })
      }
    ]

    return (
      <ScrollView style={styles.screenContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled
          keyboardVerticalOffset={0}
        >
          {fields.map((field, key) => {
            return (
              <View style={styles.fieldContainer} key={key}>
                <Text style={styles.fieldLabel}>
                  {field.label}
                </Text>
                <Text style={styles.fieldDescription}>
                  {field.description}
                </Text>
                <TextInput
                  style={styles.inputField}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChangeText={(text) => field.onChangeText(text)}
                />
              </View>
            )
          })}
        </KeyboardAvoidingView>
        <Pressable
          style={({ pressed }) => [
            styles.defaultValuesButton,
            pressed
              ? styles.defaultValuesButtonPressed
              : styles.defaultValuesButtonIdle
          ]}
          onPress={() => this.setState({
            apiKey: config.API_KEY,
            senderUuid: 'user-1',
          })}
        >
          <Text style={styles.defaultValuesButtonText}>
            {lang['en'].setup.useDefaultValues}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.defaultValuesButton,
            pressed
              ? styles.defaultValuesButtonPressed
              : styles.defaultValuesButtonIdle
          ]}
          onPress={() => Navigation.push(
            this.props.componentId, {
            component: {
              name: 'ChatsListing',
              passProps: {
                apiKey: this.state.apiKey,
                user: { uuid: this.state.senderUuid }
              }
            }
          } )}
        >
          <Text style={styles.defaultValuesButtonText}>
            {lang['en'].setup.startChat}
          </Text>
        </Pressable>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 30,
  },
  fieldLabel: {
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  fieldDescription: {
    color: '#888',
    fontSize: 11,
    paddingVertical: 3,
    marginBottom: 10
  },
  inputField: {
    backgroundColor: '#eee',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 15,
  },
  defaultValuesButton: {
    marginVertical: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultValuesButtonIdle: {
    backgroundColor: config.primaryColor,
  },
  defaultValuesButtonPressed: {
    backgroundColor: config.secondaryColor,
  },
  defaultValuesButtonText: {
    color: 'white',
    textTransform: 'uppercase',
  }
});