/*
This Script manages the queue for play.
*/

export interface Queue {
    videoId: string;
    SongName: string;
}

import { ref } from "vue";

let queue: Queue[] = [];
let albumTitle: string = "Unknown Album";
let nextSong: string = "";
let playerRenderKey = ref(0);
let isLoop = ref(false);
let isFavorite = ref(false);

function get_albumTitle(): string {
    return albumTitle;
}

function get_next(): string | null {
    console.log("get_next was called");
    if (isLoop.value) {
        playerRenderKey.value += 1;
        return queue[0]?.videoId || null;
    } else {
        if (queue.length === 1) {
            console.log("queue was ended");
            return null;
        } else {
            nextSong = queue[1].videoId;
            queue.shift();
            console.log("i will play " + nextSong);
            playerRenderKey.value += 1;
            return nextSong;
        }
    }
}

function get_nowSong(): Queue {
    const favoriteList: Queue[] = JSON.parse(localStorage.getItem("favorite") || "[]");
    for (let i = 0; i < favoriteList.length; i++) {
        if (favoriteList[i].videoId === queue[0].videoId) {
            isFavorite.value = true;
            break;
        }
    }
    console.log("isFavorite is " + isFavorite.value);
    return queue.length > 0 ? queue[0] : { videoId: "", SongName: "" };
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
}

function get_playerRenderKey() {
    return playerRenderKey;
}

function onLoopButton() {
    isLoop.value = !isLoop.value;
    console.log("loop is " + isLoop.value);
}

function get_queueTitleList(): string[] {
    console.log("get_queueTitleList was called");
    console.log(queue.map((queue) => queue.SongName));
    return queue.map((map) => map.SongName);
}
function event_favorite(song: Queue | undefined) {
    console.log("event_favorite was called");
    if (song === undefined) {
        console.log("song is undefined");
        return;
    }

    if (!isFavorite.value) {
        console.log("this sons is already favorite");
        if(localStorage.getItem("favorite") === null){
            console.log("favorite is null");
            localStorage.setItem("favorite", JSON.stringify([song]));
        }else{
            console.log("favorite is "+ localStorage.getItem("favorite"));
            let favoriteList = JSON.parse(localStorage.getItem("favorite") || "[]");
            favoriteList.push(song);
            localStorage.setItem("favorite", JSON.stringify(favoriteList));
        }
        isFavorite.value = true;
    }
    else {
        console.log("this song is not favorite");
        let favoriteList: Queue[] = JSON.parse(localStorage.getItem("favorite") || "[]");
        for (let i = 0; i < JSON.parse(localStorage.getItem("favorite") || "[]").length; i++) {
            if (favoriteList[i].videoId === song.videoId) {
                favoriteList.splice(i, 1);
                localStorage.setItem("favorite", JSON.stringify(favoriteList));
                break;
            }
        }
        isFavorite.value = false;
    }
}

export default {
    get_albumTitle,
    get_next,
    get_nowSong,
    add_album,
    del_all,
    get_playerRenderKey,
    onLoopButton,
    get_queueTitleList,
    event_favorite,
    isLoop,
    isFavorite,
};
