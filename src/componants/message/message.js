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
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import ImageView from "react-native-image-viewing";

const AudioManager = require('./audioManager');

import RNFS from 'react-native-fs';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/FontAwesome';

import { config } from '../../../config';

export default class Message extends Component {
    
    /* Expected props
    messageType, // message type [text, audio, video, image]
    messageContent, // the content of the message base64
    messageSource, // the source of the message [sender, received]
    showProfileImage, // show the profile image area [true, false]
    renderProfileImageSpace, // render the empty space of the message container
    */

    constructor(props) {
        super(props);
    
        this.state = {
            isPlay: false,
            playPositionString: '00:00:00',
            imageViewerVisible: false
        }
    }

    textMessage() {
        return <Text style={ this.props.messageSource == 'received' 
            ? styles.messageContentReceived
            : styles.messageContentSent
        }>
            {this.props.messageContent}
        </Text>
    }

    async pauseAudio() {
        await AudioManager.pausePlayer()
    }

    async onStartPlay() {
        console.log(this.props.messageContent);
        await AudioManager.startPlayer(this.props.messageContent, (res) => {
            const { status } = res
            switch (status) {
                case AudioManager.AUDIO_STATUS.begin: {
                    console.log('BEGIN AUDIO')
                    this.setState({ isPlay: true })
                    break;
                }
                case AudioManager.AUDIO_STATUS.play: {
                    const { current_position, duration } = res.data
                    console.log(res);
                    this.setState({ 
                        duration: duration,
                        playDuration: current_position,
                        playPositionString: res.playPositionString
                    })
                    break
                }
                case AudioManager.AUDIO_STATUS.pause: {
                    console.log('PAUSE AUDIO')
                    this.setState({ isPause: true })
                    break
                }
                case AudioManager.AUDIO_STATUS.resume: {
                    console.log('RESUME AUDIO')
                    this.setState({ isPause: false })
                    break;
                }
                case AudioManager.AUDIO_STATUS.stop: {
                    console.log('STOP AUDIO')
                    this.setState({ isPlay: false, isPause: false })
                    break
                }
            }
        })
    };

    audioMessage() {
        var playingState = 0;

        if(this.state.duration) {
            playingState = this.state.playDuration * 100 / this.state.duration;
        }

        var messageContainerStyle = this.props.messageSource == 'received' 
            ? styles.messageContentReceived
            : styles.messageContentSent

        var buttonsColor = this.props.messageSource == 'received' 
            ? config.receivedContainerActionButtonsColor
            : config.sentContainerActionButtonsColor

        var timerColor = this.props.messageSource == 'received' 
            ? config.receovedContainerTextColor
            : config.sendtContainerTextColor

        return <View style={messageContainerStyle}>
            <TouchableOpacity
                style={styles.audioButtons}
                onPress={ () => this.onStartPlay() }
            >
                {this.state.isPlay
                ? <Icon name="stop" size={18} color={buttonsColor} />
                : <Icon name="play" size={18} color={buttonsColor} />
                }
            </TouchableOpacity>
            <Text style={[styles.audioTimer, {color: timerColor}]}>
                {this.state.playPositionString}
            </Text>
            <View style={styles.audioBarContainer}>
                <View style={[
                    styles.audioBarProgress,
                    {
                        flex: playingState / 100
                    }
                ]} />
            </View>
        </View>
    }

    imageMessage() {
        return <Pressable 
            onPress={() => this.setState({ imageViewerVisible: true })} 
            style={{flex: 3}}
        >
            <Image 
                style={
                        this.props.messageSource == 'received' 
                        ? styles.imageReceived
                        : styles.imageSent
                }
                source={{
                    uri: this.props.messageContent,
                }}
            />
        </Pressable>
    }

    avatar = () => {
        // handle if user image was provided

        // else
        return <View style={styles.profileImageContainer}>
            <FIcon name="user-circle" size={30} color={config.primaryColor} />
        </View>
    }

    render() {
        var showAvatar = this.props.messageSource == 'received' ? true : false;

        return (
            <>
            {this.props.messageType == 'image' ?
            <ImageView
                images={[{ uri: this.props.messageContent }]}
                imageIndex={0}
                visible={this.state.imageViewerVisible}
                onRequestClose={() => this.setState({ imageViewerVisible: false })}
            />
            : null}
            <View style={this.props.messageSource == 'received' 
            ? styles.container 
            : styles.reversContainer}>
                {this.props.showProfileImage && showAvatar? this.avatar() : null}
                {this.props.renderProfileImageSpace && showAvatar && !this.props.showProfileImage
                ? <View style={styles.profileImageSpace} /> 
                : null}
                {this.props.messageType == 'text' ? this.textMessage() : null }
                {this.props.messageType == 'audio' ? this.audioMessage() : null }
                {this.props.messageType == 'image' ? this.imageMessage() : null }
                <View style={{flex: 1}} />
            </View>  
            </>  
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        margin: 10,
        alignItems: 'flex-end'
    },
    reversContainer: {
        flexDirection: 'row-reverse',
        flex: 1,
        margin: 10,
        alignItems: 'flex-end'
    },
    profileImageContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImageSpace: {
        height: 50,
        width: 50,
        backgroundColor: 'white',
    },
    messageContentReceived: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: config.receivedContainerBackground,
        color: config.receovedContainerTextColor,
        flex: 3,
        padding: 25,
        marginHorizontal: 5,
        borderRadius: 25,
        borderBottomLeftRadius: 0,
        textAlign: 'left',
    },
    messageContentSent: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: config.sentContainerBackgroundColor,
        color: config.sendtContainerTextColor,
        flex: 3,
        padding: 25,
        marginHorizontal: 5,
        borderRadius: 25,
        borderBottomRightRadius: 0,
        textAlign: 'left'
    },
    imageSent: {
        flexDirection: 'row',
        alignItems:'center',
        borderRadius: 10,
        borderBottomRightRadius: 0,
        marginHorizontal: 5,
        flex: 3, 
        height: 200,
        resizeMode: 'contain'
    },
    imageReceived: {
        flexDirection: 'row',
        alignItems:'center',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        marginHorizontal: 5,
        flex: 3, 
        height: 200,
        resizeMode: 'contain',
    },
    audioButtons: {
        margin: 0,
        padding: 0
    },
    audioTimer: {
        marginHorizontal: 10,
        fontSize: 11,
    },
    audioBarContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 5,
        backgroundColor: '#aaa',
    },
    audioBarProgress: {
        backgroundColor: config.audioPlayerProgressBarIndicator,
        borderRightWidth: 3,
        borderRightColor: 'white'
    }
});
