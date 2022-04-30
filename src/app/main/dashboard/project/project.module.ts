import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {ProjectComponent} from './project.component';
import {MaterialModule} from 'app/material.module';
import {ChartsModule} from 'ng2-charts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FuseWidgetModule} from '@fuse/components';
import {FormsModule} from '@angular/forms';
import {SettingDialogComponent} from './setting-dialog/setting-dialog.component';

const routes: Routes = [
    {
        path: '**',
        component: ProjectComponent
    }
];

@NgModule({
    declarations: [
        ProjectComponent,
        SettingDialogComponent
    ],
    entryComponents: [SettingDialogComponent],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        MaterialModule,
        ChartsModule,
        NgxChartsModule,
        FuseWidgetModule,
        FormsModule
    ],
    exports: [
        ProjectComponent
    ]
})

export class ProjectModule {
}
