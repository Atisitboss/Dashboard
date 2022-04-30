import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.scss']
})
export class SettingDialogComponent implements OnInit {

  topics: any[] = [
  {
    name: 'PANGOAI',
    groupValue: [
      {id: 1, value: "Lasting In", stationname: "/PANGO_AI/JETSON01/LASTING_IN"},
      {id: 2, value: "Lasting Out", stationname: "/PANGO_AI/JETSON01/LASTING_OUT"},
      {id: 3, value: "PU2001", stationname: "/PANGO_AI/JETSON01/PU2001"},
      {id: 4, value: "PU2003", stationname: "/PANGO_AI/JETSON01/PU2003"}
    ]
  }, {
    name: 'SMARTPANGO',
    groupValue: [
      {id: 1, value: "Cold Oven", stationname: "/SMARTPANGO/LASTING/COLDOVEN"}, 
      {id: 2, value: "Hot Oven", stationname: "/SMARTPANGO/LASTING/HOTOVEN"}
    ]
  }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SettingDialogComponent>) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({
      selected: this.data.selected
    });
  }

}
