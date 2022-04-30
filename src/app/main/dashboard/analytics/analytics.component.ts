import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, Event, NavigationEnd} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from '@fuse/animations';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {SettingDialogComponent} from './setting-dialog/setting-dialog.component';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsComponent implements OnInit {

    serverData: any;
    selected: any;
    currentRoute: any = "/home";

    stations: any;
    stationName: any = "";
    date = new FormControl(new Date());
    dateInput: any = this.stationName + "/" + this.date.value.getFullYear() + "-" + (this.date.value.getMonth()+1) + "-" + this.date.value.getDate();
    
    stationStatus: string = "green";
    stationLiveTimestamp: any = "";
    liveChart: any;
    liveMqtt: boolean = false;
    dataInterval: any;

    total: any;
    totalValueOne: any;
    totalValueTwo: any;
    total_lastUpdated: any;
    totalValueOne_lastUpdated: any;
    totalValueTwo_lastUpdated: any;
    valueDate: any;

    pieChart: any;
    view: any[] = [400, 250]; 
    cardColor: string = '#232837';

    barChart: any;
    lineChart: any;
    valueOneHourArray: any[];
    valueTwoHourArray: any[];
    valueOneCountOccurrences: any;
    valueTwoCountOccurrences: any;
    
    timeDistributionChart: any;
    stationTotal: any;
    stationValueOne: any;
    stationValueTwo: any;
    stationValueOnePercent: any;
    stationValueTwoPercent: any; 

    monthlyChart: any;
    selectedMonth: any = this.date.value.getMonth()+1;

    maxTemp: any;
    minTemp: any;
    maxTempTimestamp: any;
    minTempTimestamp: any;
    tempFirstPeriod: any;
    tempSecondPeriod: any;
    tempThirdPeriod: any;
    tempFourthPeriod: any; 
    tempFifthPeriod: any;
    tempSixthPeriod: any; 
    tempBarChart: any;
    tempLineChart: any;
    tempSeries: any;
    tempData: any;

    selectedDistributionType: any = "Standard Pie Chart";
    selectedTimePeriodsType: any = "Stacked Bar Chart";
    selectedTempTimePeriods: any = "8";
    selectedTimePeriodsDistribution: any = "06.00 - 08.59";
    timePeriods: any = ["6.00 - 8.59", "9.00 - 11.59", "12.00 - 14.59", "15.00 - 17.59", "18.00 - 19.59"];

    valueOneLabel: string;
    valueTwoLabel: string;
    distributionScheme: any = {
        domain: ['#36a2eb', '#f44336']
    };
    timePeriodsScheme: any = {
        domain: ['#189ab4', '#75e6da']
    };
    showLegend: boolean = true;
    showLabels: boolean = true;
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    showXAxisLabel: boolean = true;
    showYAxisLabel: boolean = true;

    constructor(private dialog: MatDialog, private httpClient: HttpClient, private router: Router, private formBuilder: FormBuilder) {
        this.router.events.subscribe((event: Event) => {
            if(event instanceof NavigationEnd) {
                this.currentRoute = event.url;
                this.currentRoute = this.currentRoute.substring(21);

                try {
                    var name = this.stations[this.currentRoute.substring(7)-1].name;
                    this.stationName = name;

                    this.dateInput = this.stationName + "/" + this.date.value.getFullYear() + "-" + (this.date.value.getMonth()+1) + "-" + this.date.value.getDate();
                    this.setLabels();
                    this.createDisplays();
                    this.createTemperatureDisplays(this.selectedTempTimePeriods);
                }
                catch {}
            }
        });
    }

    ngOnInit(): void {
        this.getAnalyticsStations();
    }

    setLabels(): void {
        if(this.stationName == "PU2001" || this.stationName == "PU2003") {
            this.valueOneLabel = "Good Shoes";
            this.valueTwoLabel = "Defected Shoes";
        }
        else if(this.stationName == "Lasting Out" || this.stationLiveTimestamp == "Lasting In") {
            this.valueOneLabel = "Top Tray";
            this.valueTwoLabel = "Bottom Tray";
        }
    }

    eventDateChange(event: MatDatepickerInputEvent<Date>): void {
        this.date = new FormControl(event.value);
        this.dateInput = this.stationName + "/" + event.value.getFullYear() + "-" + (event.value.getMonth()+1) + "-" + event.value.getDate();
        this.createDisplays();
        this.createTemperatureDisplays(this.selectedTempTimePeriods);
    }

    viewBarChartOption1(barChartType: any): void {
        this.selectedDistributionType = barChartType;
    }

    viewBarChartOption2(barChartType: any): void {
        this.selectedTimePeriodsType = barChartType;
    }

    viewTimeOption(timePeriod: any): void {
        this.selectedTimePeriodsDistribution = timePeriod;
        this.createTimePeriodsDistribution();
    }

    viewMonthOption(month: any): void {
        this.selectedMonth = month;
        this.createMonthlyChart();
    }

    getAnalyticsStations(): void {
        this.httpClient.get("http://127.0.0.1:5000/getAnalyticsStation").subscribe(data => {
            this.stations = data;
        });
    }

    createNewStation(): void {
        const dialogRef = this.dialog.open(SettingDialogComponent, {
            width: '750px',
            data: {
                selected: this.selected
            }
        });

        dialogRef.afterClosed().subscribe(data => {
            this.serverData = data;
            this.selected = this.serverData.selected;

            this.httpClient.post("http://127.0.0.1:5000/addAnalyticsStation", this.selected).subscribe();
            this.getAnalyticsStations();
        });
    }

    createDisplays(): void {
        this.httpClient.get("http://127.0.0.1:5000/connect/" + this.dateInput).subscribe(data => {
            this.createDisplaysAndGraphs(data);
        });
    }

    createDisplaysAndGraphs(input: any): void {
        this.serverData = input;
        
        try {
            if(this.stationName == "PU2001" || this.stationName == "PU2003") {
                this.serverData.forEach(obj => this.renameKey(obj, 'good_shoes', 'value1'));
                this.serverData.forEach(obj => this.renameKey(obj, 'defected_shoes', 'value2'));
                this.serverData.forEach(obj => this.renameKey(obj, 'good_timestamp', 'value1_timestamp'));
                this.serverData.forEach(obj => this.renameKey(obj, 'defected_timestamp', 'value2_timestamp'));
            }

            else if(this.stationName == "Lasting In" || this.stationName == "Lasting Out") {
                this.serverData.forEach(obj => this.renameKey(obj, 'top_tray', 'value1'));
                this.serverData.forEach(obj => this.renameKey(obj, 'bottom_tray', 'value2'));
                this.serverData.forEach(obj => this.renameKey(obj, 'top_timestamp', 'value1_timestamp'));
                this.serverData.forEach(obj => this.renameKey(obj, 'bottom_timestamp', 'value2_timestamp'));
            }
        }
        catch {}

        var element = this.serverData;
        var firstElement = this.serverData[0];
        var lastElement = this.serverData[this.serverData.length-1];

        //Resetting the values
        this.totalValueOne = 0;
        this.totalValueTwo = 0;
        this.total = 0;
        this.valueDate = "";
        this.totalValueOne_lastUpdated = 0;
        this.totalValueTwo_lastUpdated = 0;
        this.total_lastUpdated = 0;

        this.totalValueOne = parseInt(lastElement.value1) - parseInt(firstElement.value1);
        this.totalValueTwo = parseInt(lastElement.value2) - parseInt(firstElement.value2);
        this.total = this.totalValueOne + this.totalValueTwo;

        this.valueDate = lastElement.date;
        this.totalValueOne_lastUpdated = lastElement.value1_timestamp;
        this.totalValueTwo_lastUpdated = lastElement.value2_timestamp;

        if(this.getUnitOfTime("time", this.totalValueOne_lastUpdated) > this.getUnitOfTime("time", this.totalValueTwo_lastUpdated))
            this.total_lastUpdated = this.totalValueOne_lastUpdated;
        else
            this.total_lastUpdated = this.totalValueTwo_lastUpdated;

        /* Pie Chart Distribution */
        this.pieChart = [];

        this.pieChart = [
            {
                name: this.valueOneLabel,
                value: this.totalValueOne
            },
            {
                name: this.valueTwoLabel,
                value: this.totalValueTwo
            }
        ];

        /* Time Periods Chart */
        this.valueOneHourArray = [];
        this.valueTwoHourArray = [];
        this.valueOneCountOccurrences = {};
        this.valueTwoCountOccurrences = {};

        for(var i = 1; i < element.length; i++) {
            // Dummy dates, their times are only used
            var valueOneDateTime = new Date(2022, 4, 18, (element[i].value1_timestamp).substring(0, 2), (element[i].value1_timestamp).substring(3, 5), (this.serverData[i].value1_timestamp).substring(6, 8));
            var valueTwoDateTime = new Date(2022, 4, 18, (element[i].value2_timestamp).substring(0, 2), (element[i].value2_timestamp).substring(3, 5), (this.serverData[i].value2_timestamp).substring(6, 8));

            var valueOneHourstamp = this.getUnitOfTime("hour", valueOneDateTime);
            var valueTwoHourstamp = this.getUnitOfTime("hour", valueTwoDateTime);

            if(parseInt(element[i].value1) != parseInt(element[i-1].value1)) {
                var diff = parseInt(element[i].value1) - parseInt(element[i-1].value1);
                
                for(var j = 0; j < diff; j++)
                    this.valueOneHourArray.push(valueOneHourstamp);
            }
            if(parseInt(element[i].value2) != parseInt(element[i-1].value2)) {
                var diff = parseInt(element[i].value2) - parseInt(element[i-1].value2);

                for(var j = 0; j < diff; j++)
                    this.valueTwoHourArray.push(valueTwoHourstamp);
            }
        }

        for(const num of this.valueOneHourArray)
            this.valueOneCountOccurrences[num] = this.valueOneCountOccurrences[num] ? this.valueOneCountOccurrences[num] + 1 : 1;
        for(const num of this.valueTwoHourArray)
            this.valueTwoCountOccurrences[num] = this.valueTwoCountOccurrences[num] ? this.valueTwoCountOccurrences[num] + 1 : 1;

        for(var i = 0; i <= 23; i++) {
            if(this.valueOneCountOccurrences[i] == undefined)
                this.valueOneCountOccurrences[i] = 0;
            if(this.valueTwoCountOccurrences[i] == undefined)
                this.valueTwoCountOccurrences[i] = 0;
        }

        this.barChart = [];
        this.lineChart = [];
        var series1 = []
        var series2 = []

        var tpIndex = 0;
        var firstIndex = 6;
        var secondIndex = 7;
        var thirdIndex = 8;

        while(tpIndex != this.timePeriods.length) {
            this.barChart.push(
                {
                    "name": this.timePeriods[tpIndex],
                    "series": [
                        {
                            "name": this.valueOneLabel,
                            "value": this.valueOneCountOccurrences[firstIndex] + this.valueOneCountOccurrences[secondIndex] + this.valueOneCountOccurrences[thirdIndex]
                        },
                        {
                            "name": this.valueTwoLabel,
                            "value": this.valueTwoCountOccurrences[firstIndex] + this.valueTwoCountOccurrences[secondIndex] + this.valueTwoCountOccurrences[thirdIndex]
                        }
                    ]
                }
            )

            series1.push(
                {
                    "name": this.timePeriods[tpIndex],
                    "value": this.valueOneCountOccurrences[firstIndex] + this.valueOneCountOccurrences[secondIndex] + this.valueOneCountOccurrences[thirdIndex]
                }
            );

            series2.push(
                {
                    "name": this.timePeriods[tpIndex],
                    "value": this.valueTwoCountOccurrences[firstIndex] + this.valueTwoCountOccurrences[secondIndex] + this.valueTwoCountOccurrences[thirdIndex]
                }
            );

            tpIndex++; 
            firstIndex = firstIndex + 3; 
            secondIndex = secondIndex + 3; 
            thirdIndex = thirdIndex + 3;
        }

        this.lineChart = [
            {
                "name": this.valueOneLabel,
                "series": series1
            },
            {
                "name": this.valueTwoLabel,
                "series": series2
            }
        ];

        this.viewTimeOption("06.00 - 08.59");
        this.viewMonthOption(this.date.value.getMonth()+1);
    }

    createTimePeriodsDistribution(): void {
        //Time periods' distribution chart
        this.timeDistributionChart = [];
        
        this.stationValueOne = 0;
        this.stationValueTwo = 0;
        this.stationValueOnePercent = 0;
        this.stationValueTwoPercent = 0; 

        if(this.selectedTimePeriodsDistribution == "06.00 - 08.59") {
            this.stationValueOne = this.barChart[0].series[0].value;
            this.stationValueTwo = this.barChart[0].series[1].value
        }
        else if(this.selectedTimePeriodsDistribution == "09.00 - 11.59") {
            this.stationValueOne = this.barChart[1].series[0].value;
            this.stationValueTwo = this.barChart[1].series[1].value
        }
        else if(this.selectedTimePeriodsDistribution == "12.00 - 14.59") {
            this.stationValueOne = this.barChart[2].series[0].value;
            this.stationValueTwo = this.barChart[2].series[1].value
        }
        else if(this.selectedTimePeriodsDistribution == "15.00 - 17.59") {
            this.stationValueOne = this.barChart[3].series[0].value;
            this.stationValueTwo = this.barChart[3].series[1].value
        }
        else if(this.selectedTimePeriodsDistribution == "18.00 - 19.59") {
            this.stationValueOne = this.barChart[4].series[0].value;
            this.stationValueTwo = this.barChart[4].series[1].value
        }
        
        this.timeDistributionChart = [
            {
                name: this.valueOneLabel,
                value: this.stationValueOne
            },
            {
                name: this.valueTwoLabel,
                value: this.stationValueTwo
            }
        ];

        this.stationTotal = this.stationValueOne + this.stationValueTwo;
        this.stationValueOnePercent = ((this.stationValueOne / this.stationTotal) * 100).toFixed(2);
        this.stationValueTwoPercent = ((this.stationValueTwo / this.stationTotal) * 100).toFixed(2);
    }

    createMonthlyChart(): void {
        //Getting the first and last dates from the given month input
        var currentDate = new Date();
        var firstDate = new Date(currentDate.getFullYear(), (this.selectedMonth-1), 1);
        var lastDate = new Date(currentDate.getFullYear(), (this.selectedMonth-1) + 1, 0);

        var x = firstDate.getFullYear() + "-" + (firstDate.getMonth()+1) + "-" + firstDate.getDate();
        var y = lastDate.getFullYear() + "-" + (lastDate.getMonth()+1) + "-" + lastDate.getDate();

        this.httpClient.get("http://127.0.0.1:5000/connect/" + this.stationName + "/" + x + "&" + y).subscribe(data => {
            this.serverData = data;

            try {
                if(this.stationName == "PU2001" || this.stationName == "PU2003") {
                    this.serverData.forEach(obj => this.renameKey(obj, 'good_shoes', 'value1'));
                    this.serverData.forEach(obj => this.renameKey(obj, 'defected_shoes', 'value2'));
                }

                else if(this.stationName == "Lasting In" || this.stationName == "Lasting Out") {
                    this.serverData.forEach(obj => this.renameKey(obj, 'top_tray', 'value1'));
                    this.serverData.forEach(obj => this.renameKey(obj, 'bottom_tray', 'value2'));
                }
            }
            catch {}

            this.monthlyChart = [];
            var series1 = [];
            var series2 = [];

            var index = 0;
            
            for(var i = firstDate.getDate(); i <= lastDate.getDate(); i++) {
                var valueOne = 0;
                var valueTwo = 0;

                var currentDate = parseInt(this.serverData[index].date.substring(8));

                if(currentDate == i) {
                    var valueOne = parseInt(this.serverData[index].value1);
                    var valueTwo = parseInt(this.serverData[index].value2);
                    
                    if(index < this.serverData.length-1)
                        index++;
                } 

                series1.push(
                    {
                        "name": i + "/" + (firstDate.getMonth()+1),
                        "value": valueOne
                    }
                );

                series2.push(
                    {
                        "name": i + "/" + (firstDate.getMonth()+1),
                        "value": valueTwo
                    }
                );
            }

            this.monthlyChart = [
                {
                    "name": this.valueOneLabel,
                    "series": series1
                },
                {
                    "name": this.valueTwoLabel,
                    "series": series2
                }
            ];
        });
    }

    createTemperatureDisplays(hour: number): void {
        this.httpClient.get("http://127.0.0.1:5000/connect/" + this.dateInput).subscribe(data => {
            this.serverData = data;

            try {
                this.serverData.forEach(obj => this.renameKey(obj, 'pt100', 'temperature'));
            }
            catch {}

            this.tempFirstPeriod = [];
            this.tempSecondPeriod = [];
            this.tempThirdPeriod = [];
            this.tempFourthPeriod = []; 
            this.tempFifthPeriod = [];
            this.tempSixthPeriod = []; 

            this.tempBarChart = [];
            this.tempLineChart = [];
            this.tempSeries = [];
            this.tempData = [];

            for(var i = 0; i < this.serverData.length; i++) {
                this.tempData.push(this.serverData[i].temperature);
                var timestamp = new Date(2022, 4, 18, (this.serverData[i].timestamp).substring(0, 2), (this.serverData[i].timestamp).substring(3, 5), (this.serverData[i].timestamp).substring(6, 8));

                // 1 - 10, 11 - 20, 21 - 30, 31 - 40, 41 - 50, 51 - 00
                if(parseInt(this.getUnitOfTime("hour", timestamp)) == hour) {
                    if((this.getUnitOfTime("minute", timestamp) > 0) && this.getUnitOfTime("minute", timestamp) <= 10)
                        this.tempFirstPeriod.push(parseFloat(this.serverData[i].temperature));
                
                    else if((this.getUnitOfTime("minute", timestamp) > 10) && this.getUnitOfTime("minute", timestamp) <= 20)
                        this.tempSecondPeriod.push(parseFloat(this.serverData[i].temperature));

                    else if((this.getUnitOfTime("minute", timestamp) > 20) && this.getUnitOfTime("minute", timestamp) <= 30) 
                        this.tempThirdPeriod.push(parseFloat(this.serverData[i].temperature));

                    else if((this.getUnitOfTime("minute", timestamp) > 30) && this.getUnitOfTime("minute", timestamp) <= 40)
                        this.tempFourthPeriod.push(parseFloat(this.serverData[i].temperature));

                    else if((this.getUnitOfTime("minute", timestamp) > 40) && this.getUnitOfTime("minute", timestamp) <= 50)
                        this.tempFifthPeriod.push(parseFloat(this.serverData[i].temperature));

                    else if((this.getUnitOfTime("minute", timestamp) > 50) && this.getUnitOfTime("minute", timestamp) < 60)
                        this.tempSixthPeriod.push(parseFloat(this.serverData[i].temperature));
                }
            }

            this.tempData.sort();
            this.maxTemp = this.tempData[this.tempData.length-1];
            this.minTemp = this.tempData[0];

            this.tempSeries = [
                {
                    "name": hour + ".00 - " + hour + ".10",
                    "value": this.average(this.tempFirstPeriod)
                },
                {
                    "name": hour + ".11 - " + hour + ".20",
                    "value": this.average(this.tempSecondPeriod)
                },
                {
                    "name": hour + ".21 - " + hour + ".30",
                    "value": this.average(this.tempThirdPeriod)
                },
                {
                    "name": hour + ".31 - " + hour + ".40",
                    "value": this.average(this.tempFourthPeriod)
                },
                {
                    "name": hour + ".41 - " + hour + ".50",
                    "value": this.average(this.tempFifthPeriod)
                },
                {
                    "name": hour + ".51 - " + hour + ".59",
                    "value": this.average(this.tempSixthPeriod)
                }
            ]
            
            this.tempBarChart = this.tempSeries;

            this.tempLineChart = [
                {
                    "name": "Average Temperature °C",
                    "series": this.tempSeries
                }
            ];
        });
    }

    renameKey(obj: any, oldKey: any, newKey: any): void {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }

    getUnitOfTime(unitOfTime: String, strDatetime: any): any {
        let result;
        //Getting minutes
        if(unitOfTime == "minute") {
            result = new Date(strDatetime).getMinutes();
        }
        //Getting hour
        else if(unitOfTime == "hour") {
            result = new Date(strDatetime).getHours();
        }
        //Getting day
        else if(unitOfTime == "day") {
            result = new Date(strDatetime).getDay();
        }
        //Getting timestamp
        else if(unitOfTime == "time") {
            result = new Date(strDatetime).getTime();
        }
        return result;
    }

    average(input: any[]): any {
        let sum = 0;
        let average = 0;
        for(var i = 0; i < input.length; i++) {
            sum += input[i];
        }
        average = sum / input.length;
        if(input.length == 0)
            average = 0;

        return average;
    }

}