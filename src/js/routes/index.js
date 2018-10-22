import Index from '../pages/index/vIndex.vue';
import PlaylistIndex from '../pages/playlist/vPlaylistIndex.vue';
import PickPlaylist from '../pages/playlist/vPickPlaylist.vue';
import PlaylistContent from '../pages/playlist/vPlaylistContent.vue';
import Player from '../pages/player/vPlayer.vue';

export default [
    {
        path: '/',
        component: Index,
        name: '',
        meta: {
            index: 1
        },
        children: [
            
        ]
    },
    {
        path: '/pickPlaylist',
        component: PickPlaylist,
        meta: {
            index: 2
        }
    },
    {
        path: '/playlistContent/:id',
        component: PlaylistContent,
        meta: {
            index: 3
        }
    },
    {
        path: '/player/:id',
        component: Player,
        meta: {
            index: 4
        }
    }
];