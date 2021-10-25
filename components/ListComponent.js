export class ListComponent {

  constructor(
    newDriverForm,
    contentWrapper,
    editBtn,
    cancelBtn,
    submitBtn,
    alertWrapper,
    ServerInteractionComp
  ) {
    this.form = newDriverForm;
    this.alertWrapper = alertWrapper;
    this.contentWrapper = contentWrapper;
    this.editBtn = editBtn;
    this.cancelBtn = cancelBtn;
    this.submitBtn = submitBtn;
    this.ServerInteractionComponent = ServerInteractionComp;
    this.drivers = [];
    this.driversStr = '';

    this.addEvents();
  }

  renderDriversList(listDrivers) {
    this.contentWrapper.innerHTML = '';
    console.log('render list');
    this.drivers = JSON.parse(listDrivers);

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
    this.contentWrapper.addEventListener('click', async e => {
      if (e.target.dataset.type === 'remove') {
        try {
          await this.ServerInteractionComponent.removeDataFromServer(Number(e.target.parentNode.parentNode.firstElementChild.innerText));
        } catch (e) {
          console.error('remove data', e);
        }
        try {
          this.driversStr = await this.ServerInteractionComponent.readDataFromServer();
          this.renderDriversList(this.driversStr);
        } catch (e) {
          console.error('get data error');
        }
      } else if (e.target.dataset.type === 'edit') {
        this.updateFormData(Number(e.target.parentNode.parentNode.firstElementChild.innerText));
      }
    });
  }

  updateFormData (id){
    const currentDriver = this.findDriver(this.drivers, id);

    this.form.firstName.value = currentDriver.firstName;
    this.form.lastName.value = currentDriver.lastName;
    this.form.email.value = currentDriver.email;
    this.form.loginName.value = currentDriver.loginName;
    this.form.status.checked = (currentDriver.status === 'active');

    this.editBtn.dataset.id = id;
    this.editBtn.classList.remove('d-none');
    this.cancelBtn.classList.remove('d-none');
    this.submitBtn.classList.add('d-none');
    this.alertWrapper.classList.add('d-none');
    this.alertWrapper.innerHTML = '';
  }

  findDriver (drivers, id) {
    return drivers.find(driver => driver.driverId === id);
  }
}
