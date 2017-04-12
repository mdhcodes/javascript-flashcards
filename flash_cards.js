var basicQuestions = require('./basic.json');
var inquirer = require('inquirer');

// Store user input
var processArgv = process.argv.slice(2);
// Variable to store the user's name.
var userName = processArgv[0];
// Variable to store the user's preference for basic or cloze questions.
var userAction = processArgv[1];


// Variables we will use to loop over the basicQuestions object and store the number of correct answers.
var index = 0;
var correct = 0;

// Function to display the player's score at the end of the game.
var getScore = function(correct, incorrect) {
  console.log('Game Over!\n');
  console.log('Your score: ' + correct + '/'  + basicQuestions.length + '\n');
};


// Function to ask the player if they'd like to play again or end the game.
var gameStatus = function() {
  // Use Inquirer to ask the user questions.
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'playAgain',
      message: 'Would you like to play again?'
    }
  ]).then(function(user) {
    if(user.playAgain === true) {
      console.log('Great! Let\'s play again!\n');
      basicGame(basicQuestions);
    } else {
      console.log('Thanks for playing! Goodbye!');
    }
  });
};


// Function to play the game with basic questions.
var basicGame = function(questions) {
  // if statement to ensure that our question prompts stop after all the questions in the questions object have been answered.
  if (index < questions.length) {
    //console.log('Length', questions.length);
    // Execute inquirer and ask the user a series of questions.
    // Store the user's answers within the variable user inside the .then statement.
    inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: questions[index].front
      }
    ]).then(function(user) {
      // Convert all answers to lower case for scoring accuracy.
      if (user.answer.toLowerCase() === questions[index].back.toLowerCase()) {
          console.log('You are correct!\n');
          // If the user answers the question correctly, add one to the correct variable.
          correct++;
          // Add one to the index variable to loop over our questions object.
          index++;
      } else {
          // If the user answers the question incorrectly, display the following message.
          console.log('Incorrect! The correct answer is '  + questions[index].back + '.\n');
          // Add one to the index variable to loop over our questions object.
          index++;
      }
      // Execute the basicGame function again to end the loop or ask another question.
      basicGame(questions);
    });
  } else {
    // After all the questions have been asked and answered, execute the getScore function to display the score.
    getScore(correct);
    // Execute the gameStatus function to ask the user if they want to play again or end the game.
    gameStatus();
    // Reset the game variables.
    index = 0;
    correct = 0;
  }
};


if(userAction === 'basic') {
  // Display the welcome message.
  console.log('Hi ' + userName + '! Let\'s answer some ' + userAction + ' questions.\n');
  // Execute the basicGame function to play the basic game.
  basicGame(basicQuestions);
} else {
  console.log('Please select the type of questions you\'d like: basic or cloze.');
}