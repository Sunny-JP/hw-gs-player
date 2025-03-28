/*
This Script manages the queue for play.
*/

import { ref } from "vue";
import { useI18n } from "vue-i18n";

export interface Queue {
    videoId: string;
    SongName: string;
}

const queue = ref<Queue[]>([]);
const albumTitle = ref<string>("Unknown Album");
const nextSong = ref<string>("");
const playerRenderKey = ref(0);
const isLoop = ref(false);
const isFavorite = ref(false);

function get_albumTitle(): string {
    return albumTitle.value;
}

function get_next(): string | null {
    console.log("get_next was called");
    if (isLoop.value) {
        playerRenderKey.value += 1;
        return queue.value[0]?.videoId || null;
    } else {
        if (queue.value.length === 1) {
            console.log("queue was ended");
            return null;
        } else {
            nextSong.value = queue.value[1].videoId;
            queue.value.shift();
            console.log("i will play " + nextSong.value);
            playerRenderKey.value += 1;
            return nextSong.value;
        }
    }
}

function get_nowSong(): Queue {
    const { t } = useI18n();

    const favoriteList: Queue[] = JSON.parse(localStorage.getItem("favorite") || "[]");
    for (let i = 0; i < favoriteList.length; i++) {
        if (favoriteList[i].videoId === queue.value[0]?.videoId) {
            isFavorite.value = true;
            break;
        }
    }
    console.log("isFavorite is " + isFavorite.value);

    const currentSong = queue.value.length > 0 ? queue.value[0] : { videoId: "", SongName: "" };
    return {
        ...currentSong,
        SongName: t(currentSong.SongName),
    };
}

function add_album(Album: Queue[], AlbumTitle: string) {
    queue.value = [...Album];
    albumTitle.value = AlbumTitle;
    console.log(queue.value.map((queue) => queue.SongName));
    playerRenderKey.value += 1;
}

function del_all() {
    queue.value = [];
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
    console.log(queue.value.map((queue) => queue.SongName));
    return queue.value.map((map) => map.SongName);
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
    queue,
};