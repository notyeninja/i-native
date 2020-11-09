import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-geoloc',
  templateUrl: './geoloc.page.html',
  styleUrls: ['./geoloc.page.scss'],
})
export class GeolocPage implements OnInit {

  data:any = []
  constructor(private dbService: DbService) { }

  ngOnInit() {
  }

  async getData() {
      this.data = await this.dbService.getTestData();
      console.warn('got back grom db call');
  }

}
