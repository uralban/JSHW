import {dataService, serverInteractionComponent} from "../main.js";

export class FormComponent {

    constructor(
      filterForm,
      clearBtn
    ) {
      this.form = document.newDriverForm;
      this.filterForm = filterForm;
      this.alertWrapper = document.querySelector('.alert-wrapper');
      this.editBtn = document.querySelector('.edit-btn');
      this.cancelBtn = document.querySelector('.cancel-btn');
      this.submitBtn = document.querySelector('.submit-btn');
      this.clearBtn = clearBtn;
      this.driversArr = [];

      dataService.editDriver.subscribe(driver => {
        this.form.firstName.value = driver.firstName;
        this.form.lastName.value = driver.lastName;
        this.form.email.value = driver.email;
        this.form.loginName.value = driver.loginName;
        this.form.status.checked = (driver.status === 'active');
        this.editBtn.dataset.id = driver.driverId;

        this.editBtn.classList.remove('d-none');
        this.cancelBtn.classList.remove('d-none');
        this.submitBtn.classList.add('d-none');
      });

      this.addEvents();
    }

    addEvents(){
      this.form.addEventListener('submit', async e => {
        e.preventDefault();
        this.checkAndSave();
      });
      this.cancelBtn.addEventListener('click', () => {
        this.form.reset();
        this.editBtn.classList.add('d-none');
        this.cancelBtn.classList.add('d-none');
        this.submitBtn.classList.remove('d-none');
        this.alertWrapper.classList.add('d-none');
        this.alertWrapper.innerHTML = '';
      });
      this.editBtn.addEventListener('click', () => {
        this.checkAndSave(true);
        // try {
        //   await this.checkAndSave(true);
        // } catch (e) {
        //   console.error('check and save', e);
        // }
      });
    }

    validateEmail(email) {
      const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      return re.test(String(email).toLowerCase());
    }

    validateForm() {
      let errors = [];

      if (!this.form.firstName.value.length) errors.push('First name too short');
      if (!this.form.lastName.value.length) errors.push('Last name too short');
      if (!this.validateEmail(this.form.email.value)) errors.push('Email is incorrect');
      if (!this.validateEmail(this.form.loginName.value)) errors.push('Login Name is incorrect');

      if (errors.length) {
        let errorContent = '';
        this.alertWrapper.classList.remove('d-none');
        for (const error of errors) {
          errorContent += `
                        <p>${error}</p>
                    `;
        }
        this.alertWrapper.innerHTML = errorContent;
        return false;
      } else {
        this.alertWrapper.classList.add('d-none');
        this.alertWrapper.innerHTML = '';
        return true;
      }
    }

    checkAndSave(edit = false) {
      if (!this.validateForm()) return;

      const drivers = JSON.parse(serverInteractionComponent.readDataFromServer());

      const driver = {};
      driver.firstName = this.form.firstName.value;
      driver.lastName = this.form.lastName.value;
      driver.fullName = this.form.firstName.value + ' ' + this.form.lastName.value;
      driver.email = this.form.email.value;
      driver.loginName = this.form.loginName.value;
      driver.status = (this.form.status.checked) ? 'active' : 'passive';

      driver.driverId = drivers[drivers.length - 1].driverId + 1;
      if (edit) driver.driverId = Number(this.editBtn.dataset.id);

      (edit) ? drivers.map(element => {
        if (element.driverId === driver.driverId) {
          element.firstName = driver.firstName;
          element.lastName = driver.lastName;
          element.fullName = driver.fullName;
          element.email = driver.email;
          element.loginName = driver.loginName;
          element.status = driver.status;
        }
        return element;
      }) : drivers.push(driver);

      const newData = JSON.stringify(drivers);
      serverInteractionComponent.updateDataFromServer(newData);
      dataService.driverlist.broadcast(newData);

      this.form.reset();
      this.editBtn.classList.add('d-none');
      this.cancelBtn.classList.add('d-none');
      this.submitBtn.classList.remove('d-none');
    }
}

