import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { Geofence } from "@ionic-native/geofence/ngx";
import { Sensors } from "@ionic-native/sensors/ngx";
import { DeviceMotion } from "@ionic-native/device-motion/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SQLite } from "@ionic-native/sqlite/ngx";
import { DbService } from "./services/db.service";
import { BackgroundGeoService } from "./services/background-geo.service";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { ForegroundService } from "@ionic-native/foreground-service/ngx";
import { BackService } from "./services/back.service";

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		Geofence,
		Sensors,
		DeviceMotion,
		Geolocation,
		SQLite,
		DbService,
		BackgroundGeolocation,
		BackgroundGeoService,
		BackgroundMode,
		ForegroundService,
		BackService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
