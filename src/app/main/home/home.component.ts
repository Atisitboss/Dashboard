import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class HomeComponent implements OnInit {

  dateNow = Date.now();

  constructor(private _fuseSidebarService: FuseSidebarService,) {
    setInterval(() => {
      this.dateNow = Date.now();
    }, 1000);
  }

  ngOnInit() {
  }

}
