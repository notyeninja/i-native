import { Component, Injectable, OnInit } from "@angular/core";
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
import { Sensors, TYPE_SENSOR } from "@ionic-native/sensors/ngx";

@Injectable({ providedIn: "root" })
export class BackService {
	private stop = new Subject<void>();
	private timeInterval = 2000;
	private joinedSubscription: Subscription;
	private watch: any;

	// private geoSubject: Subject<Geoposition> = new Subject<Geoposition>();
	// private motionSubject: Subject<DeviceMotionAccelerationData> = new Subject<
	// 	DeviceMotionAccelerationData
	// >();

	// private geo$ = this.geoSubject.asObservable();
	// private motion$ = this.motionSubject.asObservable();

	startRecording = new Subject<boolean>();
	stopRecording = new Subject<boolean>();

	startGeoBack = new Subject<boolean>();
	stopGeoBack = new Subject<boolean>();

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
		private sensors: Sensors
	) {
		this.init();
	}

	init() {
		// this.backgroundMode.configure({
		// 	title: "testing background",
		// 	color: "#FF5733"
		// });

		// this.backgroundMode.on("enable").subscribe(v => {
		// 	this.backgroundMode.overrideBackButton();
		// 	this.backgroundMode.disableBatteryOptimizations();
		// 	//this.backgroundMode.disableWebViewOptimizations();
		// });
		// this.backgroundMode.on("activate").subscribe(v => {
		// 	console.log("background mode activated");
		// 	if (this.joinedSubscription !== null) {
		// 		this.foregroundSvc.start(
		// 			"iNative",
		// 			"running in background for geocode"
		// 		);
		// 		this.joinedSubscription.unsubscribe();
		// 		this.joinedSubscription = null;
		// 		this.altStart();
		// 	}
		// });

		// this.backgroundMode.on("failure").subscribe(err => {
		// 	console.error(err);
		// });

		// this.backgroundMode.on("deactivate").subscribe(v => {
		// 	if (this.joinedSubscription !== null) {
		// 		this.joinedSubscription.unsubscribe();
		// 		this.joinedSubscription = null;
		// 		this.foregroundSvc.stop();
		// 		this.altStart();
		// 	}
		// });

		// this.backgroundMode.enable();
		this.sensors.enableSensor(TYPE_SENSOR.ACCELEROMETER);
		this.sensors.enableSensor(TYPE_SENSOR.LINEAR_ACCELERATION);

		this.startRecording.subscribe(s => {
			if (s) {
				//this.backgroundMode.enable();
				//this.altStart();
				this.watchSensors();
			}
		});

		this.stopRecording.subscribe(s => {
			if (s) {
				this.stop.next();
				this.joinedSubscription.unsubscribe();
				this.joinedSubscription = null;
			}
		});
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
		this.watch = forkJoin([this.geoPositionWatch, this.accelarationWatch])
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

	watchSensors() {
		this.joinedSubscription = interval(this.timeInterval)
			.pipe(
				switchMap(() => from(this.sensors.getState())),
				takeUntil(this.stop)
			)
			.subscribe(
				v => {
					console.log(`Accelaration: ${v}`);
					//console.log(`Accelaration: ${v[0]}`);
					//console.log(`Linear acceleration: ${v[1]}`);
				},
				err => console.log(err)
			);
	}

	backgroundGeo() {}
}
