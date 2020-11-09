import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from "@ionic-native/device-motion/ngx";
import {
  Subscription,
  timer,
  Subject,
  forkJoin,
  Observable,
  of,
  from,
} from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { combineAll, repeatWhen, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  private takeAgain = new Subject<void>();
  private stop = new Subject<void>();
  private timeInterval = 5000;
  private joinedSubscription: Subscription;

  acc: any;
  position: any;
  posError: any;
  err: any;

  constructor(
    private deviceMotion: DeviceMotion,
    private geoLocation: Geolocation
  ) {}

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
          this.acc = results[0];
          const geo = results[1] as Geoposition;
          this.position = {
            lat: geo.coords.latitude,
            lng: geo.coords.longitude,
            heading: geo.coords.heading,
            speed: geo.coords.speed,
            timestamp: geo.timestamp,
          };
          this.takeAgain.next();
        },
        (err) => {
          this.err = err;
          console.error(err);
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
