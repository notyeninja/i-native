import { Component, OnInit } from "@angular/core";
import { DbService } from "../services/db.service";
import { Subscription, timer, Subject, from, of } from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from "@ionic-native/device-motion/ngx";
import { repeatWhen, switchMap, takeUntil, combineAll } from "rxjs/operators";

@Component({
  selector: "app-sensors",
  templateUrl: "./sensors.page.html",
  styleUrls: ["./sensors.page.scss"],
})
export class SensorsPage implements OnInit {
  
  private takeAgain = new Subject<void>();
  private stop = new Subject<void>();
  private timeInterval = 5000;
  private joinedSubscription: Subscription;

  position:any;
  err:any;

  constructor(
    private dbService: DbService,
    private deviceMotion: DeviceMotion,
    private geoLocation: Geolocation
  ) {}

  ngOnInit() {}

  startTracking(): void {
    let motion$ = this.deviceMotion.watchAcceleration({
      frequency: this.timeInterval,
    });
    let geo$ = timer(this.timeInterval).pipe(
      switchMap(() => from(this.geoLocation.getCurrentPosition())),
      takeUntil(this.stop),
      repeatWhen(() => this.takeAgain)
    );

    this.joinedSubscription = of(motion$, geo$)
      .pipe(combineAll())
      .subscribe(
        (results) => {
          console.warn("inside subscription of tracking");
          const acc = results[0] as DeviceMotionAccelerationData;
          const geo = results[1] as Geoposition;
          let position = {
            lat: geo.coords.latitude,
            lng: geo.coords.longitude,
            heading: geo.coords.heading,
            speed: geo.coords.speed,
            timestamp: geo.timestamp,
          };
          let dataToSave = {
            displacement: acc,
            position: position
          };
          
          this.dbService.insertTestData(dataToSave);
          this.takeAgain.next();
        },
        (err) => {
          console.error(err);
          this.err = err;
          this.dbService.insertTestData(err);
        }
      );

    
  }

  onStop() {
    this.stop.next();
    this.joinedSubscription.unsubscribe();
  }

  onStart() {
    this.startTracking();
  }
}
