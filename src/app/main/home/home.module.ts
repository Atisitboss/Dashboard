import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {MaterialModule} from 'app/material.module';
import {ChartsModule} from 'ng2-charts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {AboutComponent} from './tabs/about/about.component';
import {OverviewComponent} from './tabs/overview/overview.component';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseSidebarModule} from '@fuse/components';
import {FuseWidgetModule} from '@fuse/components';

const routes: Routes = [
    {
        path: '**',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent,
        AboutComponent,
        OverviewComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        MaterialModule,
        ChartsModule,
        NgxChartsModule,
        FuseWidgetModule,
        FuseSidebarModule
    ],
    exports: [
        HomeComponent
    ]
})

export class HomeModule {
}

// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTabsModule } from '@angular/material/tabs';

// import { FuseSharedModule } from '@fuse/shared.module';

// import { ProfileService } from 'app/main/pages/profile/profile.service';
// import { ProfileComponent } from 'app/main/pages/profile/profile.component';
// import { ProfileTimelineComponent } from 'app/main/pages/profile/tabs/timeline/timeline.component';
// import { ProfileAboutComponent } from 'app/main/pages/profile/tabs/about/about.component';
// import { ProfilePhotosVideosComponent } from 'app/main/pages/profile/tabs/photos-videos/photos-videos.component';


// const routes = [
//     {
//         path     : 'profile',
//         component: ProfileComponent,
//         resolve  : {
//             profile: ProfileService
//         }
//     }
// ];

// @NgModule({
//     declarations: [
//         ProfileComponent,
//         ProfileTimelineComponent,
//         ProfileAboutComponent,
//         ProfilePhotosVideosComponent
//     ],
//     imports     : [
//         RouterModule.forChild(routes),

//         MatButtonModule,
//         MatDividerModule,
//         MatIconModule,
//         MatTabsModule,

//         FuseSharedModule
//     ],
//     providers   : [
//         ProfileService
//     ]
// })
// export class ProfileModule
// {
// }