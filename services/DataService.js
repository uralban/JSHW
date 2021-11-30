import {EventObserver} from "./EventObserver.js";

export class DataService {
  constructor() {
    this.driverlist = new EventObserver();
    this.editDriver = new EventObserver();
  }


}
