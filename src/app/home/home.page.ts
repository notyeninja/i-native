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
  

  acc: any;
  position: any;
  posError: any;
  err: any;

  constructor(
    private deviceMotion: DeviceMotion,
    private geoLocation: Geolocation
  ) {}

 
}
