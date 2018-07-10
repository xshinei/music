import PlaylistIndex from '../pages/playlist/vPlaylistIndex.vue';
import PickPlaylist from '../pages/playlist/vPickPlaylist.vue';
import PlaylistContent from '../pages/playlist/vPlaylistContent.vue';

export default [
    {
        path: '/',
        component: PlaylistIndex,
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
    }
];