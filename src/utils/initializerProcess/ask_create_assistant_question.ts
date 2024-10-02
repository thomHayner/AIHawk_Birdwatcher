#!/usr/bin/env node

// https://stackoverflow.com/questions/74702029/how-do-we-get-user-input-in-java-script-console#:~:text=If%20you%20are%20using%20NodeJS%2C%20to%20prompt,you%20can%20prompt%20the%20user%20for%20their
// https://nodejs.org/api/readline.html
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('No OpenAI Assitant ID was found, did you forget to add the value to your .env file? (N)\nOR\nWould you like to create a new assistant (Y)?\n(Y/N)', (response) => {
  if (response === 'Y' || response === 'y' || response === 'Yes' || response === 'yes') {
    console.log(`${response}`);
  }
  rl.close();
});
