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
	Observable
} from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import {
	DeviceMotion,
	DeviceMotionAccelerationData
} from "@ionic-native/device-motion/ngx";
import {
	repeatWhen,
	switchMap,
	takeUntil,
	combineAll,
	take,
	debounce
} from "rxjs/operators";
import { ForegroundService } from "@ionic-native/foreground-service/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { BackService } from "../services/back.service";
import { ReadymadeGeoLocationService } from "../services/ready-made-geo-location.service";

@Component({
	selector: "app-sensors",
	templateUrl: "./sensors.page.html",
	styleUrls: ["./sensors.page.scss"]
})
export class SensorsPage implements OnInit {
	private takeAgain = new Subject<void>();
	private stop = new Subject<void>();
	private timeInterval = 2000;
	private joinedSubscription: Subscription;

	private geoSubject: Subject<Geoposition> = new Subject<Geoposition>();
	private motionSubject: Subject<DeviceMotionAccelerationData> = new Subject<
		DeviceMotionAccelerationData
	>();

	private geo$ = this.geoSubject.asObservable();
	private motion$ = this.motionSubject.asObservable();

	private geoPositionWatch;
	private accelarationWatch;

	position: any;
	err: any;
	data: any = [];

	constructor(
		private dbService: DbService,
		private deviceMotion: DeviceMotion,
		private geoLocation: Geolocation,
		private foregroundSvc: ForegroundService,
		private backgroundMode: BackgroundMode,
		private bckService: BackService,
		private readymadeSvc: ReadymadeGeoLocationService
	) {}

	ngOnInit() {
		// this.geoPositionWatch = this.geoLocation.watchPosition();
		// this.accelarationWatch = this.deviceMotion.watchAcceleration();
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
			.subscribe(
				([acc, geo]) => {
					const geo1 = geo as Geoposition;
					let dataToSave = {
						displacement: acc,
						position: {
							lat: geo1.coords.latitude,
							lng: geo1.coords.longitude,
							heading: geo1.coords.heading,
							speed: geo1.coords.speed,
							timestamp: geo1.timestamp
						}
					};

					this.dbService.insertTestData(dataToSave);
				},
				error => {
					this.dbService.insertError(error);
				}
			);
	}

	watchModeStart() {
		forkJoin([this.geoPositionWatch, this.accelarationWatch])
			.pipe(takeUntil(this.stop))
			.subscribe(
				results => {
					const geo1 = results[0] as Geoposition;
					let dataToSave = {
						displacement: results[1],
						position: {
							lat: geo1.coords.latitude,
							lng: geo1.coords.longitude,
							heading: geo1.coords.heading,
							speed: geo1.coords.speed,
							timestamp: geo1.timestamp
						}
					};
				},
				error => {
					this.dbService.insertError(error);
				}
			);
	}

	onStop() {
		// this.foregroundSvc.stop();
		// this.stop.next();
		//this.joinedSubscription.unsubscribe();
		//this.bckService.stopGeoBack.next(true);
		this.readymadeSvc.stopTracing();
	}

	onStart() {
		//this.altStart();
		//this.bckService.startGeoBack.next(true);
		this.readymadeSvc.startTracing();
	}
}
