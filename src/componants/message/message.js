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
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

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
            playing: false,
            audioLength: 160,
            audioProgress: 50
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

    _handlePlayButton = () => {
        // handle play button

        this.setState({ playing: !this.state.playing });
    }

    audioMessage() {
        var playingState = 0;

        playingState = this.state.audioProgress * 100 / this.state.audioLength;

        return <View style={ this.props.messageSource == 'received' 
            ? styles.messageContentReceived
            : styles.messageContentSent
        }>
            <TouchableOpacity
                style={styles.audioButtons}
                onPress={ this._handlePlayButton }
            >
                {this.state.playing
                ? <Icon name="stop" size={18} color="#000" />
                : <Icon name="play" size={18} color="#000" />
                }
            </TouchableOpacity>
            <Text style={ styles.audioTimer }>
                {this.state.audioLength}
            </Text>
            <View style={styles.audioBarContainer}>
                <View style={[
                    styles.audioBarProgress,
                    {
                        width: playingState
                    }
                ]} />
            </View>
        </View>
    }

    render() {
        return (
            <View style={this.props.messageSource == 'received' 
            ? styles.container 
            : styles.reversContainer}>
                {this.props.showProfileImage ? <View style={styles.profileImage} /> : null}
                {this.props.renderProfileImageSpace ? <View style={styles.profileImageSpace} /> : null}
                {this.props.messageType == 'text' ? this.textMessage() : null }
                {this.props.messageType == 'audio' ? this.audioMessage() : null }
                <View style={{flex: 1}} />
            </View>    
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        flexDirection: 'row',
        flex: 1,
        margin: 10,
        alignItems: 'flex-end'
    },
    reversContainer: {
        backgroundColor: 'red',
        flexDirection: 'row-reverse',
        flex: 1,
        margin: 10,
        alignItems: 'flex-end'
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'green',
    },
    profileImageSpace: {
        height: 50,
        width: 50,
        backgroundColor: 'pink',
    },
    messageContentReceived: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: 'yellow',
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
        backgroundColor: 'yellow',
        flex: 3,
        padding: 25,
        marginHorizontal: 5,
        borderRadius: 25,
        borderBottomRightRadius: 0,
        textAlign: 'right'
    },
    audioButtons: {
        margin: 0,
        padding: 0
    },
    audioTimer: {
        marginHorizontal: 10,
        fontSize: 11,
        color: '#000'
    },
    audioBarContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 10,
        backgroundColor: '#aaa',
    },
    audioBarProgress: {
        backgroundColor: 'green',
        borderRightWidth: 3,
        borderRightColor: 'white'
    }
});
