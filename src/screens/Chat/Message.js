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
  Pressable,
} from 'react-native';

import ImageView from "react-native-image-viewing";
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const AudioManager = require('./audioManager');

import Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/FontAwesome';

import { config } from './config';

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

  _handlePress = () => {
    if(this.state.isLoading) { return null }
    
    this.setState({ isLoading: true });

    var url = this.props.messageContent;

    // Get file name from url
    var fileName = url.split('/').pop();
    var localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const options = {
      fromUrl: url,
      toFile: localFile
    };

    RNFS.downloadFile(options).promise
    .then(() => FileViewer.open(localFile))
    .then(() => {
      // success
      this.setState({ isLoading: false });
    })
    .catch(error => {
      // error
      this.setState({ isLoading: false });
    });
  }

  textMessage() {
    return (
      <View 
        style={[
          this.props.messageSource == 'received'
            ? styles.messageContentReceived
            : styles.messageContentSent
          , { fontSize: 16 }
        ]}
      >
        <Text>
          {this.props.messageContent}
        </Text>
      </View>
    );
  }

  async pauseAudio() {
    await AudioManager.pausePlayer()
  }

  async onStopPlay() {
    console.log('onStopPlay');
    AudioManager.stopPlayer();

    this.setState({ isPlay: false, isPause: false, isStop: true })
  };

  async onStartPlay() {
    if(this.state.isPlay) { return null }

    await AudioManager.startPlayer(this.props.messageContent, (res) => {
      const { status } = res
      switch (status) {
        case AudioManager.AUDIO_STATUS.begin: {
          console.log('BEGIN AUDIO')
          this.setState({ isPlay: true, isPause: false, isStop: true })
          break;
        }
        case AudioManager.AUDIO_STATUS.play: {
          const { current_position, duration } = res.data

          this.setState({
            duration: duration,
            playDuration: current_position,
            playPositionString: res.playPositionString
          });

          break
        }
        case AudioManager.AUDIO_STATUS.pause: {
          console.log('PAUSE AUDIO')
          this.setState({ isPlay: false, isPause: true, isStop: true })
          break
        }
        case AudioManager.AUDIO_STATUS.resume: {
          console.log('RESUME AUDIO')
          this.setState({ isPlay: true, isPause: false, isStop: true })
          break;
        }
        case AudioManager.AUDIO_STATUS.stop: {
          console.log('STOP AUDIO')
          this.setState({ isPlay: false, isPause: false, isStop: true })
          break
        }
      }
    })
  };

  audioMessage() {
    var playingState = 0;

    if (this.state.duration) {
      playingState = this.state.playDuration * 100 / this.state.duration;
    }

    var messageContainerStyle = this.props.messageSource == 'received'
      ? styles.imageMessageContentReceived
      : styles.imageMessageContentSent

    var color = this.props.messageSource == 'received'
      ? config.primaryColor
      : config.secondaryColor

    return <View style={[ 
      messageContainerStyle, 
      { 
        justifyContent: 'center',
        paddingVertical: 15,
      }
    ]}>
      <Pressable
        style={[styles.audioButtons, {backgroundColor: color}]}
        onPress={() => {
          this.state.isPlay ? this.onStopPlay() : this.onStartPlay()
        }}
      >
        {this.state.isPlay
          ? <Icon name="stop" size={18} color={'white'} />
          : <Icon name="play" size={25} color={'white'} />
        }
        {this.state.isPlay
          ? <Text style={styles.audioTimer}>{this.state.playPositionString}</Text>
          : null }
      </Pressable>
    </View>
  }

  videoMessage() {
    var messageContainerStyle = this.props.messageSource == 'received'
      ? styles.imageMessageContentReceived
      : styles.imageMessageContentSent

    return <View style={messageContainerStyle}>
      <Pressable onPress={this._handlePress}>
        <View style={styles.videoContaienr}>
          <Icon name='play' size={config.regularFontSize} color='white' />
        </View>
      </Pressable>
    </View>
  }

  fileMessage() {
    var messageContainerStyle = this.props.messageSource == 'received'
      ? styles.imageMessageContentReceived
      : styles.imageMessageContentSent

    return <View style={messageContainerStyle}>
      <Pressable onPress={this._handlePress}>
        <View style={{width: 200, heigh: 200, backgroundColor: '#000'}}>
          <MP4 width="100%" height="100%" />
        </View>
      </Pressable>
    </View>
  }

  imageMessage() {
    var messageContainerStyle = this.props.messageSource == 'received'
      ? styles.imageMessageContentReceived
      : styles.imageMessageContentSent

    return <View style={messageContainerStyle}>
      <Pressable onPress={() => this.setState({ imageViewerVisible: true })}>
        <Image
          style={styles.imageContainer}
          source={{ uri: this.props.messageContent }}
        />
      </Pressable>
    </View>
  }

  avatar = () => {
    // handle if user image was provided

    // else
    return <View style={styles.profileImageContainer}>
      <FIcon name="user-circle" size={30} color={config.primaryColor} />
    </View>
  }

  render() {
    //> Detect message type from message content
    var messageType = this.props.messageType;

    if(messageType == 'voicenote') { messageType = 'audio' }

    if(this.props)

    var showAvatar = this.props.messageSource == 'received' ? true : false;

    return (
      <>
        {messageType == 'image' ?
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
          {this.props.showProfileImage && showAvatar ? this.avatar() : null}
          {this.props.renderProfileImageSpace && showAvatar && !this.props.showProfileImage
            ? <View style={styles.profileImageSpace} />
            : null}
          {messageType == 'text' ? this.textMessage() : null}
          {messageType == 'audio' ? this.audioMessage() : null}
          {messageType == 'video' ? this.videoMessage() : null}
          {messageType == 'file' ? this.fileMessage() : null}
          {messageType == 'image' ? this.imageMessage() : null}
          <View style={{ flex: 1 }} />
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end'
  },
  reversContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
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
    color: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'left',
    borderLeftWidth: 5,
    borderLeftColor: config.primaryColor
  },
  messageContentSent: {
    color: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'right',
    borderRightWidth: 5,
    borderRightColor: config.secondaryColor
  },
  imageMessageContentReceived: {
    color: '#333',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'left',
    borderLeftWidth: 5,
    borderLeftColor: config.primaryColor
  },
  imageMessageContentSent: {
    color: '#333',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'right',
    borderRightWidth: 5,
    borderRightColor: config.secondaryColor
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 15,
    resizeMode: 'cover',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoContaienr: {
    width: 130,
    height: 250,
    borderRadius: 15,
    resizeMode: 'cover',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioButtons: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  audioTimer: {
    marginTop: 10,
    fontSize: 10,
    color: '#fff'
  },

  audioBarContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 5,
    backgroundColor: '#fff',
  },
  audioBarProgress: {
    backgroundColor: config.audioPlayerProgressBarIndicator,
    borderRightWidth: 3,
    borderRightColor: 'white'
  }
});