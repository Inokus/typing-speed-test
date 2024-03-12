# typing-speed-test

Project was built using HTML, CSS and JavaScript. It allows users to test their typing speed and accuracy and tracks progress over time.

## Features

- Words are randomly selected from a dictionary containing just under 3000 of the most frequently used English words.
- When the user starts typing, a 60-second timer begins. Once the timer reaches 0, the user is no longer allowed to type.
- A blinking cursor indicates the current position of the user within the word at any time.
- Correctly typed characters gets highlighted in green and incorrectly typed characters gets highlighted in red.
- Underline correctly typed words and strikethrough incorrectly typed words.
- Allow user to use backspace to undo characters of the word that they're currently on.
- Display words per minute (WPM) and accuracy in real time.
- After each attempt, data is stored in the browser's LocalStorage.
- Restart button ("Enter" key shortcut) resets user metrics and timer, but keeps words that were given on last attempt.
- Reset button ("ESC" key shortcut) behaves similarly to restart button, except it gives new words.
- After each attempt (except the first), a message is displayed informing the user of how the current attempt compares to the best attempt so far.
- Data from the last 10 attempts are displayed in a line chart (created using [Chart.js](https://www.chartjs.org/) library). User can toggle between tabs to view either words per minute (WPM) or accuracy metrics.
