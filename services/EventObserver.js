export class EventObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter(subscribe => subscribe !== fn);
  }

  broadcast(data) {
    this.observers.forEach(subscriber => subscriber(data));
  }
}
