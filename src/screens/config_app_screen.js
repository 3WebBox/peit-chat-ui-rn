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

import {config} from '../../config';

export default class ConfigAppScreen extends Component {
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
                label: 'API Key',
                description: 'The API key for authorization to connect with PEIT server.',
                placeholder: 'Type in API Key',
                value: this.state.apiKey,
                onChangeText: (text) => this.setState({ apiKey: text })
            },
            {
                label: 'Sender UUID',
                description: 'The UUID for the first user.',
                placeholder: 'Type in sender UUID',
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
                {fields.map( (field, key) => { return (
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
                )})}
                </KeyboardAvoidingView>
                <Pressable 
                    style={ ({pressed}) => [ 
                        styles.defaultValuesButton,
                        pressed 
                        ? styles.defaultValuesButtonPressed
                        : styles.defaultValuesButtonIdle 
                    ]}
                    onPress={() => this.setState({
                        apiKey: 'dde8c1d8-1e87-46ef-89ec-66724ea62ffb',
                        senderUuid: 'user-1',
                    })}
                >
                    <Text style={styles.defaultValuesButtonText}>Use Default Values</Text>
                </Pressable>
                <Pressable 
                    style={ ({pressed}) => [ 
                        styles.defaultValuesButton,
                        pressed 
                        ? styles.defaultValuesButtonPressed
                        : styles.defaultValuesButtonIdle 
                    ]}
                    onPress={() => Navigation.push(
                        this.props.componentId,  {
                          component: { 
                            name: 'ChatsListing',
                            options: {
                                topBar: {
                                    title: {
                                        text: 'CHATS LIST'
                                    }
                                }
                            },
                            passProps: {
                                apiKey: this.state.apiKey,
                                senderUuid: this.state.senderUuid
                            }
                          }
                        }
                    )}
                >
                    <Text style={styles.defaultValuesButtonText}>Start Chat</Text>
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