export class FormComponent {

    constructor(
      newDriverForm,
      contentWrapper,
      editBtn,
      cancelBtn,
      submitBtn,
      alertWrapper,
      filterForm,
      clearBtn,
      ListComp,
      ServerInteractionComp
    ) {
      this.form = newDriverForm;
      this.filterForm = filterForm;
      this.alertWrapper = alertWrapper;
      this.editBtn = editBtn;
      this.cancelBtn = cancelBtn;
      this.submitBtn = submitBtn;
      this.clearBtn = clearBtn;
      this.ServerInteractionComponent = ServerInteractionComp;
      this.ListComponent = ListComp;
      this.driversArr = [];

      this.addEvents();
    }

    addEvents(){
      this.form.addEventListener('submit', async e => {
        e.preventDefault();
        try {
          await this.checkAndSave();
        } catch (e) {
          console.error('check and save', e);
        }
      });
      this.cancelBtn.addEventListener('click', () => {
        this.form.reset();
        this.editBtn.classList.add('d-none');
        this.cancelBtn.classList.add('d-none');
        this.submitBtn.classList.remove('d-none');
        this.alertWrapper.classList.add('d-none');
        this.alertWrapper.innerHTML = '';
      });
      this.editBtn.addEventListener('click', async () => {
        try {
          await this.checkAndSave(true);
        } catch (e) {
          console.error('check and save', e);
        }
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
      if (!this.form.email.value.length) errors.push('Email too short');
      if (!this.form.loginName.value.length) errors.push('Login too short');
      if (!this.validateEmail(this.form.email.value)) errors.push('Email is incorrect');
      if (!this.validateEmail(this.form.loginName.value)) errors.push('Login is incorrect');

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

    async checkAndSave(edit = false) {
      if (!this.validateForm()) return;

      try {
        this.drivers = await this.ServerInteractionComponent.readDataFromServer();
      } catch (e) {
        console.error('read data', e);
      }
      this.driver = {};

      this.driver.firstName = this.form.firstName.value;
      this.driver.lastName = this.form.lastName.value;
      this.driver.email = this.form.email.value;
      this.driver.loginName = this.form.loginName.value;
      this.driver.status = this.form.status.checked ? 'active' : 'passive';

      this.driver.id = !edit ?
        this.drivers.length > 0 ?
          this.drivers[this.drivers.length - 1].id + 1 :
          0 :
        this.editBtn.dataset.id;

      try {
        edit ?
          await this.ServerInteractionComponent.updateDataFromServer(this.driver) :
          await this.ServerInteractionComponent.addDataToServer(this.driver);
      } catch (e) {
        console.error('write to server', e);
      }

      this.form.reset();
      this.editBtn.classList.add('d-none');
      this.cancelBtn.classList.add('d-none');
      this.submitBtn.classList.remove('d-none');
      this.filterForm.reset();
      this.clearBtn.classList.add('d-none');

      try {
        this.driversArr = await this.ServerInteractionComponent.readDataFromServer();
        this.ListComponent.renderDriversList(this.driversArr);
      } catch (e) {
        console.error('get data error');
      }
    }
}

