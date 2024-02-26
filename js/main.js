class UserInterface {
  constructor(dataManager, timer) {
    this.divWordsPerMinute = document.querySelector(".wpm");
    this.divAccuracy = document.querySelector(".accuracy");
    this.divTimer = document.querySelector(".timer");
    this.inputUserText = document.querySelector(".user-text");
    this.divWordsWrapper = document.querySelector(".words-wrapper");
    this.divTypedWords = document.querySelector(".typed-words");
    this.divPromptWords = document.querySelector(".prompt-words");
    this.dataManager = dataManager;
    this.timer = timer;
  }

  async initialize() {
    await this.dataManager.getWords();
    this.setInitialState();
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
    this.updateStats();
    this.updateTypedWordClasses();
    this.currentWord.remove();
    this.addPromptWord();
    this.getNextWord();
    this.createTypedWord();
    this.inputUserText.value = "";
    this.inputCharacterIndex = 0;
    this.currentWordIndex++;
  }

  updateStats() {
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
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.restart();
      } else if (e.key === "Escape") {
        this.reset();
      }
    });

    document.addEventListener("timerIntervalUpdate", () => {
      this.divTimer.innerText = this.timer.timeLeft;
    });

    document.addEventListener("timerEnd", () => {
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
        else if (this.timer.started) {
          e.preventDefault();

          this.handleTypedWord();
        }
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

  restart() {
    this.removeWords();
    this.dataManager.reset();
    this.timer.reset();
    this.setInitialState();
    this.inputUserText.value = "";
    this.inputUserText.disabled = false;
    this.inputUserText.focus();
    this.divWordsWrapper.classList.add("selectable");
  }

  async reset() {
    this.dataManager.shuffleWords();
    this.restart();
  }
}

class DataManager {
  constructor() {
    this.words = undefined;
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
  const timer = new Timer(60);
  const dataManager = new DataManager();
  const userInterface = new UserInterface(dataManager, timer);
  userInterface.initialize();
};

main();
