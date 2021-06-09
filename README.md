# PEIT CHAT RN LIBRARY / DEMO

## IMPORTANT:
* This version of the code is working fine but we have a newer version we've developed on top of this one for one of our projects that is more felexable and optimized that we will implement on this repo very soon.  
* Currently this version of the code is designed to work will with https://peit.io but it can be easily connected to any websocket as long as it stores the data the same way PEIT.io does. And moving forward we will make sure that this copy of the code works with any chat-service providing they build a library to handle operations which means this UI will use the library file to run the operation that are built be the different chat service providers.

## DEPENDENCIES
1. https://github.com/dooboolab/react-native-audio-recorder-player
2. https://github.com/zoontek/react-native-permissions
3. https://github.com/itinance/react-native-fs
4. https://github.com/react-native-image-picker/react-native-image-picker
5. https://github.com/jobtoday/react-native-image-viewing

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
