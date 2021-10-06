document.addEventListener('DOMContentLoaded', () => {
    const newDriverForm = document.querySelector('.new-driver-form');
    const tBody = document.querySelector('.tbody');
    const alertWrapper = document.querySelector('.alert-wrapper');
    const editBtn = document.querySelector('.edit-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const submitBtn = document.querySelector('.submit-btn');

    function getDriversFromStorage (){
        return JSON.parse(localStorage.getItem('drivers')) || [];
    }

    function render(){
        let drivers = getDriversFromStorage();

        if (drivers.length) {
            let tBodyContent = '';
            for (driver of drivers) {
                tBodyContent += `
                    <tr>
                        <td>${driver.id}</td>
                        <td>${driver.fName} ${driver.lName}</td>
                        <td>${driver.email}</td>
                        <td>${driver.city}</td>
                        <td>
                            <button class="btn btn-info"  data-id="${driver.id}">E</button>
                            <button class="btn btn-danger" data-id="${driver.id}"><i class="bi bi-dash" data-id="${driver.id}"></i></button>
                        </td>
                    </tr>
                `;            
            }
            tBody.innerHTML = tBodyContent;
        } else {
            tBody.innerHTML = '';
        }  
    }

    function saveData(driver){
        let drivers = getDriversFromStorage();            

        driver.id = (drivers.length > 0) ? drivers[drivers.length-1].id + 1 : 0;        
        drivers.push(driver);
        localStorage.setItem('drivers', JSON.stringify(drivers));
    }      

    function editData(driver){
        let drivers = getDriversFromStorage();
        let index = findDriver(drivers, Number(editBtn.dataset.id), 'index');

        driver.id = drivers[index].id;
        drivers.splice(index, 1, driver);
        localStorage.setItem('drivers', JSON.stringify(drivers));
    }

    function findDriver (drivers, id, type='data') {
        if (type === 'data'){
            return drivers.find((driver) => {
                if(driver.id === id){
                    return driver;
                }
            });
        } else if (type === 'index') {
            return drivers.findIndex((driver) => {
                if(driver.id === id){
                    return driver;
                }
            });
        }
    }

    function removeData(id) {
        let drivers = getDriversFromStorage();
        let deleteItem = findDriver(drivers, id, 'index');

        if (deleteItem !== -1){
            drivers.splice(deleteItem,1);
            localStorage.setItem('drivers', JSON.stringify(drivers));
        }
    }

    function updateFormData(id){
        let drivers = getDriversFromStorage();
        let currentDriver = findDriver(drivers, id);
        
        document.newDriverForm.firstName.value = currentDriver.fName;
        document.newDriverForm.lastName.value = currentDriver.lName;
        document.newDriverForm.email.value = currentDriver.email;
        document.newDriverForm.city.value = currentDriver.city;
    }

    function validForm(form) {
        let errors = [];

        (form.firstName.value.length > 0) ? '' : errors.push('First name too short');
        (form.lastName.value.length > 0) ? '' : errors.push('Last name too short');
        (form.email.value.length > 0) ? '' : errors.push('Email too short');
        (form.city.value.length > 0) ? '' : errors.push('City name too short');

        return errors;
    }

    function checkAndSave(form, edit=false){
        let errors = validForm(form);

        if (errors.length) {
            let errorContent = '';
            alertWrapper.style.display = 'block';
            for (error of errors) {
                errorContent += `
                    <p>${error}</p>
                `;
            }
            alertWrapper.innerHTML = errorContent;

        } else {
            let driver = {};

            alertWrapper.style.display = 'none';
            alertWrapper.innerHTML = '';

            driver.fName = form.firstName.value;
            driver.lName = form.lastName.value;
            driver.email = form.email.value;
            driver.city = form.city.value;

            (edit) ? editData(driver) : saveData(driver);

            document.newDriverForm.reset();
            editBtn.classList.add('d-none');
            cancelBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');

            render();
        }
    }

    newDriverForm.addEventListener('submit', (e) => {
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
        editBtn.classList.toggle('d-none');
        cancelBtn.classList.toggle('d-none');
        submitBtn.classList.toggle('d-none');
    });

    tBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-danger') || e.target.classList.contains('bi-dash')){
            removeData(Number(e.target.dataset.id));
            render();
        } else if (e.target.classList.contains('btn-info')){
            updateFormData(Number(e.target.dataset.id));
            editBtn.dataset.id = e.target.dataset.id;
            editBtn.classList.remove('d-none');
            cancelBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');
        }

    });

    render();
});