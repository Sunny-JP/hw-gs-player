<script setup lang="ts">
    import type { Queue } from "../queue";
    let favorite_list: Queue[] = [];
    if (localStorage.getItem("favorite") === null) {
        favorite_list = [{SongName: "Favotite List is Empty", videoId: ""}];
        console.log("Favorite List is Empty");
    }else
    {
        favorite_list = JSON.parse(localStorage.getItem("favorite") || "");
    }
</script>

<template>
    <div class="page">
        <h1>Favorite List</h1>
        <ul>
            <li v-for="item in favorite_list">
                {{ item.SongName }}
            </li>
        </ul>
    </div>
</template>