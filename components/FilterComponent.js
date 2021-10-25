export class FilterComponent {

  constructor(
    filterForm,
    clearBtn,
    ListComp,
    ServerInteractionComp
  ) {
      this.form = filterForm;
      this.clearBtn = clearBtn;
      this.ServerInteractionComponent = ServerInteractionComp;
      this.ListComponent = ListComp;
      this.filterStr = '';

      this.addEvents();
  }

  addEvents(){
    this.clearBtn.addEventListener('click', async () => {
      try {
        await this.clearHandler();
      } catch (e) {
        console.error('clear handler', e);
      }
    });

    this.form.addEventListener('submit', e => {
      e.preventDefault();
    });

    this.form.addEventListener('keyup', async e => {
      this.clearBtn.classList.remove('d-none');
      try {
        await this.updateFilter();
      } catch (e) {
        console.error('update filter', e);
      }
      if (
        this.form.idFilter.value.length === 0 &&
        this.form.nameFilter.value.length === 0 &&
        this.form.emailFilter.value.length === 0
      ) {
        try {
          await this.clearHandler();
        } catch (e) {
          console.error('clear handler', e);
        }
      }
    });
  }

  async clearHandler() {
      this.form.reset();
      try {
        try {
          this.filterStr = await this.getActualData();
        } catch (e) {
          console.error('get actual data', e)
        }
        this.ListComponent.renderDriversList(this.filterStr);
      } catch (e) {
        console.error('get data', e);
      }
      this.clearBtn.classList.add('d-none');
  }

  async updateFilter() {
    try {
      this.filterStr = await this.getActualData();
    } catch (e) {
      console.error('get actual data', e);
    }
    let filterContent = JSON.parse(this.filterStr);
    if (this.form.idFilter.value.length > 0) {
      filterContent = filterContent.filter(element => {
        if (String(element.driverId).toLowerCase().indexOf(this.form.idFilter.value) !== -1) return true;
      });
    }
    if (this.form.nameFilter.value.length > 2) {
      filterContent = filterContent.filter(element => {
        if (String(element.fullName).toLowerCase().indexOf(this.form.nameFilter.value) !== -1) return true;
      });
    }
    if (this.form.emailFilter.value.length > 2) {
      filterContent = filterContent.filter(element => {
        if (String(element.email).toLowerCase().indexOf(this.form.emailFilter.value) !== -1) return true;
      });
    }
    this.filterStr = JSON.stringify(filterContent);
    this.ListComponent.renderDriversList(this.filterStr);
  }

  async getActualData(){
    try {
      return await this.ServerInteractionComponent.readDataFromServer();
    } catch (e) {
      console.error('get data', e);
    }
  }
}
