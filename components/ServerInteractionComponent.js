import {SERVER_URL} from "../shared/const.js";

import ky from '../shared/ky.js';

export class ServerInteractionComponent {

  constructor() {

  }

  async readDataFromServer(){
    try {
      const resp = await ky.get(SERVER_URL);
      return await resp.json();
    } catch (e) {
      console.error('ky: get data', e);
    }
  }

  async addDataToServer(driver){
    driver.fullName = driver.firstName + ' ' + driver.lastName;
    console.log('add data...', driver.id);

    try {
      await ky.post(SERVER_URL, {
        json: driver
      });
    } catch (e) {
      console.error('ky: add data', e);
    }
  }

  async removeDataFromServer(id){
    console.log('remove data...', id);

    try {
      await ky.delete(SERVER_URL + id);
    } catch (e) {
      console.error('ky: delete data', e);
    }
  }

  async updateDataFromServer(driver){
    driver.fullName = driver.firstName + ' ' + driver.lastName;
    console.log('update data...', driver.id);

    try {
      await ky.patch(SERVER_URL + '/' + driver.id, {
        json: driver
      });
    } catch (e) {
      console.error('ky: update data', e);
    }
  }
}
