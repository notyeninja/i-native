import { Injectable } from "@angular/core";
import {
	BackgroundGeolocation,
	BackgroundGeolocationAccuracy,
	BackgroundGeolocationConfig,
	BackgroundGeolocationEvents,
	BackgroundGeolocationResponse
} from "@ionic-native/background-geolocation/ngx";

@Injectable({
	providedIn: "root"
})
export class BackgroundGeoService {
	config: BackgroundGeolocationConfig = {
		desiredAccuracy: 10,
		stationaryRadius: 30,
		distanceFilter: 200,
		debug: true, //  enable this hear sounds for background-geolocation life-cycle.
		stopOnTerminate: true // enable this to clear background location settings when the app terminates
	};

	constructor(private backgroundGeolocation: BackgroundGeolocation) {}

	configureBackgroundGeo() {
		this.backgroundGeolocation.configure(this.config).then(() => {
			this.backgroundGeolocation
				.on(BackgroundGeolocationEvents.location)
				.subscribe((location: BackgroundGeolocationResponse) => {
					console.log(location);

					// IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
					// and the background-task may be completed.  You must do this regardless if your operations are successful or not.
					// IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
					this.backgroundGeolocation.finish(); // FOR IOS ONLY
				});
		});
	}

	startCapturing() {
		// start recording location
		this.backgroundGeolocation.start();
	}

	stopCapturing() {
		// If you wish to turn OFF background-tracking, call the #stop method.
		this.backgroundGeolocation.stop();
	}
}
