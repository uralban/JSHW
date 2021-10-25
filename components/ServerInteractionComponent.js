import {
  SERVER_URL,
  ACTION_NAME_FOR_GET_GRIVER,
  ACTION_NAME_FOR_ADD_DRIVER,
  ACTION_NAME_FOR_UPDATE_DRIVER,
  ACTION_NAME_FOR_DELETE_DRIVER,
  ORG_ID,
  DATA_FOR_ZATICHKA,
} from "../shared/const.js";

import ky from '../shared/ky.js';

export class ServerInteractionComponent {

  constructor() {
    this.zatichka();
  }

  zatichka(){
    if (!(localStorage.getItem('data'))){
      localStorage.setItem('data', DATA_FOR_ZATICHKA);
    }
  }

  async getCookie() {
    try {
      const resp = await fetch('http://trackensure.ddns.net:15301/TrackEnsure/login.do?actionName=login&email=358&password=test&incognitoMode=N',
        {
          method: 'GET',
          mode: 'no-cors',
          // body: JSON.stringify({
          //   actionName: 'login',
          //   email: '358',
          //   password: 'test',
          //   incognitoMode: 'N'
          // })
        });
      console.log(resp);
      return "i'm cookie";
    } catch (e) {
      console.error('getting cookie', e);
    }
  }

  async readDataFromServer(){
    // const cookie = await this.getCookie();
    // console.log(cookie);
    // try {
    //   const resp = await fetch('http://trackensure.ddns.net:15301/TrackEnsure/fleet/driver?actionName=getActiveDriverProfiles&orgId=303',
    //     {
    //       method: 'GET',
    //       mode: 'no-cors',
    //       credentials: 'include',
    //       headers: {
    //         // 'cookie': "JSESSIONID=17D603AE17E7B503A193B04454089C87; authorized=true; clientId=08f0be0e-d753-4423-a33f-31798513bfbe; __stripe_mid=f9cf6c90-ce21-4526-b75e-a079ec7bcfe457f8a2; _ga=GA1.3.733631053.1634214200; _redmine_session=Z2grdHg0dlYxVElyeXIwTEhzUUJVRGRLS3JCOHM5bWt0T0c0Qi9PNStvTTlYQ2tEMTViV1JqMWluNklrRVZTZTg3bmN2UUdMdVZ6Z2FMQXh2SmpCckRyODAzRTNSdVFCSko4SHhtcGxDNkJIa2Ztc1BLNXJIdFNoNVNVSCs4NjlMd2Y4eWpMVnFTeVpmQVpxYlJvbUpuZVdpaFlQTWxWR1pPN2R1M21zMkJRejJITjRFREV4RUJBWDllWk5RNGJJLS1mL2phdFp4cGdXY2FGYm9CeC9mSS9nPT0%3D--0f845263ca32ea53844ec63768c48859088de8f5; _gid=GA1.3.689632737.1634890020; __stripe_sid=9eb3d830-af25-41c4-8e9e-c58f34dcc30b5eee19",
    //       }
    //     });
    //   console.log(resp);
    // } catch (e) {
    //   console.error('error');

    // }
    try {
      const resp = await ky.get('https://jsonplaceholder.typicode.com/users');
      const json = await resp.json();

      return  localStorage.getItem('data');
    } catch (e) {
      console.error('ky', e);
    }


    // let url = new URL(SERVER_URL);
    // const params = {
    //   actionName: ACTION_NAME_FOR_GET_GRIVER,
    //   orgId: ORG_ID
    // };
    // url.search = new URLSearchParams(params).toString();
    // // console.log(url.href);
    // const data = {
    //   "actionName": "login",
    //   "email": "358",
    //   "password": "test",
    //   "incognitoMode": "N"
    // }
    // await fetch(url.href, {
    // // await fetch('http://trackensure.ddns.net:15301/TrackEnsure/login.do?email=358&password=test&actionName=login&incognitoMode=N',{
    // // await fetch('http://trackensure.ddns.net:15301/TrackEnsure/login.do',{
    //   method: "GET",
    //   // referrer: "http://trackensure.ddns.net:15301/TrackEnsure/login.do",
    //   // origin: "http://trackensure.ddns.net:15301",
    //   // referrerPolicy: "unsafe-url",
    //   // credentials: "include",
    //   // body: JSON.stringify(data),
    //   // headers: {
    //   // 'Host': 'trackensure.ddns.net:15301',
    //   // 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0',
    //   // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    //   //   'Accept-Language': 'en-US,en;q=0.5',
    //   //   'Accept-Encoding': 'gzip, deflate',
    //   //   'Content-Type': 'application/x-www-form-urlencoded',
    //   //   'Content-Length': '56',
    //   //   'Origin': 'http://trackensure.ddns.net:15301',
    //   //   'Connection': 'keep-alive',
    //   //   'Referer': 'http://trackensure.ddns.net:15301/TrackEnsure/login.do',
    //   //   'Cookie': 'JSESSIONID=20E2E7EC26E61BB6395F2B8976058F66; authorized=true; clientId=08f0be0e-d753-4423-a33f-31798513bfbe; __stripe_mid=f9cf6c90-ce21-4526-b75e-a079ec7bcfe457f8a2; _ga=GA1.3.733631053.1634214200; _gid=GA1.3.739689387.1634214200',
    //   //   'Upgrade-Insecure-Requests': '1'
    //   // }
    // });
    // // let response = await fetch(url.href, {
    // //   method: 'GET'
    // // });
    // // console.log(await response);
  }

  async addDataToServer(driver){
    driver.fullName = driver.firstName + ' ' + driver.lastName;
    console.log('add data...', driver.driverId);

    try {
      const drivers = await this.readDataFromServer();
      const newDriverList = JSON.parse(drivers);
      newDriverList.push(driver);
      localStorage.setItem('data', JSON.stringify(newDriverList));
    } catch (e) {
      console.error('read data', e);
    }
  }

  async removeDataFromServer(id){
    console.log('remove data...', id);

    try {
      const drivers = await this.readDataFromServer();
      const oldDriverList = JSON.parse(drivers);
      const newDriverList = oldDriverList.filter(elem => {
        if (elem.driverId !== Number(id)) return true;
      });
      localStorage.setItem('data', JSON.stringify(newDriverList));
    } catch (e) {
      console.error('read data', e);
    }
  }

  async updateDataFromServer(driver){
    driver.fullName = driver.firstName + ' ' + driver.lastName;
    console.log('update data...', driver.driverId);

    try {
      const drivers = await this.readDataFromServer();
      const oldDriverList = JSON.parse(drivers);
      const newDriverList = oldDriverList.map(elem => {
        if (elem.driverId === Number(driver.driverId)) {
          elem.fullName = driver.fullName;
          elem.firstName = driver.firstName;
          elem.lastName = driver.lastName;
          elem.email = driver.email;
          elem.loginName = driver.loginName;
          elem.status = driver.status;
          return elem;
        } else {
          return elem;
        }
      });
      localStorage.setItem('data', JSON.stringify(newDriverList));
    } catch (e) {
      console.error('read data', e);
    }
  }
}
