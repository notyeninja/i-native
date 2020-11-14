import { Component, OnInit } from "@angular/core";
import { DbService } from "../services/db.service";

@Component({
	selector: "app-error",
	templateUrl: "./error.page.html",
	styleUrls: ["./error.page.scss"]
})
export class ErrorPage implements OnInit {
	error: any;

	constructor(private dbService: DbService) {}

	ngOnInit() {}

	async getError() {
		this.error = await this.dbService.getErrors();
	}
}
