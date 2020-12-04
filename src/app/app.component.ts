import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DbService } from "./services/db.service";
import { BackgroundGeoService } from "./services/background-geo.service";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { BackService } from "./services/back.service";
import {
	BackgroundGeolocation,
	BackgroundGeolocationConfig,
	BackgroundGeolocationEvents,
	BackgroundGeolocationResponse
} from "@ionic-native/background-geolocation/ngx";
import { ReadymadeGeoLocationService } from "./services/ready-made-geo-location.service";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"]
})
export class AppComponent {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private dbService: DbService,
		private backgroundGeoService: BackgroundGeoService,
		private backgroundMode: BackgroundMode,
		private bckService: BackService,
		private backGroundGeo: BackgroundGeolocation,
		private readymadeSvc: ReadymadeGeoLocationService
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.dbService.initializeDatabase();
			//this.backgroundGeoService.configureBackgroundGeo();
			//this.configureBackgroundGeo();
			this.readymadeSvc.init();
		});
	}

	configureBackgroundMode() {
		// this.backgroundMode.configure({
		// 	title: "testing background",
		// 	color: "#FF5733"
		// });
		// this.backgroundMode.on("activate").subscribe(v => {
		// 	this.backgroundMode.disableWebViewOptimizations();
		// 	this.backgroundMode.overrideBackButton();
		// 	this.backgroundMode.disableBatteryOptimizations();
		// });
		// this.backgroundMode.enable();
	}

	configureBackgroundGeo() {
		const config: BackgroundGeolocationConfig = {
			desiredAccuracy: 10,
			stationaryRadius: 20,
			distanceFilter: 30,
			debug: true, //  enable this hear sounds for background-geolocation life-cycle.
			stopOnTerminate: true // enable this to clear background location settings when the app terminates
		};

		this.backGroundGeo.configure(config).then(() => {
			this.backGroundGeo
				.on(BackgroundGeolocationEvents.location)
				.subscribe((location: BackgroundGeolocationResponse) => {
					console.log(location);

					// IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
					// and the background-task may be completed.  You must do this regardless if your operations are successful or not.
					// IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
					this.backGroundGeo.finish(); // FOR IOS ONLY
				});
		});

		this.bckService.startGeoBack.subscribe(() => {
			this.backGroundGeo.start();
		});

		this.bckService.stopGeoBack.subscribe(() => {
			this.backGroundGeo.stop();
		});
	}
}
