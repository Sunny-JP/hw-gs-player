/*
This Script manage the queue for play.
*/


let queue: string[] = [];
let albumTitle: string = "Unknown Album";
let nextSong;

function get_albumTitle(): string {
    return albumTitle;
}

function get_next(): (string|null) {
    if(queue.length == 1){
        console.log("queue was ended");
        return null;
    }else{
    nextSong = queue[1];
    queue.shift();
    console.log("i will play" + nextSong);
    return nextSong;
    }
};

function get_nowSong(): (string|null) {
    if(queue.length == 0){
        console.log("Queue is empty now.");
        return null;
    }else{
        return queue[0];
    }
}

function add_album(VideoIdArray: string[],AlbumTitle: string) {
    queue = VideoIdArray;
    albumTitle = AlbumTitle;
}

function del_all() {
   queue = [];
   albumTitle = "Unknown Album";
};

function interrupt(VideoIdArray: string[]) {
    queue = VideoIdArray;
};

export default {get_albumTitle, get_next, get_nowSong, add_album, del_all, interrupt};