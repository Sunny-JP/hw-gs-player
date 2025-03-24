import { createRouter, createWebHistory } from 'vue-router';
import Top from "./components/AlbumList.vue";
import About from "./components/About.vue";
import Enquiries from './components/Enquiries.vue';
import Info from './components/Info.vue';
import Policy from './components/Policy.vue';
import Terms from './components/Terms.vue';
import TrackList from './components/TrackList.vue';

const routes = [
  { path: '/', name: 'top', component: Top },
  { path: '/about', name: 'about', component: About },
  { path: '/enquiries', name: 'enquiries', component: Enquiries },
  { path: '/info', name: 'info', component: Info },
  { path: '/policy', name: 'policy', component: Policy },
  { path: '/terms', name: 'terms', component: Terms },
  { path: '/tracklist', name: 'tracklist', component: TrackList },
]

const router = createRouter({
  history: createWebHistory(), // HTML5 History モード
  routes,
})

export default router;