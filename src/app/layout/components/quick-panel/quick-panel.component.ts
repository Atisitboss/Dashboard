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
    stations: any[] = [];

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
        // this.http.get(`${environment.api}/station/`,
        //     {
        //         headers: new HttpHeaders({
        //             'Content-Type': 'application/json',
        //         })
        //     }
        // ).subscribe((res: any) => {
        //     this.stations = res.data;
        // });

        this.stations.push({id: 1, name: "PU2001 (Injection)"});
        this.stations.push({id: 2, name: "PU2003 (Injection)"});
        this.stations.push({id: 3, name: "Lasting Out / Lasting Conveyor"});
        this.stations.push({id: 4, name: "Lasting In / Check-in Point"});
        this.stations.push({id: 5, name: "Temperature IoT Box: Chiller Machine"})
        this.stations.push({id: 6, name: "Temperature IoT Box: Heat Setting Machine"})
    }

    onUrl(): void {
        this._fuseSidebarService.getSidebar('quickPanel').toggleOpen();
    }
}
