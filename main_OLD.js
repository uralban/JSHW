document.addEventListener('DOMContentLoaded', () => {
    const alertWrapper = document.querySelector('.alert-wrapper');
    const editBtn = document.querySelector('.edit-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const contentDiv = document.querySelector('.content');
    const LOCALSTORAGE_KEY_DRIVERS_LIST = 'drivers';

    function getDriversFromStorage (){
        return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_DRIVERS_LIST)) || [];
    }

    function addDriversToStorage(drivers){
        localStorage.setItem(LOCALSTORAGE_KEY_DRIVERS_LIST, JSON.stringify(drivers));
    }

    function renderTable(){
        const drivers = getDriversFromStorage();

        if (drivers.length) {
            let tBodyContent = '';
            for (const driver of drivers) {
              tBodyContent += `
                      <div class="row">
                        <div class="col-1 pt-1 pb-1">${driver.id}</div>
                        <div class="col-4 pt-1 pb-1">${driver.firstName} ${driver.lastName}</div>
                        <div class="col-3 pt-1 pb-1">${driver.email}</div>
                        <div class="col-2 pt-1 pb-1">${driver.city}</div>
                        <div class="col-2 pt-1 pb-1">
                            <button class="btn btn-info" data-type="edit">E</button>
                            <button class="btn btn-danger" data-type="remove">-</button>
                        </div>
                      </div>
              `;
            }
          contentDiv.innerHTML = tBodyContent;
        } else {
          contentDiv.innerHTML = '';
        }
    }

    function addData(driver){
        const drivers = getDriversFromStorage();

        driver.id = (drivers.length > 0) ? drivers[drivers.length-1].id + 1 : 0;
        drivers.push(driver);

        addDriversToStorage(drivers);
    }

    function editData(driver){
        const drivers = getDriversFromStorage();
        const index = findDriverIndex(drivers, Number(editBtn.dataset.id));

        driver.id = drivers[index].id;
        drivers.splice(index, 1, driver);

        addDriversToStorage(drivers);
    }

    function findDriverIndex (drivers, id) {
        return drivers.findIndex(driver => driver.id === id);
    }

    function findDriver (drivers, id) {
        return drivers.find(driver => driver.id === id);
    }

    function removeData(id) {
        const drivers = getDriversFromStorage();
        const deleteItemIndex = findDriverIndex(drivers, id);

        if (deleteItemIndex !== -1){
            drivers.splice(deleteItemIndex,1);
            addDriversToStorage(drivers);
        } else {
            console.error('ERROR, this driver id there is not in storage');
        }
    }

    function updateFormData (id){
        const drivers = getDriversFromStorage();
        const currentDriver = findDriver(drivers, id);

        document.newDriverForm.firstName.value = currentDriver.firstName;
        document.newDriverForm.lastName.value = currentDriver.lastName;
        document.newDriverForm.email.value = currentDriver.email;
        document.newDriverForm.city.value = currentDriver.city;
    }

    function validateForm(form) {
        const errors = [];

        if (!form.firstName.value.length) errors.push('First name too short');
        if (!form.lastName.value.length) errors.push('Last name too short');
        if (!form.email.value.length) errors.push('Email too short');
        if (!form.city.value.length) errors.push('City name too short');

        if (errors.length) {
          let errorContent = '';
          alertWrapper.classList.remove('d-none');
          for (const error of errors) {
            errorContent += `
                      <p>${error}</p>
                  `;
          }
          alertWrapper.innerHTML = errorContent;
          return false;
        } else {
          alertWrapper.classList.add('d-none');
          alertWrapper.innerHTML = '';
          return true;
        }
    }

    function checkAndSave(form, edit=false){

        if (!validateForm(form)) return;

        const driver = {};

        driver.firstName = form.firstName.value;
        driver.lastName = form.lastName.value;
        driver.email = form.email.value;
        driver.city = form.city.value;

        (edit) ? editData(driver) : addData(driver);

        document.newDriverForm.reset();
        editBtn.classList.add('d-none');
        cancelBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');

        renderTable();
    }

    document.newDriverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkAndSave(e.target);
    });

    editBtn.addEventListener('click', () => {
        checkAndSave(document.newDriverForm, true);
    });

    cancelBtn.addEventListener('click', () => {
        document.newDriverForm.reset();
        alertWrapper.style.display = 'none';
        alertWrapper.innerHTML = '';
        editBtn.classList.add('d-none');
        cancelBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');
    });

  contentDiv.addEventListener('click', (e) => {
        if (e.target.dataset.type === 'remove'){
            removeData(Number(e.target.parentNode.parentNode.firstElementChild.innerText));
            renderTable();
        } else if (e.target.dataset.type === 'edit'){
            updateFormData(Number(e.target.parentNode.parentNode.firstElementChild.innerText));
            editBtn.dataset.id = e.target.parentNode.parentNode.firstElementChild.innerText;
            editBtn.classList.remove('d-none');
            cancelBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');
        }

    },true);

    renderTable();
});
