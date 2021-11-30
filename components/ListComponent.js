import {dataService, serverInteractionComponent} from "../main.js";

export class ListComponent {

  constructor() {
    this.contentWrapper = document.querySelector('.content');
    this.drivers = [];

    dataService.driverlist.subscribe(drivers => {
      this.drivers = JSON.parse(drivers);
      this.renderDriversList();
    });

    this.addEvents();
  }

  renderDriversList() {
    this.contentWrapper.innerHTML = '';
    console.log('render list');
    const driverTmplArr = this.drivers.map(element => {
      const driverRow = document.createElement('div');
      driverRow.classList.add('row');
      driverRow.innerHTML = `
      <div class="col-1 pt-1 pb-1">${element.driverId}</div>
      <div class="col-3 pt-1 pb-1">${element.fullName}</div>
      <div class="col-3 pt-1 pb-1">${element.email}</div>
      <div class="col-3 pt-1 pb-1">${element.loginName}</div>
      <div class="col-2 pt-1 pb-1">
          <button class="btn btn-info" data-type="edit">E</button>
          <button class="btn btn-danger" data-type="remove">-</button>
      </div>
      `;
      return driverRow;
    });
    this.contentWrapper.append(...driverTmplArr);
  }

  addEvents(){
    this.contentWrapper.addEventListener('click', e => {
      if (e.target.dataset.type === 'remove') {
        this.drivers = this.drivers.filter(driver => driver.driverId !== Number(e.target.parentNode.parentNode.firstElementChild.innerText));
        const newData = JSON.stringify(this.drivers);
        serverInteractionComponent.updateDataFromServer(newData);
        dataService.driverlist.broadcast(newData);
      } else if (e.target.dataset.type === 'edit') {
        const currentDriver = this.drivers.find(driver => driver.driverId === Number(e.target.parentNode.parentNode.firstElementChild.innerText));
        dataService.editDriver.broadcast(currentDriver);
      }
    });
  }

  findDriver (drivers, id) {
    return drivers.find(driver => driver._id === id);
  }
}
