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

    this.addEvents();
  }

  renderDriversList(listDrivers) {
    this.contentWrapper.innerHTML = '';
    console.log('render list');
    this.drivers = listDrivers;

    const driverTmplArr = this.drivers.map(element => {
      const driverRow = document.createElement('div');
      driverRow.classList.add('row');
      driverRow.innerHTML = `
      <div class="col-4 pt-1 pb-1">${element._id}</div>
      <div class="col-2 pt-1 pb-1">${element.fullName.replace('&', ' ')}</div>
      <div class="col-2 pt-1 pb-1">${element.email}</div>
      <div class="col-2 pt-1 pb-1">${element.city}</div>
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
          await this.ServerInteractionComponent.removeDataFromServer(String(e.target.parentNode.parentNode.firstElementChild.innerText));
        } catch (e) {
          console.error('remove data', e);
        }
        try {
          this.drivers = await this.ServerInteractionComponent.readDataFromServer();
          this.renderDriversList(this.drivers);
        } catch (e) {
          console.error('get data error');
        }
      } else if (e.target.dataset.type === 'edit') {
        this.updateFormData(String(e.target.parentNode.parentNode.firstElementChild.innerText));
      }
    });
  }

  updateFormData (id){
    const currentDriver = this.findDriver(this.drivers, id);
    const driverName = currentDriver.fullName.split('&');
    this.form.firstName.value = driverName[0];
    this.form.lastName.value = driverName[1];
    this.form.email.value = currentDriver.email;
    this.form.city.value = currentDriver.city;

    this.editBtn.dataset.id = id;
    this.editBtn.classList.remove('d-none');
    this.cancelBtn.classList.remove('d-none');
    this.submitBtn.classList.add('d-none');
    this.alertWrapper.classList.add('d-none');
    this.alertWrapper.innerHTML = '';
  }

  findDriver (drivers, id) {
    return drivers.find(driver => driver._id === id);
  }
}
