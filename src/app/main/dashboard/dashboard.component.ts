import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {Widgets} from './dashboard.data';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    widgets = Widgets;
    machine: any;
    counts: any[];
    colors: string[] = [
        '#30C5FF', '#B61919', '#5C946E',
    ];
    oEEs: any[];
    constructor(
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
    ) {
        this._registerCustomChartJSPlugin();
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.loadCounts(params.id);
                this.loadOEEs(params.id);
            }
        });

    }

    loadCounts(id: number): void {
        this.http.get(`${environment.api}/count/${id}/`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            }).subscribe((res: any) => {
            this.counts = res.data;
        });
    }

    loadOEEs(id: number): void {
        this.http.get(`${environment.api}/oee/${id}/`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            }).subscribe((res: any) => {
            this.oEEs = res.data;
        });
    }

    customColors = (index) => this.colors[0];

    private _registerCustomChartJSPlugin(): void {
        (window as any).Chart.plugins.register({
            // tslint:disable-next-line:only-arrow-functions
            afterDatasetsDraw: function(chart, easing): any {

                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                // tslint:disable-next-line:only-arrow-functions
                chart.data.datasets.forEach(function(dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        // tslint:disable-next-line:only-arrow-functions
                        meta.data.forEach(function(element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }
}
