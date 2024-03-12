export default class DataManager {
  constructor() {
    this.words = undefined;
    this.userMetrics = [];
    this.typedWords = 0;
    this.correctlyTypedWords = 0;
    this.accuracy = 0;
  }

  async getWords() {
    try {
      const response = await fetch("../dictionary.json");
      if (!response.ok) {
        throw new Error("Failed to fetch words");
      }
      this.words = await response.json();
      this.shuffleWords();
    } catch (error) {
      console.error(error);
    }
  }

  shuffleWords() {
    for (let i = this.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
    }
  }

  updateAccuracy() {
    this.accuracy = Math.trunc(
      (this.correctlyTypedWords / this.typedWords) * 100
    );
  }

  addUserMetricsEntry() {
    const date = new Date();
    const entry = {
      dateAndTime: date.toLocaleString(),
      wpm: this.correctlyTypedWords,
      accuracy: this.accuracy,
    };
    this.userMetrics.push(entry);
  }

  getLocalStorage() {
    const userMetrics = localStorage.getItem("userMetrics");
    if (userMetrics) this.userMetrics = JSON.parse(userMetrics);
  }

  getBestEntry() {
    const sorted = this.userMetrics.toSorted((a, b) => {
      // If wpm is different, sort by wpm
      if (a.wpm !== b.wpm) {
        return b.wpm - a.wpm;
      } else {
        // If wpm is the same, sort by accuracy
        return b.accuracy - a.accuracy;
      }
    });
    return sorted[0];
  }

  getLastEntries(num) {
    if (this.userMetrics.length < num || num === undefined)
      return this.userMetrics;
    else return this.userMetrics.slice(this.userMetrics.length - 10);
  }

  updateLocalStorage() {
    this.addUserMetricsEntry();
    localStorage.setItem("userMetrics", JSON.stringify(this.userMetrics));
  }

  reset() {
    this.typedWords = 0;
    this.correctlyTypedWords = 0;
    this.accuracy = 0;
  }
}
