import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {FuseSidebarService} from '../../../../@fuse/components/sidebar/sidebar.service';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent {
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    stations: any[] = [
        {
            name: 'PU2001',
            url: '/dashboard/pu2001'
        },
        {
            name: 'PU2001',
            url: '/dashboard/pu2002'
        },
    ];

    /**
     * Constructor
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }

    onUrl(): void {
        this._fuseSidebarService.getSidebar('quickPanel').toggleOpen();
    }
}
