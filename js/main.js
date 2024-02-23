class UserInterface {
  constructor(wordsArray) {
    this.inputUserText = document.querySelector(".user-text");
    this.divWordsWrapper = document.querySelector(".words-wrapper");
    this.divTypedWords = document.querySelector(".typed-words");
    this.divPromptWords = document.querySelector(".prompt-words");
    this.wordsArray = wordsArray;
    this.currentWordIndex = 0;
    this.inputCharacterIndex = 0;
    this.displayedPromptWordsCount = 0;
    this.initialPromptWordsCount = 10;
    this.currentWord = undefined;
    this.currentWordLetters = undefined;
    this.initialize();
  }

  initialize() {
    this.addPromptWords();
    this.getNextWord();
    this.createTypedWord();
    this.attachEventListeners();
  }

  handleTypedWord() {
    this.updateTypedWordClasses();
    this.currentWord.remove();
    this.getNextWord();
    this.inputUserText.value = "";
    this.inputCharacterIndex = 0;
    this.currentWordIndex++;
    this.createTypedWord();
    this.addPromptWord();
  }

  updateTypedWordClasses() {
    for (let character of this.divTypedWords.lastElementChild.children) {
      character.classList.remove("correct", "incorrect");
    }

    this.divTypedWords.lastElementChild.classList.remove("active");
    this.divTypedWords.lastElementChild.classList.add("word");

    if (this.wordsArray[this.currentWordIndex] !== this.inputUserText.value) {
      this.divTypedWords.lastElementChild.classList.add("incorrect-word");
    }
  }

  displayTypedCharacter(character) {
    const currentTypedCharacter = document.createElement("span");
    currentTypedCharacter.innerText = character;
    if (this.currentWordLetters.length - 1 >= this.inputCharacterIndex) {
      if (
        character ===
        this.currentWordLetters[this.inputCharacterIndex].innerText
      ) {
        currentTypedCharacter.classList.add("correct");
      } else {
        currentTypedCharacter.classList.add("incorrect");
      }
      this.currentWordLetters[this.inputCharacterIndex].hidden = true;
    } else {
      currentTypedCharacter.classList.add("incorrect");
    }
    this.divTypedWords.lastElementChild.appendChild(currentTypedCharacter);
    this.inputCharacterIndex++;
  }

  removeTypedCharacter() {
    this.inputCharacterIndex--;
    if (this.currentWordLetters.length - 1 >= this.inputCharacterIndex) {
      this.currentWordLetters[this.inputCharacterIndex].hidden = false;
    }
    this.divTypedWords.lastElementChild.lastElementChild.remove();
  }

  attachEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".words-wrapper")) {
        this.divWordsWrapper.classList.add("selected");
        this.inputUserText.focus();
      } else if (this.divWordsWrapper.classList.contains("selected")) {
        this.divWordsWrapper.classList.remove("selected");
      }
    });

    this.inputUserText.addEventListener("focus", () => {
      this.divWordsWrapper.classList.add("selected");
    });

    this.inputUserText.addEventListener("blur", () => {
      this.divWordsWrapper.classList.remove("selected");
      this.inputUserText.blur();
    });

    this.inputUserText.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        // Ignore spaces if input is empty
        if (!this.inputUserText.value) e.preventDefault();
        else {
          e.preventDefault();
          this.handleTypedWord();
        }
      }
    });

    this.inputUserText.addEventListener("input", (e) => {
      if (
        e.data === null &&
        this.divTypedWords.lastElementChild.children.length > 0
      ) {
        this.removeTypedCharacter();
      } else {
        this.displayTypedCharacter(e.data);
      }
    });
  }

  addPromptWord() {
    const word = document.createElement("div");
    word.classList.add("word");

    for (let character of this.wordsArray[this.displayedPromptWordsCount]) {
      const letter = document.createElement("span");
      letter.textContent = character;
      word.appendChild(letter);
    }
    this.divPromptWords.appendChild(word);
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
    this.currentWordLetters = this.currentWord.children;
  }

  createTypedWord() {
    const typedWord = document.createElement("div");
    this.divTypedWords.appendChild(typedWord);
  }
}

const main = (wordsArray) => {
  const interface = new UserInterface(wordsArray);
};

const words = [
  "toadying",
  "earner",
  "uretic",
  "absterges",
  "periodicity",
  "tenebrae",
  "solitary",
  "edemata",
  "themselves",
  "aggrandize",
  "hobbing",
  "evenhanded",
  "dissolute",
  "tubings",
  "milded",
  "dobsonflies",
  "regearing",
  "calorically",
  "aerosolize",
  "chairmaning",
  "hallucinogenic",
  "rattening",
  "cymlins",
  "inhibit",
  "pomfret",
  "fossicking",
  "disappearance",
  "narrations",
  "discombobulates",
  "plagiarize",
  "fops",
  "pixels",
  "buffet",
  "sentineled",
  "restrings",
  "spumiest",
  "fallownesses",
  "intrusion",
  "glimpser",
  "trippings",
  "iatrogenically",
  "mizuna",
  "liturgy",
  "owning",
  "loanshift",
  "barbette",
  "aquarist",
  "deionizing",
  "arrowy",
  "anabaenas",
  "saddlebreds",
  "frowsier",
  "ambeer",
  "monoglot",
  "consummation",
  "lighthearted",
  "glockenspiels",
  "camails",
  "eglantine",
  "billon",
  "trothplighted",
  "disseisins",
  "epicyclic",
  "funkers",
  "quiches",
  "algaecides",
  "quack",
  "annihilate",
  "coplots",
  "limbo",
  "monoester",
  "longans",
  "ornamented",
  "tallitim",
  "guanidin",
  "removableness",
  "octave",
  "illumes",
  "regionalistic",
  "offertory",
  "initialers",
  "knish",
  "survivors",
  "apers",
  "flowerages",
  "anthelixes",
  "misdiagnosis",
  "azo",
  "rewidens",
  "toolsheds",
  "connaturalities",
  "mulligans",
  "webcasted",
  "monitors",
  "phoebe",
  "adit",
  "melancholy",
  "finaglers",
  "woadwaxen",
  "eradicable",
  "anachronous",
  "tauts",
  "convertors",
  "miscreations",
  "proems",
  "celestially",
  "scalade",
  "raggednesses",
  "lamebrain",
  "hammals",
  "epexegeses",
  "affluencies",
  "unshell",
  "fearlessness",
  "cacomixl",
  "holism",
  "oxyhemoglobins",
  "phials",
  "backblock",
  "snyes",
  "cribbages",
  "knucklier",
  "retiringly",
  "sociobiology",
  "gazetting",
  "prize",
  "quarterbacking",
  "pomps",
  "inthral",
  "inoculative",
  "communalist",
  "barleycorn",
  "paleozoology",
  "viewy",
  "dressmaker",
  "anabas",
  "spinsterhoods",
  "fano",
  "chafing",
  "palates",
  "preunited",
  "deemed",
  "incuriousnesses",
  "maddest",
  "stoniness",
  "uncandled",
  "aestivations",
  "entrancements",
  "rarenesses",
  "soddened",
  "growled",
  "rumble",
  "humidifying",
  "adaptor",
  "undotted",
  "bankcards",
  "traduced",
  "coldblood",
  "papules",
  "reincorporate",
  "centesis",
  "collides",
  "essentialize",
  "resentfully",
  "natatoria",
  "viridity",
  "infinity",
  "prickers",
  "cloudlessness",
  "dressiest",
  "wimpling",
  "sympathins",
  "dopinesses",
  "daglocks",
  "hatful",
  "fragmentation",
  "pitsaw",
  "pht",
  "phallocentric",
  "faenas",
  "adnoun",
  "hafizes",
  "constructions",
  "unwishes",
  "variablenesses",
  "eroticisms",
  "villains",
  "dummied",
  "biotron",
  "plaisters",
  "rockfishes",
  "nonmarket",
  "invocating",
  "dinette",
  "linos",
  "egestion",
  "recock",
  "piroplasma",
  "psychopath",
  "tushie",
  "attrites",
  "polarographies",
  "scuffed",
  "avow",
  "solanaceous",
  "nonlegumes",
  "peacekeepers",
  "gnawers",
  "espaliering",
  "penguins",
  "fudging",
  "autografting",
  "soba",
  "upleap",
  "outpreached",
  "remuda",
  "hayracks",
  "parathion",
  "thromboplastic",
  "dogmatists",
  "blindfold",
  "nixie",
  "plugless",
  "soul",
  "batting",
  "nucleoplasm",
  "netizens",
  "paralyses",
  "ephedras",
  "walla",
  "asperities",
  "berming",
  "squama",
  "asafoetidas",
  "abwatts",
  "evacuees",
  "cenacle",
  "gasters",
  "daemon",
  "punctiliously",
  "misfocusses",
  "column",
  "zelkova",
  "zealously",
  "caners",
  "columbites",
  "jerkiest",
  "permeators",
  "tittivating",
  "wharfmaster",
];

main(words);
