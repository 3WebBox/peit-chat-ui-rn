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
  ActivityIndicator,
  Modal
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import Upload from 'react-native-background-upload';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import SoundPlayer from 'react-native-sound-player'

import RNFS from 'react-native-fs';

import uuid from 'react-native-uuid';

import { ratio, screenWidth } from './utils_styles';

import Icon from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/Entypo';

import { config } from './config';

import LocalizedStrings from 'localized-strings';
import { lang } from './local/index';

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputView: 'texting',
      messageType: 'text',
      messageContent: null,
      displayModal: false,

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
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
  }

  async _handleAttachments(type) {
    if (type === 'audio') {
      if (!this.state.recordingPath) { return }

      await this.onStopRecord()

      var path = this.state.recordingPath;

      if(Platform.OS === 'ios') {
        path = `file://${path}`
      }
      else {
        path = path.replace('file:///', '/');
      }

      const options = {
        url: `${config.WWS}messages/upload/${this.props.chatUuid}`,
        path: path,
        method: 'POST',
        type: 'raw',
        maxRetries: 2, // set retry count (Android only). Default 2
        headers: {
          "X-Api-Key": config.API_KEY
        },
        field: 'attachment',
        parameters: {
          'sender_uuid': this.props.userUuid
        },
        type: 'multipart',
        // Below are options only supported on Android
        notification: {
          enabled: true
        },
        useUtf8Charset: true
      }
      
      Upload.startUpload(options).then((uploadId) => {
        Upload.addListener('progress', uploadId, (data) => {
          this.setState({ isSending: true })
        })
        Upload.addListener('error', uploadId, (data) => {
          this.setState({ isSending: false })          
        })
        Upload.addListener('cancelled', uploadId, (data) => {
          this.setState({ isSending: false })
        })
        Upload.addListener('completed', uploadId, (data) => {
          var data = JSON.parse(data.responseBody);
          this.setState({
            messageContent: data.data.uri,
            isSending: false
          }, () => {
            this._handleSending()
          })
        })
      }).catch((err) => {
        console.info('Upload error!', err)
        this.setState({ isSending: false })
      });
    }

    else if (type === 'video-camera') {
      ImagePicker.openCamera({
        mediaType: 'video',
      })
      .then(video => {
        var path = video.path;
    
        if(Platform.OS === 'ios') {
          path = `file://${path}`
        }
        else {
          path = path.replace('file:///', '/');
        }

        const options = {
          url: `${config.WWS}messages/upload/${this.props.chatUuid}`,
          path: path,
          method: 'POST',
          type: 'raw',
          maxRetries: 2, // set retry count (Android only). Default 2
          headers: {
            "X-Api-Key": config.API_KEY
          },
          field: 'attachment',
          parameters: {
            'sender_uuid': this.props.userUuid
          },
          type: 'multipart',
          // Below are options only supported on Android
          notification: {
            enabled: true
          },
          useUtf8Charset: true
        }
        
        Upload.startUpload(options).then((uploadId) => {
          Upload.addListener('progress', uploadId, (data) => {
            this.setState({ isSending: true })
          })
          Upload.addListener('error', uploadId, (data) => {
            this.setState({ isSending: false })
          })
          Upload.addListener('cancelled', uploadId, (data) => {
            this.setState({ isSending: false })
          })
          Upload.addListener('completed', uploadId, (data) => {
            var data = JSON.parse(data.responseBody);
            this.setState({
              messageType: 'video',
              messageContent: data.data.uri,
              isSending: false
            }, () => {
              this._handleSending()
            })
          })
        }).catch((err) => {
          console.info('Upload error!', err)
          this.setState({ isSending: false })
        })
      })
      .catch(e => {
        console.error(e)
      });

      this.taggleAttachmentModal();
    }

    else if (type === 'picture-camera') {
      ImagePicker.openCamera({})
      .then(image => {
        var path = image.path;
    
        if(Platform.OS === 'ios') {
          path = `file://${path}`
        }
        else {
          path = path.replace('file:///', '/');
        }

        const options = {
          url: `${config.WWS}messages/upload/${this.props.chatUuid}`,
          path: path,
          method: 'POST',
          type: 'raw',
          maxRetries: 2, // set retry count (Android only). Default 2
          headers: {
            "X-Api-Key": config.API_KEY
          },
          field: 'attachment',
          parameters: {
            'sender_uuid': this.props.userUuid
          },
          type: 'multipart',
          // Below are options only supported on Android
          notification: {
            enabled: true
          },
          useUtf8Charset: true
        }
        
        Upload.startUpload(options).then((uploadId) => {
          Upload.addListener('progress', uploadId, (data) => {
            this.setState({ isSending: true })
          })
          Upload.addListener('error', uploadId, (data) => {
            this.setState({ isSending: false })
          })
          Upload.addListener('cancelled', uploadId, (data) => {
            this.setState({ isSending: false })
          })
          Upload.addListener('completed', uploadId, (data) => {
            var data = JSON.parse(data.responseBody);
            this.setState({
              messageType: 'image',
              messageContent: data.data.uri,
              isSending: false
            }, () => {
              this._handleSending()
            })
          })
        }).catch((err) => {
          this.setState({ isSending: false })
          console.info('Upload error!', err)
        })
      })
      .catch(e => {
        console.eroor(e)
      });

      this.taggleAttachmentModal();
    }

    else if (type === 'gallary') {
      ImagePicker.openPicker({})
      .then(image => {
        var path = image.path;
    
        if(Platform.OS === 'ios') {
          path = `file://${path}`
        }
        else {
          path = path.replace('file:///', '/');
        }

        const options = {
          url: `${config.WWS}messages/upload/${this.props.chatUuid}`,
          path: path,
          method: 'POST',
          type: 'raw',
          maxRetries: 2,
          headers: {
            "X-Api-Key": config.API_KEY
          },
          field: 'attachment',
          parameters: {
            'sender_uuid': this.props.userUuid
          },
          type: 'multipart',
          // Below are options only supported on Android
          notification: {
            enabled: true
          },
          useUtf8Charset: true
        }
        
        Upload.startUpload(options).then((uploadId) => {
          Upload.addListener('progress', uploadId, (data) => {
            this.setState({ isSending: true })
          })
          Upload.addListener('error', uploadId, (data) => {
            this.setState({ isSending: false })
          })
          Upload.addListener('cancelled', uploadId, (data) => {
            this.setState({ isSending: false })            
          })
          Upload.addListener('completed', uploadId, (data) => {
            var data = JSON.parse(data.responseBody);
            this.setState({
              messageType: 'image',
              messageContent: data.data.uri,
              isSending: false
            }, () => {
              this._handleSending()
            })
          })
        }).catch((err) => {
          this.setState({ isSending: false })
          console.info('Upload error!', err)
        })
      })
      .catch(e => {
        console.error(e)
      });


      this.taggleAttachmentModal();
    }
  }

  sendTone = async () => {
    try {
      // play the file tone.mp3
      SoundPlayer.playSoundFile('chat_message', 'wav')
    } catch (e) {
      console.error(e)
    }
  }

  _handleSending = async () => {
    var messageContent = this.state.messageContent

    if (!messageContent) return;
    if (!messageContent.trim()) return;

    const { websocket, userUuid, chatUuid } = this.props

    try {
      var data = {
        action: 'send',
        api_key: config.API_KEY,
        type: this.state.messageType,
        content: messageContent,
        sender_uuid: userUuid,
        chat_uuid: chatUuid
      }

      websocket.send(JSON.stringify(data));
      this.sendTone();

      this.setState({
        messageContent: null,
        messageType: 'text',
        inputView: 'texting',
        recordingPath: null
      });
    }
    catch (e) {
      console.error(e)
    }
  }

  _switchInputView(view) {
    switch (view) {
      case 'recording':
        this.setState({
          inputView: 'recording',
          messageType: 'voicenote',
          recordingPath: null
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
          console.warn('You can use the storage');
        } else {
          console.warn('permission denied');
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
            title: 'Permissions for recording',
            message: 'Qanoon requires permission to record audio files',
            buttonPositive: 'ok',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('You can use the microphone');
        } else {
          console.warn('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const directory = Platform.select({
      ios: `${RNFS.DocumentDirectoryPath}/Voicenotes`,
      android: `${RNFS.EsxternalDirectoryPath}/Voicenotes`
    });

    const path = Platform.select({
      ios: `${uuid.v4()}.m4a`,
      android: `${directory}/${uuid.v4()}.mp4`,
    });
    
    await RNFS.mkdir(directory);

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    
    const meteringEnabled = false;

    const uri = await this.audioRecorderPlayer.startRecorder(
      path, audioSet, meteringEnabled
    );

    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordingPath: uri,
        recordSecs: e.currentPosition,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
      });
    });
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();

    this.setState({ recordSecs: 0 });
    return true;
  };

  onStartPlay = async () => {
    const recorderStoped = this.onStopRecord();
    const msg = await this.audioRecorderPlayer.startPlayer(this.state.recordingPath);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });

      return;
    });
  };

  async onPausePlay() {
    await this.audioRecorderPlayer.pausePlayer();
  };

  async onStopPlay() {
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };

  _renderRecordingView() {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);

    if (!playWidth) playWidth = 0;

    return (
      <View style={{ flexDirection: 'row', paddingTop: 15 }}>
        <Pressable>
          <EIcon name="mic" size={22} color={config.secondaryColor} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{}}>{this.state.recordTime}</Text>
        </View>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => {
            this.onStopRecord()
            this.onStopPlay()
            this._switchInputView('texting')
          }}
        >
          {({ pressed }) => (
            <EIcon name="circle-with-cross" size={22} color={pressed
              ? '#ddd'
              : config.secondaryColor
            } />
          )}
        </Pressable>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => this.onStartPlay()}
        >
          {({ pressed }) => (
            <EIcon name="controller-play" size={22} color={pressed
              ? '#ddd'
              : config.secondaryColor
            } />
          )}
        </Pressable>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => this.onStopRecord()}
        >
          {({ pressed }) => (
            <EIcon name="controller-stop" size={22} color={pressed
              ? '#ddd'
              : config.secondaryColor
            } />
          )}
        </Pressable>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => this._handleAttachments('audio')}
        >
          {({ pressed }) => (
            <Icon name="send" size={22} color={pressed
              ? '#ddd'
              : config.secondaryColor
            } />
          )}
        </Pressable>
      </View>
    )
  }

  taggleAttachmentModal = () => {
    this.setState({
      displayModal: !this.state.displayModal
    })
  }

  _renderMessagingView() {
    return (
      <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.state.displayModal}
        onRequestClose={() => this.taggleAttachmentModal()}
      >
        <Pressable
          style={{
            position: 'absolute',
            top:0,right:0,bottom:0,left:0
          }}
          onPress={() => this.taggleAttachmentModal()}
        />
        <View style={ScreenStyle.modalContainer}>
          <Pressable
            style={[ScreenStyle.attachmentBtn, ScreenStyle.attachmentBtnVideo]}
            onPress={() => this._handleAttachments('video-camera')}
          >
            <Text style={ScreenStyle.attachmentBtnLabel}>
              {lang["en"].g.recordVideo}
            </Text>
            <EIcon name='video-camera' size={config.largerFontSize} color='white' />
          </Pressable>
          <Pressable
            style={[ScreenStyle.attachmentBtn, ScreenStyle.attachmentBtnCamera]}
            onPress={() => this._handleAttachments('picture-camera')}
          >
            <Text style={ScreenStyle.attachmentBtnLabel}>
              {lang["en"].g.takeAPicture}
            </Text>
            <Icon name='camera' size={config.largerFontSize} color='white' />
          </Pressable>
          <Pressable
            style={[ScreenStyle.attachmentBtn, ScreenStyle.attachmentBtnGallary]}
            onPress={() => this._handleAttachments('gallary')}
          >
            <Text style={ScreenStyle.attachmentBtnLabel}>
              {lang["en"].g.uploadFromDevice}
            </Text>
            <Icon name='images-sharp' size={config.largerFontSize} color='white' />
          </Pressable>
        </View>
      </Modal>
      <View style={ScreenStyle.textInputContainer}>
        <TextInput
          value={this.state.messageType == "text" ? this.state.messageContent : null}
          style={ScreenStyle.inputField}
          placeholder='Type your message'
          onChangeText={(text) => this.setState({ messageContent: text })}
          multiline
          onFocus={() => this.props.messagesScrollView.scrollToEnd({ animated: true })}
        />
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => this.setState({ displayModal: !this.state.displayModal})}
        >
          <EIcon name="attachment" size={22} color='#aaa' />
        </Pressable>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => {
            this._switchInputView('recording')
            this._handleRecording()
          }}
        >
          {({ pressed }) => (
            <EIcon name="mic" size={22} color='#aaa' />
          )}
        </Pressable>
        <Pressable
          style={ScreenStyle.buttonContainer}
          onPress={() => this._handleSending()}
        >
          {({ pressed }) => (
            <Icon name="send" size={22} color={pressed
              ? config.primaryColor
              : config.secondaryColor
            } />
          )}
        </Pressable>
      </View>
      </>
    );
  }

  render() {
    return (
      <View>
        {this.state.isSending ? 
        <View style={ScreenStyle.sendingIndicatorContainer}>
          <ActivityIndicator size={20} color={config.secondaryColor} />
        </View> : null }
        <View style={ScreenStyle.container}>
          {this.state.inputView === 'recording'
            ? this._renderRecordingView()
            : this._renderMessagingView()}
        </View>
      </View>
    );
  }
};

const ScreenStyle = StyleSheet.create({
  sendingIndicatorContainer: {
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    padding: 8
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  inputField: {
    flex: 1,
    backgroundColor: 'white',
    textAlign: 'left',
    ...Platform.select({ios: { marginBottom: 10 }})
  },
  buttonContainer: {
    marginHorizontal: 5,
    padding: 2,
    marginLeft: 3,
    marginBottom: 6,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  modalContainer: {
    position: 'absolute',
    bottom: 0,
    right: 18,
    padding: 50,
    paddingBottom: 85,
    justifyContent: 'flex-end',
  },

  attachmentBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  attachmentBtnVideo: {
    backgroundColor: config.blueColor
  },

  attachmentBtnCamera: {
    backgroundColor: config.tealColor
  },

  attachmentBtnGallary: {
    backgroundColor: config.greenColor
  },

  attachmentBtnLabel: {
    paddingRight: 15,
    fontSize: config.miniFontSize,
    color: 'white',
  },

  actionSheet: {
    padding: 15,
    paddingTop: 15,
  },

  actionSheetButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
  },

  actionSheetLabel: {
    paddingLeft: 15, 
  }
});

export default InputForm;