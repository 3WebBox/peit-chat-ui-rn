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
  TouchableOpacity,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';

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
        const {websocket, senderUuid, apiKey, chatUuid} = this.props

        try {
            var data = {
                action: 'send',
                api_key: apiKey,
                type: this.state.messageType,
                content: this.state.messageContent,
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
            <>
            <TextInput
                value={this.state.messageType == "text" ? this.state.messageContent : null}
                style={styles.inputField}
                placeholder='Type your message'
                onChangeText={(text) => this.setState({ messageContent: text })}
            />
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={ this._handlePlayButton }
            >
                <EIcon name="attachment" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={ this._handlePlayButton }
            >
                <EIcon name="mic" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={ () => this._handleSending() }
            >
                <Icon name="send" size={22} color="#000" />
            </TouchableOpacity>  
            </>
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
        backgroundColor: 'gray',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        backgroundColor: 'white',
        textAlign: 'left',
    },
    buttonContainer: {
        marginHorizontal: 5,
        padding: 2,
        marginLeft: 3
    }
});
