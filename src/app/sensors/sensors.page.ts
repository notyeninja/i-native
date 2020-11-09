import { Component, OnInit } from "@angular/core";
import { DbService } from "../services/db.service";
import {
  Subscription,
  timer,
  Subject,
  from,
  of,
  zip,
  forkJoin,
  interval,
} from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from "@ionic-native/device-motion/ngx";
import {
  repeatWhen,
  switchMap,
  takeUntil,
  combineAll,
  take,
} from "rxjs/operators";

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

  private geoSubject: Subject<Geoposition> = new Subject<Geoposition>();
  private motionSubject: Subject<DeviceMotionAccelerationData> = new Subject<
    DeviceMotionAccelerationData
  >();

  private geo$ = this.geoSubject.asObservable();
  private motion$ = this.motionSubject.asObservable();

  position: any;
  err: any;
  data: any = [];

  constructor(
    private dbService: DbService,
    private deviceMotion: DeviceMotion,
    private geoLocation: Geolocation
  ) {}

  ngOnInit() {
  }

  altStart() {
    this.joinedSubscription = interval(this.timeInterval)
      .pipe(
        switchMap(() =>
          zip(
            this.deviceMotion.getCurrentAcceleration(),
            this.geoLocation.getCurrentPosition()
          )
        ),
        takeUntil(this.stop)
      )
      .subscribe(([acc, geo]) => {
        const geo1 = geo as Geoposition;
        let dataToSave = {
          displacement: acc,
          position: {
            lat: geo1.coords.latitude,
            lng: geo1.coords.longitude,
            heading: geo1.coords.heading,
            speed: geo1.coords.speed,
            timestamp: geo1.timestamp,
          },
        };

        this.dbService.insertTestData(dataToSave);
      });
  }

  onStop() {
    this.stop.next();
    this.joinedSubscription.unsubscribe();
  }

  onStart() {
    this.altStart();
  }
}
