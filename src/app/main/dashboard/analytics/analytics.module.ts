import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {AnalyticsComponent} from './analytics.component';
import {MaterialModule} from 'app/material.module';
import {ChartsModule} from 'ng2-charts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FormsModule} from '@angular/forms';
import {FuseWidgetModule} from '@fuse/components';
import {ExportAsModule} from 'ngx-export-as';
import {SettingDialogComponent} from './setting-dialog/setting-dialog.component';

const routes: Routes = [
    {
        path: '**',
        component: AnalyticsComponent
    }
];

@NgModule({
    declarations: [
        AnalyticsComponent,
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
        FormsModule,
        ExportAsModule
    ],
    exports: [
        AnalyticsComponent
    ],
    providers: []
})

export class AnalyticsModule {
}
