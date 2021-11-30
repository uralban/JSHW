import {FormComponent} from "./components/FormComponent.js";
import {ListComponent} from "./components/ListComponent.js";
import {FilterComponent} from "./components/FilterComponent.js";
import {ServerInteractionComponent} from "./components/ServerInteractionComponent.js";
import {DataService} from "./services/DataService.js";

const filterForm = document.filterForm;
const clearBtn = document.querySelector('.clear-btn');

export const dataService = new DataService();

export const serverInteractionComponent = new ServerInteractionComponent;
const ServerInteractionComp = new ServerInteractionComponent;

const ListComp = new ListComponent();

dataService.driverlist.broadcast(serverInteractionComponent.readDataFromServer());

new FormComponent(
  filterForm,
  clearBtn
);

new FilterComponent(
  filterForm,
  clearBtn,
  ListComp,
  ServerInteractionComp
);



