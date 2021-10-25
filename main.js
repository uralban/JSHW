import {FormComponent} from "./components/FormComponent.js";
import {ListComponent} from "./components/ListComponent.js";
import {FilterComponent} from "./components/FilterComponent.js";
import {ServerInteractionComponent} from "./components/ServerInteractionComponent.js";

const newDriverForm = document.newDriverForm;
const filterForm = document.filterForm;
const contentWrapper = document.querySelector('.content');
const editBtn = document.querySelector('.edit-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const submitBtn = document.querySelector('.submit-btn');
const alertWrapper = document.querySelector('.alert-wrapper');
const clearBtn = document.querySelector('.clear-btn');

const ServerInteractionComp = new ServerInteractionComponent;

const ListComp = new ListComponent(
  newDriverForm,
  contentWrapper,
  editBtn,
  cancelBtn,
  submitBtn,
  alertWrapper,
  ServerInteractionComp
);

new FormComponent(
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
);

new FilterComponent(
  filterForm,
  clearBtn,
  ListComp,
  ServerInteractionComp
);

ServerInteractionComp.readDataFromServer().then(resolve => {
  ListComp.renderDriversList(resolve);
}).catch(reject => {
  console.error('get data error', reject);
});



