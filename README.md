# PEIT CHAT RN LIBRARY / DEMO

## IMPORTANT:
* This version of the code is working fine but we have a newer version we've developed on top of this one for one of our projects that is more felexable and optimized that we will implement on this repo very soon.  
* Currently this version of the code is designed to work will with https://peit.io but it can be easily connected to any websocket as long as it stores the data the same way PEIT.io does. And moving forward we will make sure that this copy of the code works with any chat-service providing they build a library to handle operations which means this UI will use the library file to run the operation that are built be the different chat service providers.

## DEPENDENCIES
- Localization (https://github.com/stefalda/localized-strings)  
- Localization (https://github.com/zoontek/react-native-localize)  
- SVG P1 (https://github.com/react-native-svg/react-native-svg#installation)  
- SVG P2 (https://github.com/kristerkari/react-native-svg-transformer)  
- RN Permissions (https://github.com/zoontek/react-native-permissions)  
- Document Picker (https://github.com/rnmods/react-native-document-picker)
- Upload Background (https://github.com/Vydia/react-native-background-upload)
- Image Corp Picker (https://github.com/ivpusic/react-native-image-crop-picker)
- Sound player (https://github.com/johnsonsu/react-native-sound-player#readme)
- Recorder and player (https://github.com/hyochan/react-native-audio-recorder-player)
- File Viewer (https://github.com/vinzscam/react-native-file-viewer#readme)
- moment
- react-native-fs

### TO RUN DEMO PROJECT
- react-native-navigation  

## NEED FIXING
- Audio player on recording play last audio message downloaded.

## TO DO LIST
### TOP PRIORITY
- Locally store chat list and messages.
- Support message queuing.

### NORMAL
- Render unavialable files and images.
- Optimize code.
- Test on iOS.
- Received and read status update.
- Optimize images viewing in messages.
- Show latest message in chat listing.
- Add Search in chat list and in messages.
- Render map links.
- Render downloadable files.
- Add time and date of messages.
- Messages action [delete, edit (on text messages)]
- View and Edit chat options
- Adding perticipants to chat.


## INSTALLATION
### COPYING FILES
- Copy the folder /src/screens/Chat to your project  

### INSTALLING DEPENDENCES
As mentioned above the project uses libraries that required manual installation and processes to complete.  
  
Note that some of those you might already have done for other dependences or you might be using a similare libraries so if you face any errors please open a new issue.  