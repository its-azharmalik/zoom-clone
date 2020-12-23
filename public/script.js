const socket = io('/')

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {}

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
}); 

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
     myVideoStream = stream; 
     addVideoStream(myVideo, stream);

     peer.on('call', call => {
         call.answer(stream);
         const video = document.createElement('video')
         call.on('stream', userVideoStream => {
             addVideoStream(video, userVideoStream);
         });
     }, err => {
        console.log('Failed to get local stream' ,err);
     });

     socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) {peers[userId].close()}
})

peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})
socket.emit('join-room', ROOM_ID);




const connectToNewUser = (userId, stream) => {
   const call = peer.call(userId, stream);
   const video = document.createElement('video')
   call.on('stream', userVideoStream => {
       addVideoStream(video, userVideoStream)
   })
   call.on('close', ()=>{
       video.remove();
   })

   peers[userId] = call
}



const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    videoGrid.append(video);

}

let text = document.querySelector('input')



document.querySelector('html').addEventListener('keydown', ( (e)=> {
    if(e.which == 13 && text.value.length !== 0){
        console.log(text.value = this.value)
        socket.emit('message', text.value = this.value)
        text.value = '';
    }
}))


// Mute Unmute Button Functionality

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setUnmuteButton = () =>{
   
    const html = `<span>Unmute</span>`

    document.querySelector('.audio').innerHTML = html
}

const setMuteButton = () =>{
    
     const html = `<span>Mute</span>`

     document.querySelector('.audio').innerHTML = html
 }

 const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    } else {
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayButton = () =>{
   
    const html = `<span>Play Video</span>`

    document.querySelector('.video-btn').innerHTML = html
}

const setStopButton = () =>{
    
     const html = `<span>Stop Video</span>`

     document.querySelector('.video-btn').innerHTML = html
 }
