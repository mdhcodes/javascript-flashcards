var ClozeCards = require('./cloze_cards.js');
var BasicCards = require('./basic_cards.js');
var basicQuestions = require('./basic.json');
var clozeQuestions = require('./cloze.json');

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
var getScore = function(correct) {
  console.log('Game Over!\n');
  console.log('Your score: ' + correct + '/'  + basicQuestions.length + '\n');
};


// Function to ask the player if they'd like to play again or end the game.
var gameStatus = function() {
  // Use Inquirer to ask the user questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'playAgain',
      message: 'Would you like to play again?'
    }
  ]).then(function(user) {
    if(user.playAgain === true) {
      console.log('Great! Let\'s play again!\n');
        if(userAction === 'basic') {
          basicGame(basicQuestions);
        } else {
          clozeGame(clozeQuestions);
        }
    } else {
      console.log('Thanks for playing! Goodbye!');
    }
  });
};


// Function to ask the user what type of questions they'd like to create.
var createQuestions = function(basicQuestions, clozeQuestions) {
  // Use Inquirer to ask the user questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'input',
      name: 'questionType',
      message: 'Would you like to create basic or cloze questions?'
    }
  ]).then(function(user) {
    var quesType = user.questionType;
    if(quesType === 'basic') {
      console.log('Great! Let\'s create ' + quesType + ' questions!\n');
      createBasicQues(basicQuestions);
    } else if(quesType === 'cloze') {
      console.log('Great! Let\'s create ' + quesType + ' questions!\n');
      createClozeQues(clozeQuestions);
    } else {
      console.log('Please select a valid question type.');
    }
  });
};


// The variable count will determine how many times the inquirer prompts will appear and how many questions will be created.
var count = 0;
// Function to create basic questions.
var createBasicQues = function(basicQuestions) {
  // Use Inquirer to ask the user questions.
  var inquirer = require('inquirer');
  // Use fs to read and write files.
  var fs = require('fs');
  // Allow user to create two questions per session.
  if(count < 2) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'front',
        message: 'Please enter a question.'
      },
      {
        type: 'input',
        name: 'back',
        message: 'Please enter the answer to the previous question.'
      }
    ]).then(function (card) {

      var newQues = new BasicCards(
        card.front,
        card.back
      );
      // Appending questions to the basic.json file is not fully functional.
      // Adds object to the basic.json file after the array // ]{"front":"asdf","back":"asdf"}{"front":"asdf","back":"asdf"}
      fs.appendFile('./basic.json', JSON.stringify(newQues), 'utf-8', function(error) {
        if(error) {
          throw error;
        }
        console.log('New questions were added to the ./basic.json file.');
      });
      count++;
      createBasicQues(basicQuestions);
    });
  } else {
    console.log('You created two basic questions!');
  }
};



// Function to create cloze questions.
var createClozeQues = function(clozeQuestions) {
  // Use Inquirer to ask the user questions.
  var inquirer = require('inquirer');
  // Use fs to read and write files.
  var fs = require('fs');
  // Allow user to create two questions per session.
  if(count < 2) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fullText',
        message: 'Please enter the full text.'
      },
      {
        type: 'input',
        name: 'cloze',
        message: 'Please enter the cloze deletion.'
      }
    ]).then(function (card) {

      var newQues = new ClozeCards(
        card.fullText,
        card.cloze
      );
      // Appending questions to the cloze.json file is not fully functional.
      // Adds object to the cloze.json file after the array // ]{"front":"asdf","back":"asdf"}{"front":"asdf","back":"asdf"}
      fs.appendFile('./cloze.json', JSON.stringify(newQues), 'utf-8', function(error) {
        if(error) {
          throw error;
        }
        console.log('New questions were added to the ./cloze.json file.');
      });
      count++;
      createClozeQues(clozeQuestions);
    });
  } else {
    console.log('You created two cloze questions!');
  }
};



//*********** NOT FULLY FUNCTIONAL - getScore() and gameStatus() ****************************************
//*********** UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection: id 1) ***********
//*********** Type Error: Cannot read property 'fullText' of undefined **********************************
// Function to play the game with basic questions.
var clozeGame = function(questions) {
  // Create a new Clozecard object to access the ClozeCard methods.
  var newClozeCards = new ClozeCards(questions[index].fullText, questions[index].cloze);
  //console.log('Partial Text:', newClozeCards.getPartialText());

  // if statement to ensure that our question prompts stop after all the questions in the questions object have been answered.
  if (index < questions.length) {
    //console.log('Length', questions.length);
    // Execute inquirer and ask the user a series of questions.
    var inquirer = require('inquirer');
    // Store the user's answers within the variable user inside the .then statement.
    inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: newClozeCards.getPartialText()
      }
    ]).then(function(user) {
      // Error logs to the console if the partialText does not contain '...'
      if( !(newClozeCards.getPartialText().includes('...')) ){
        //console.log('Partial Includes ...', newClozeCards.getPartialText().includes('...'));
        // Include the code below in the cloze.json file to see brokenCloze error.
        /*
        {
          "fullText": "This doesn't work.",
          "cloze": "oops"
        },
        */
        // The error appears and the program stops. Remove the brokenCloze to continue.
        newClozeCards.brokenCloze();
      // Convert all answers to lower case for scoring accuracy.
    } else if (user.answer.toLowerCase() === questions[index].cloze.toLowerCase()) {
          console.log('You are correct!\n');
          // If the user answers the question correctly, add one to the correct variable.
          correct++;
          // Add one to the index variable to loop over our questions object.
          index++;
      } else {
          // If the user answers the question incorrectly, display the following message.
          console.log('Incorrect! The correct answer is: '  + newClozeCards.getFullText() + '\n'); //OR
          //console.log('Incorrect! The correct answer is: '  + questions[index].fullText + '\n'); //OR
          //console.log('Incorrect! The correct answer is: '  + newClozeCards.fullText + '\n');
          // Add one to the index variable to loop over our questions object.
          index++;
      }
      // Execute the basicGame function again to end the loop or ask another question.
      clozeGame(questions);
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



// Function to play the game with basic questions.
var basicGame = function(questions) {
  // if statement to ensure that our question prompts stop after all the questions in the questions object have been answered.
  if (index < questions.length) {
    //console.log('Length', questions.length);
    // Execute inquirer and ask the user a series of questions.
    var inquirer = require('inquirer');
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


// Check user input to determine how the program will proceed.
if(userAction === 'basic') {
  // Display the welcome message.
  console.log('Hi ' + userName + '! Let\'s answer some ' + userAction + ' questions.\n');
  // Execute the basicGame function to play the basic game.
  basicGame(basicQuestions);
} else if(userAction === 'cloze') {
  // Display the welcome message.
  console.log('Hi ' + userName + '! Let\'s answer some ' + userAction + ' questions.\n');
  // Execute the basicGame function to play the basic game.
  clozeGame(clozeQuestions);
} else if(userAction === 'create') {
  // Display the welcome message.
  console.log('Hi ' + userName + '! Let\'s ' + userAction + ' questions.\n');
  // Execute the basicGame function to play the basic game.
  createQuestions(basicQuestions, clozeQuestions);
} else {
  console.log('Please select the type of questions you\'d like: basic or cloze.');
}