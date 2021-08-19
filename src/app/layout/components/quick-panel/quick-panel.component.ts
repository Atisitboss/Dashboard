import {Component, ViewEncapsulation} from '@angular/core';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';

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
    stations: any[];

    /**
     * Constructor
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
        this.onLoadStations();
    }

    onLoadStations(): void {
        this.http.get(`${environment.api}/station/`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            }
        ).subscribe((res: any) => {
            this.stations = res.data;
        });
    }

    onUrl(): void {
        this._fuseSidebarService.getSidebar('quickPanel').toggleOpen();
    }
}
