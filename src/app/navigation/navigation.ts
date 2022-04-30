import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id      : 'home',
                title   : 'Home',
                type    : 'item',
                icon    : 'home',
                url     : '/home'
            },
            {
                id       : 'dashboard',
                title    : 'Dashboards',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
                    {
                        id   : 'analytics',
                        title: 'Analytics',
                        type : 'item',
                        url  : '/dashboard/analytics'
                    },
                    {
                        id   : 'project',
                        title: 'Project',
                        type : 'item',
                        url  : '/dashboard/project'
                    }
                ]
            }
        ]
    }
];
