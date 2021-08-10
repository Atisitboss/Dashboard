import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {DashboardComponent} from './dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {ChartsModule} from 'ng2-charts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FuseWidgetModule} from '@fuse/components';

const routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: ':id',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        ChartsModule,
        NgxChartsModule,
        FuseWidgetModule
    ],
    exports: [
        DashboardComponent
    ]
})

export class DashboardModule {
}
