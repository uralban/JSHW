export class ServerInteractionComponent {

  constructor() {

  }

  readDataFromServer(){
    // try {
    //   const resp = await fetch(SERVER_URL, {
    //     method: "GET"
    //   });
    //   return await resp.json();
    // } catch (e) {
    //   console.error('fetch: get data', e);
    // }
    return localStorage.getItem('data')
    // try {
    //   return await JSON.parse(localStorage.getItem('data'));
    // } catch (e) {
    //   console.error('fetch: get data', e);
    // }

  }

  async addDataToServer(driver){
    console.log('add data...');

    // try {
    //   await fetch(SERVER_URL, {
    //     method: "POST",
    //     body: JSON.stringify(driver),
    //     headers: { "Content-Type": "application/json" }
    //   });
    // } catch (e) {
    //   console.error('fetch: add data', e);
    // }
  }
  removeDataFromServer(id){
    console.log('remove data...', id);

    // try {
    //   await fetch(SERVER_URL + '/' + id, {
    //     method: "DELETE"
    //   });
    // } catch (e) {
    //   console.error('fetch: delete data', e);
    // }
  }

  updateDataFromServer(data){
    console.log('update data...');

    localStorage.setItem('data', data);
    // const id = driver._id;
    // delete driver._id;

    // try {
    //   await fetch(SERVER_URL + '/' + id, {
    //     method: "PUT",
    //     body: JSON.stringify(driver),
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   })
    // } catch (e) {
    //   console.error('fetch: update data', e);
    // }
  }
}
