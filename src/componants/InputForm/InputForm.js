/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import { config } from '../../../config';

export default class InputForm extends Component {
    
    /* Expected props
    */

    constructor(props) {
        super(props);
    
        this.state = {
            recordingView: false,
            messageType: 'text',
            messageContent: null,
        }
    }

    _handleAttachements() {

    }

    _handleRecording() {

    }

    _handleSending = () => {
        
        var messageContent = this.state.messageContent

        if(!messageContent) return;
        if(!messageContent.trim()) return;

        const {websocket, senderUuid, apiKey, chatUuid} = this.props

        try {
            var data = {
                action: 'send',
                api_key: apiKey,
                type: this.state.messageType,
                content: messageContent,
                sender_uuid: senderUuid,
                chat_uuid: chatUuid
            }

            websocket.send(JSON.stringify(data));

            this.setState({ messageContent: null });
        }
        catch (e) { 
            console.log(e) 
        }
    }
    
    _renderRecordingView() {
        
    }

    _renderMessagingView() {
        return (
            <View style={styles.textInputContainer}>
            <TextInput
                value={this.state.messageType == "text" ? this.state.messageContent : null}
                style={styles.inputField}
                placeholder='Type your message'
                onChangeText={(text) => this.setState({ messageContent: text })}
                multiline
            />
            <Pressable
                style={styles.buttonContainer}
                onPress={ this._handlePlayButton }
            >
                {({ pressed }) => (
                    <EIcon name="attachment" size={22} color={ pressed 
                        ? config.secondaryColor 
                        : config.actionButtonsColor
                    } />
                )}
            </Pressable>
            <Pressable
                style={styles.buttonContainer}
                onPress={ this._handlePlayButton }
            >
                {({ pressed }) => (
                    <EIcon name="mic" size={22} color={ pressed 
                        ? config.secondaryColor 
                        : config.actionButtonsColor
                    } />
                )}
            </Pressable>
            <Pressable
                style={styles.buttonContainer}
                onPress={ () => this._handleSending() }
            >
                {({ pressed }) => (
                    <Icon name="send" size={22} color={ pressed 
                        ? config.secondaryColor 
                        : config.actionButtonsColor
                    } />
                )}
            </Pressable>  
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.recordingView
                ? this._renderRecordingView()
                : this._renderMessagingView() }
            </View>    
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    inputField: {
        flex: 1,
        backgroundColor: 'white',
        textAlign: 'left',
    },
    buttonContainer: {
        marginHorizontal: 5,
        padding: 2,
        marginLeft: 3,
        marginBottom: 6
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
});
