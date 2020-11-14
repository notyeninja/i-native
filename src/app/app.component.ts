import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DbService } from "./services/db.service";
import { BackgroundGeoService } from "./services/background-geo.service";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";

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
		private backgroundMode: BackgroundMode
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.dbService.initializeDatabase();
			//this.backgroundGeoService.configureBackgroundGeo();
			this.configureBackgroundMode();
		});
	}

	configureBackgroundMode() {
		this.backgroundMode.configure({
			silent: true
		});
		this.backgroundMode.on("activate").subscribe(v => {
			this.backgroundMode.disableBatteryOptimizations();
		});
		this.backgroundMode.enable();
	}
}
