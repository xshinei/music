import PlaylistIndex from '../pages/playlist/vPlaylistIndex.vue';
import PickPlaylist from '../pages/playlist/vPickPlaylist.vue';

export default [
    {
        path: '/',
        component: PlaylistIndex,
        name: '',
        meta: {},
        children: [
            
        ]
    },
    {
        path: '/pickPlaylist',
        component: PickPlaylist
    }
];