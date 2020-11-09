import { Component, OnInit } from "@angular/core";
import { DbService } from "../services/db.service";
import { Subscription, timer, Subject } from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from "@ionic-native/device-motion/ngx";
import { repeatWhen, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-sensors",
  templateUrl: "./sensors.page.html",
  styleUrls: ["./sensors.page.scss"],
})
export class SensorsPage implements OnInit {
  private accelerometerSubscription: Subscription;
  private takeAgain = new Subject<void>();
  private stop = new Subject<void>();
  private timeInterval = 5000;

  position:any;

  constructor(
    private dbService: DbService,
    private deviceMotion: DeviceMotion,
    private geoLocation: Geolocation
  ) {}

  ngOnInit() {}

  startTracking() {
    this.accelerometerSubscription = this.deviceMotion
      .watchAcceleration({ frequency: this.timeInterval })
      .subscribe((a: DeviceMotionAccelerationData) => {});

    timer(this.timeInterval)
      .pipe(
        switchMap(() => this.geoLocation.getCurrentPosition()),
        takeUntil(this.stop),
        repeatWhen(() => this.takeAgain)
      )
      .subscribe((p: Geoposition) => {
        (this.position = {
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          heading: p.coords.heading,
          speed: p.coords.speed,
          timestamp: p.timestamp,
        }),
          this.takeAgain.next();
      });
  }

  stopTracking() {}
}
