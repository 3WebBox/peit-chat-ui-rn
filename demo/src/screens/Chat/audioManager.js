import AudioRecorderPlayer from 'react-native-audio-recorder-player'

let audioRecorderPlayer = undefined
let currentPath = undefined
let currentCallback = () => { }
let currentPosition = 0

const AUDIO_STATUS = {
  play: 'play',
  begin: 'begin',
  pause: 'pause',
  resume: 'resume',
  stop: 'stop',
}

async function startPlayer(path, callback) {
  if (currentPath === undefined) {
    currentPath = path
    currentCallback = callback
  } else if (currentPath !== path) {
    if (audioRecorderPlayer !== undefined) {
      try {
        await stopPlayer()
      } catch (error) {
        console.error('ERROR STOP PLAYER TOP', error)
      }
    }
    currentPath = path
    currentCallback = callback
  }

  if (audioRecorderPlayer === undefined) {
    audioRecorderPlayer = new AudioRecorderPlayer()
  }

  try {
    const activePath = await audioRecorderPlayer.startPlayer(currentPath);

    console.log('currentPosition', currentPosition);

    currentCallback({
      status: (currentPath === path) && (currentPosition > 0) 
        ? AUDIO_STATUS.resume 
        : AUDIO_STATUS.begin
    });

    audioRecorderPlayer.addPlayBackListener(async (e) => {
      if (e.currentPosition === e.duration) {
        try {
          await stopPlayer()
        } catch (error) {
          console.error('ERROR STOP PLAYER IN LISTENER', error)
        }
      } else {
        currentCallback({
          status: AUDIO_STATUS.play,
          data: e,
          playPositionString: audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition)
          )
        })
      }
      return
    });
  } catch (error) {
    console.error('ERROR PLAY PLAYER', error)
  }
}

async function pausePlayer() {
  try {
    await audioRecorderPlayer.pausePlayer();
    currentCallback({ status: AUDIO_STATUS.pause })
  } catch (error) {
    console.error('ERROR PAUSE PLAYER', error)
  }
}

async function stopPlayer() {
  const isStop = await audioRecorderPlayer.stopPlayer();
  audioRecorderPlayer.removePlayBackListener()
  currentPosition = 0
  currentCallback({ status: AUDIO_STATUS.stop })
  audioRecorderPlayer = undefined
}

export {
  AUDIO_STATUS,
  startPlayer,
  stopPlayer,
  pausePlayer,
}