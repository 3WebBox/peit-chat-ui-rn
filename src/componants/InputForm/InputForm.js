/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    PermissionsAndroid,
    Platform,
    Text,
    StyleSheet,
    View,
    Pressable,
    TextInput,
} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';

import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import RNFS from 'react-native-fs';

import uuid from 'react-native-uuid';

import { ratio, screenWidth } from './utils_styles';

import Icon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import ADIcon from 'react-native-vector-icons/AntDesign';
import { config } from '../../../config';

export default class InputForm extends Component {
    
    /* Expected props
    */

    constructor(props) {
        super(props);
    
        this.state = {
            inputView: 'texting',
            messageType: 'text',
            messageContent: null,

            // audio recorder state
            isLoggingIn: false,
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',

            recordingPath: null,
        };
      
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    }

    _handleAttachements() {
        ImagePicker.launchImageLibrary(
            {
              mediaType: 'photo',
              includeBase64: false,
              maxHeight: 200,
              maxWidth: 200,
            },
            (response) => {
              console.log(response)
            },
        )
    }

    _handleSending = () => {
        console.log('Sending...');

        var messageContent = this.state.messageContent
        console.log(messageContent);

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

            this.setState({ 
                messageContent: null,
                messageType: 'text',
                inputView: 'texting',
                recordingPath: null
            });
        }
        catch (e) { 
            console.log(e) 
        }
    }

    _switchInputView(view) {
        switch (view) {
            case 'recording':
                const path = Platform.select({
                    ios: `${uuid.v4()}.m4a`,
                    android: `sdcard/${uuid.v4()}.mp4`,
                });

                this.setState({ 
                    inputView: 'recording', 
                    messageType: 'audio',
                    recordingPath: path
                });

                break;
            default:
                this.setState({ inputView: 'texting', messageType: 'text' });
                break;
        }
    }

    async _handleRecording() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');
                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the camera');
                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }

        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };

        console.log('audioSet', audioSet);

        const uri = await this.audioRecorderPlayer.startRecorder(
            this.state.recordingPath, audioSet
        );

        this.audioRecorderPlayer.addRecordBackListener((e) => {
            this.setState({
                recordingPath: uri,
                recordSecs: e.current_position,
                recordTime: this.audioRecorderPlayer.mmssss(
                    Math.floor(e.current_position),
                ),
            });
        });

        console.log(`uri: ${uri}`);
    };

    async onStopRecord() {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();

        RNFS.readFile(this.state.recordingPath, 'base64').then(res =>{
            console.log(res);

            this.setState({
                recordSecs: 0,
                messageContent: res
            });

            console.log(result);
        });
    };

    async onStartPlay() {
        console.log('onStartPlay');

        const msg = await this.audioRecorderPlayer.startPlayer(this.state.recordingPath);
        this.audioRecorderPlayer.setVolume(1.0);
        console.log(msg);
        this.audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.current_position === e.duration) {
                console.log('finished');
                this.audioRecorderPlayer.stopPlayer();
            }
                
            this.setState({
                currentPositionSec: e.current_position,
                currentDurationSec: e.duration,
                playTime: this.audioRecorderPlayer.mmssss(
                    Math.floor(e.current_position),
                ),
                duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
            });
        });
    };

    async onPausePlay() {
        await this.audioRecorderPlayer.pausePlayer();
    };

    async onStopPlay() {
        console.log('onStopPlay');
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();

        
    };
    
    _renderRecordingView() {
        let playWidth =
            (this.state.currentPositionSec / this.state.currentDurationSec) *
            (screenWidth - 56 * ratio);
        if (!playWidth) playWidth = 0;

        return (
            <View style={{flexDirection: 'row', paddingTop: 15}}>
            <Pressable>
                <EIcon name="mic" size={22} color={config.actionButtonsColor} />
            </Pressable>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{}}>{this.state.recordTime}</Text>
            </View>
            <Pressable
                style={styles.buttonContainer}
                onPress={ () => {
                    this.onStopRecord()
                    this.onStopPlay()
                    this._switchInputView('texting')
                }}
            >
                {({ pressed }) => (
                    <EIcon name="circle-with-cross" size={22} color={ pressed 
                        ? config.secondaryColor 
                        : config.actionButtonsColor
                    } />
                )}
            </Pressable>
            <Pressable
                style={styles.buttonContainer}
                onPress={ () => this.onStartPlay() }
            >
                {({ pressed }) => (
                    <EIcon name="controller-play" size={22} color={ pressed 
                        ? config.secondaryColor 
                        : config.actionButtonsColor
                    } />
                )}
            </Pressable>
            <Pressable
                style={styles.buttonContainer}
                onPress={ () => this.onStopRecord() }
            >
                {({ pressed }) => (
                    <EIcon name="controller-stop" size={22} color={ pressed 
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
        )
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
                onPress={ () => this._handleAttachements() }
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
                onPress={ () => {
                    this._switchInputView('recording')
                    this._handleRecording()
                }}
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
                {this.state.inputView === 'recording'
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
