# Synchron

A Karaoke application made in Virtual Reality.

You can visit the application [here](https://synchron.ml/)

If you are using the application from your phone, the phone's gyroscope will control the camera.

If you are using a computer, you would have to drag the mouse pointer around to control the camera.

## Features :-

* This application is multiplayer so you can enjoy the Karaoke experience with your friends.

* Users in a room can hear each other sing in real-time.

* The music player is synchronised across all users in a room. 
  (If one user pauses the music, it gets paused for everyone in that room) 
 
* Users can see each other's avatars for a real-life karaoke experience.

* The room also has the feature of 3D surround sound.
  ( The volume increases/decreases proportionately with respect to the distance from the speakers)


## A brief guide to get started :-

There are four buttons in a panel at the end of the V-Room. Hovering over them with the a-frame pointer
would execute the given action.

* Play     ->  Will start playing the song in the queue
* Pause    ->  Will pause/resume the song
* Next     ->  Will play the next song in the queue
* Playlist ->  Shows the playlist for adding songs to the queue

(Note :- You would need to add songs to the queue before playing them.)

(Note :- Executing the above actions would reflect on all users in the same room.)


## Tech Stack :-

* Node.js as the backend language

* Express.js for routing

* Peer.js for establishing peer-to-peer connections

* Socket.io for synchronising the music player across all users in a room

* A-Frame for building the Virtual Reality environment
