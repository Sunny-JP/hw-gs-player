/*
This Script manages the queue for play.
*/

import { ref } from "vue";

export interface Queue {
    videoId: string;
    SongName: string;
}

let queue: Queue[] = [];
const albumTitle = ref<string>("Unknown Album");
let nextSong: string= "";
const playerRenderKey = ref(0);
const isLoop = ref(false);
const isFavorite = ref(false);
let songIndex:number = 0;

function get_albumTitle(): string {
    return albumTitle.value;
}

function get_next(){
    console.log("get_next was called");
    if (isLoop.value) {
        console.log("loop is true");
        playerRenderKey.value += 1;
    } else {
        songIndex++;
        if (queue[songIndex] === null) {
            console.log("queue was ended");
        } else {
            nextSong = queue[songIndex].videoId;
            console.log("i will play " + nextSong);
            playerRenderKey.value += 1;
        }
    }
}

function get_nowSong(): Queue {
    const favoriteList: Queue[] = JSON.parse(localStorage.getItem("favorite") || "[]");
    for (let i = 0; i < favoriteList.length; i++) {
        if (favoriteList[i].videoId === queue[songIndex]?.videoId) {
            isFavorite.value = true;
            break;
        }else{
            isFavorite.value = false;
        }
    }
    const currentSong: Queue = queue[songIndex];
    return currentSong;
}

function add_album(Album: Queue[], AlbumTitle: string) {
    queue = [...Album];
    albumTitle.value = AlbumTitle;
    console.log(queue.map((queue) => queue.SongName));
    playerRenderKey.value += 1;
}

function del_all() {
    queue = [];
    albumTitle.value = "Unknown Album";
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
        console.log("this song is already favorite");
        if (localStorage.getItem("favorite") === null) {
            console.log("favorite is null");
            localStorage.setItem("favorite", JSON.stringify([song]));
        } else {
            console.log("favorite is " + localStorage.getItem("favorite"));
            let favoriteList = JSON.parse(localStorage.getItem("favorite") || "[]");
            favoriteList.push(song);
            localStorage.setItem("favorite", JSON.stringify(favoriteList));
        }
        isFavorite.value = true;
    } else {
        console.log("this song is not favorite");
        let favoriteList: Queue[] = JSON.parse(localStorage.getItem("favorite") || "[]");
        for (let i = 0; i < favoriteList.length; i++) {
            if (favoriteList[i].videoId === song.videoId) {
                favoriteList.splice(i, 1);
                localStorage.setItem("favorite", JSON.stringify(favoriteList));
                break;
            }
        }
        isFavorite.value = false;
    }
}

function play_in_queue(recivedIndex: number) {
    songIndex = recivedIndex;
    console.log("songIndex is "+songIndex+"(in play_in_queue()")
    playerRenderKey.value++;
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
    play_in_queue,
    isLoop,
    isFavorite,
    queue,
};