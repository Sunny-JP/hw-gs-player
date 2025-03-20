/*
This Script manage the queue for play.
*/

export interface Queue {
    videoId: string;
    SongName: string;
}

import { ref } from "vue";


let queue: Queue[] = [];
let albumTitle: string = "Unknown Album";
let nextSong;
let playerRenderKey = ref(0);
let isLoop: boolean = false;

function get_albumTitle(): string {
    return albumTitle;
}

function get_next(): (string | null) {
    console.log("get_next was called");
    if (isLoop) {
        playerRenderKey.value += 1;
        return queue[0].videoId;
    } else {
        if (queue.length == 1) {
            console.log("queue was ended");
            return null;
        } else {
            nextSong = queue[1].videoId;
            queue.shift();
            console.log("i will play" + nextSong);
            playerRenderKey.value += 1;
            return nextSong;
        }
    };
};

function get_nowSong(): (string|undefined) {
    if(queue.length < 1) {
        return undefined
    } else {
        return queue[0].videoId;
    }
}

function add_album(Album: Queue[], AlbumTitle: string) {
    queue = Album;
    albumTitle = AlbumTitle;
    console.log(queue.map((queue) => queue.SongName));
    playerRenderKey.value += 1;
}

function del_all() {
    queue = [];
    albumTitle = "Unknown Album";
};

function get_playerRenderKey() {
    return playerRenderKey;
}

function onLoopButton() {
    isLoop = !isLoop;
    console.log("loop is " + isLoop);
}

function get_queueTitleList(): (string[]) {
    console.log("get_queueTitleList was called")
    console.log(queue.map((queue) => queue.SongName));
    return queue.map((map) => map.SongName);
}

export default {get_albumTitle, get_next, get_nowSong, add_album, del_all, get_playerRenderKey, onLoopButton, get_queueTitleList };
