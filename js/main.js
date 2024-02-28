class UserInterface {
  constructor(dataManager, timer) {
    this.divWordsPerMinute = document.querySelector(".wpm");
    this.divAccuracy = document.querySelector(".accuracy");
    this.divTimer = document.querySelector(".timer");
    this.btnRestart = document.querySelector(
      ".timer-wrapper button:first-of-type"
    );
    this.btnReset = document.querySelector(
      ".timer-wrapper button:last-of-type"
    );
    this.inputUserText = document.querySelector(".user-text");
    this.divWordsWrapper = document.querySelector(".words-wrapper");
    this.divTypedWords = document.querySelector(".typed-words");
    this.divPromptWords = document.querySelector(".prompt-words");
    this.divMessage = document.querySelector(".message");
    this.canvasChart = document.querySelector(".chart").getContext("2d");
    this.btnWordsPerMinuteMode = document.querySelector(
      ".chart-buttons button:first-of-type"
    );
    this.btnAccuracyMode = document.querySelector(
      ".chart-buttons button:last-of-type"
    );
    this.dataManager = dataManager;
    this.timer = timer;
  }

  async initialize() {
    await this.dataManager.getWords();
    this.dataManager.getLocalStorage();
    this.setInitialState();
    this.createChart();
    this.attachEventListeners();
  }

  setInitialState() {
    this.divWordsPerMinute.innerText = this.dataManager.correctlyTypedWords;
    this.divAccuracy.innerText = this.dataManager.accuracy;
    this.divTimer.innerText = this.timer.timePeriod;
    this.currentWordIndex = 0;
    this.inputCharacterIndex = 0;
    this.displayedPromptWordsCount = 0;
    this.initialPromptWordsCount = 15;
    this.currentWord = undefined;
    this.currentWordCharacters = undefined;
    this.addPromptWords();
    this.getNextWord();
    this.createTypedWord();
  }

  handleTypedWord() {
    this.updateUserMetrics();
    this.updateTypedWordClasses();
    this.currentWord.remove();
    this.addPromptWord();
    this.getNextWord();
    this.createTypedWord();
    this.inputUserText.value = "";
    this.inputCharacterIndex = 0;
    this.currentWordIndex++;
  }

  updateUserMetrics() {
    this.dataManager.typedWords++;
    if (
      this.dataManager.words[this.currentWordIndex] === this.inputUserText.value
    ) {
      this.dataManager.correctlyTypedWords++;
    }
    this.dataManager.updateAccuracy();
    this.divWordsPerMinute.innerText = this.dataManager.correctlyTypedWords;
    this.divAccuracy.innerText = this.dataManager.accuracy;
  }

  updateTypedWordClasses() {
    this.divTypedWords.lastElementChild.classList.remove("active");
    this.divTypedWords.lastElementChild.classList.add("word");

    if (
      this.dataManager.words[this.currentWordIndex] === this.inputUserText.value
    ) {
      this.divTypedWords.lastElementChild.classList.add("correct-word");
    } else {
      this.divTypedWords.lastElementChild.classList.add("incorrect-word");
    }
  }

  displayTypedCharacter(character) {
    const currentTypedCharacter = document.createElement("span");
    currentTypedCharacter.innerText = character;
    if (this.currentWordCharacters.length - 1 >= this.inputCharacterIndex) {
      if (
        character ===
        this.currentWordCharacters[this.inputCharacterIndex].innerText
      ) {
        currentTypedCharacter.classList.add("correct-character");
      } else {
        currentTypedCharacter.classList.add("incorrect-character");
      }
      this.currentWordCharacters[this.inputCharacterIndex].hidden = true;
    } else {
      currentTypedCharacter.classList.add("incorrect-character");
    }
    this.divTypedWords.lastElementChild.appendChild(currentTypedCharacter);
    this.inputCharacterIndex++;
  }

  removeTypedCharacter() {
    this.inputCharacterIndex--;
    if (this.currentWordCharacters.length - 1 >= this.inputCharacterIndex) {
      this.currentWordCharacters[this.inputCharacterIndex].hidden = false;
    }
    this.divTypedWords.lastElementChild.lastElementChild.remove();
  }

  attachEventListeners() {
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".words-wrapper") &&
        this.divWordsWrapper.classList.contains("selectable")
      ) {
        this.divWordsWrapper.classList.add("selected");
        this.inputUserText.focus();
      } else if (this.divWordsWrapper.classList.contains("selected")) {
        this.divWordsWrapper.classList.remove("selected");
      }

      if (e.target === this.btnRestart) this.restart();

      if (e.target === this.btnReset) this.reset();

      if (e.target === this.btnWordsPerMinuteMode) {
        e.target.disabled = true;
        this.btnAccuracyMode.disabled = false;
        this.chartMode = "wpm";
        this.updateChart("wpm");
      }

      if (e.target === this.btnAccuracyMode) {
        e.target.disabled = true;
        this.btnWordsPerMinuteMode.disabled = false;
        this.chartMode = "accuracy";
        this.updateChart("accuracy");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.restart();
      else if (e.key === "Escape") this.reset();
    });

    document.addEventListener("timerIntervalUpdate", () => {
      this.divTimer.innerText = this.timer.timeLeft;
    });

    document.addEventListener("timerEnd", () => {
      this.compareAttempts();
      this.dataManager.updateLocalStorage();
      this.updateChart(this.chartMode);
      this.inputUserText.disabled = true;
      this.divWordsWrapper.classList.remove("selectable");
      this.currentWord.classList.remove("active");
      this.divTypedWords.lastElementChild.classList.add("word");
    });

    this.inputUserText.addEventListener("focus", () => {
      this.divWordsWrapper.classList.add("selected");
    });

    this.inputUserText.addEventListener("blur", () => {
      this.divWordsWrapper.classList.remove("selected");
    });

    this.inputUserText.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        // Ignore spaces if input is empty
        if (!this.inputUserText.value) e.preventDefault();
        // Otherwise submit current word and go to the next
        else if (this.timer.started) {
          e.preventDefault();
          this.handleTypedWord();
        }
      }
      // Prevent user from manipulating input data in unexpected ways
      if (
        e.ctrlKey ||
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        e.key === "PageDown" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        e.preventDefault();
      }
    });

    this.inputUserText.addEventListener("input", (e) => {
      if (
        e.data === null &&
        this.divTypedWords.lastElementChild.children.length > 0 &&
        this.timer.started
      ) {
        this.removeTypedCharacter();
      } else {
        // Start timer when user starts typing
        if (!this.timer.started && this.timer.allowStart) this.timer.start();
        if (this.timer.started) this.displayTypedCharacter(e.data);
      }
    });
  }

  addPromptWord() {
    const divWord = document.createElement("div");
    divWord.classList.add("word");

    for (let character of this.dataManager.words[
      this.displayedPromptWordsCount
    ]) {
      const spanCharacter = document.createElement("span");
      spanCharacter.innerText = character;
      divWord.appendChild(spanCharacter);
    }

    this.divPromptWords.appendChild(divWord);
    this.displayedPromptWordsCount++;
  }

  addPromptWords() {
    for (let i = 0; i < this.initialPromptWordsCount; i++) {
      this.addPromptWord();
    }
  }

  getNextWord() {
    this.currentWord = this.divPromptWords.firstElementChild;
    this.currentWord.classList.add("active");
    this.currentWordCharacters = this.currentWord.children;
  }

  createTypedWord() {
    const typedWord = document.createElement("div");
    this.divTypedWords.appendChild(typedWord);
  }

  removeWords() {
    this.divTypedWords.innerHTML = "";
    this.divPromptWords.innerHTML = "";
  }

  compareAttempts() {
    if (this.dataManager.userMetrics.length > 0) {
      const bestAttempt = this.dataManager.getBestEntry();
      if (this.dataManager.correctlyTypedWords > bestAttempt.wpm) {
        this.divMessage.firstChild.innerText = `New personal best! Your typing speed has improved by ${
          this.dataManager.correctlyTypedWords - bestAttempt.wpm
        } WPM`;
      } else if (this.dataManager.correctlyTypedWords === bestAttempt.wpm) {
        this.divMessage.firstChild.innerText = `So close! Your typing speed was the same as personal best`;
      } else {
        this.divMessage.firstChild.innerText = `Your typing speed was ${
          bestAttempt.wpm - this.dataManager.correctlyTypedWords
        } WPM slower than personal best, keep practicing`;
      }
      this.divMessage.classList.remove("hidden");
    }
  }

  createChart() {
    const data = this.dataManager.getLastEntries(10);
    const config = {
      type: "line",
      data: {
        labels: data.map((entry) => entry.dateAndTime),
        datasets: [
          {
            label: "words per minute",
            data: data.map((entry) => entry.wpm),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        scale: {
          ticks: {
            precision: 0,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            title: {
              display: true,
              text: "WPM",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chart = new Chart(this.canvasChart, config);
    this.chartMode = "wpm";
  }

  updateChart(mode) {
    const data = this.dataManager.getLastEntries(10);
    this.chart.data.labels = data.map((entry) => entry.dateAndTime);
    if (mode === "wpm") {
      this.chart.data.datasets[0].label = "words per minute";
      this.chart.data.datasets[0].data = data.map((entry) => entry.wpm);
      this.chart.options.scales.y.title.text = "WPM";
      this.chart.options.scales.y.max = null;
    } else {
      this.chart.data.datasets[0].label = "accuracy percentage";
      this.chart.data.datasets[0].data = data.map((entry) => entry.accuracy);
      this.chart.options.scales.y.title.text = "accuracy, %";
      this.chart.options.scales.y.max = 100;
    }
    this.chart.update();
  }

  restart() {
    this.removeWords();
    this.dataManager.reset();
    this.timer.reset();
    this.setInitialState();
    this.inputUserText.value = "";
    this.inputUserText.disabled = false;
    this.inputUserText.focus();
    this.divWordsWrapper.classList.add("selectable");
    this.divMessage.classList.add("hidden");
  }

  async reset() {
    this.dataManager.shuffleWords();
    this.restart();
  }
}

class DataManager {
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

class Timer {
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

const main = () => {
  const timer = new Timer(20);
  const dataManager = new DataManager();
  const userInterface = new UserInterface(dataManager, timer);
  userInterface.initialize();
};

main();
