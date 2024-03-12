import Timer from "./Timer.js";
import DataManager from "./DataManager.js";
import UserInterface from "./UserInterface.js";

const main = () => {
  const timer = new Timer(60);
  const dataManager = new DataManager();
  const userInterface = new UserInterface(dataManager, timer);
  userInterface.initialize();
};

main();
