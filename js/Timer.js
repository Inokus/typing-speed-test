export default class Timer {
  constructor(time) {
    this.timePeriod = time;
    this.started = false;
    this.allowStart = true;
    this.timeLeft = this.timePeriod;
    this.interval = undefined;
    this.timerIntervalUpdateEvent = new Event("timerIntervalUpdate");
    this.timerEndEvent = new Event("timerEnd");
  }

  start() {
    this.started = true;
    this.allowStart = false;
    this.interval = setInterval(() => {
      this.timeLeft--;
      document.dispatchEvent(this.timerIntervalUpdateEvent);
      if (this.timeLeft === 0) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    if (this.interval !== undefined) clearInterval(this.interval);
    this.started = false;
    this.interval = undefined;
    document.dispatchEvent(this.timerEndEvent);
  }

  reset() {
    if (this.interval !== undefined) clearInterval(this.interval);
    this.started = false;
    this.allowStart = true;
    this.timeLeft = this.timePeriod;
    this.interval = null;
  }
}
