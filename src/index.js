var inquirer = require('inquirer');

const initialQuestions = [
  {
    type: 'confirm',
    name: 'enter',
    message: 'Do you want to enter a DNA sequence? (just hit enter for YES)?',
    default: true
  }
];

console.log('Select an option:');

const hasMutation = function (dnaSequence) {
  // Parse the string to an Array of strings
  const dnaArray = JSON.parse(dnaSequence.replace(/\'/g, '"'));
  // Convert the single dimensional Array to multidimensional array
  const dnaMultiArray = dnaArray.map((item) => Object.keys(item).sort().map((key) => item[key]));
  // Only these four letters are available to check if is mutant
  const secA = new Array(4).fill('A').join();
  const secC = new Array(4).fill('C').join();
  const secG = new Array(4).fill('G').join();
  const secT = new Array(4).fill('T').join();
  // Count the number of occurrences
  let occurenceCounter = 0;
  // Check horizontally
  for (i = 0; i < dnaMultiArray.length; i++) {
    for (j = 0; j <= dnaArray[i].length - 4; j++) {
      let dnaHorizontal = [];
      for (k = 0; k < 4; k++) {
        dnaHorizontal.push(dnaArray[i][j + k]);
      }
      const dataJoined = dnaHorizontal.join();
      if (dataJoined === secA || dataJoined === secC || dataJoined === secG || dataJoined === secT) {
        occurenceCounter++;
      }
    }
  }
  // Check vertically
  for (i = 0; i < dnaSequence[0].length; i++) {
    for (j = 0; j <= dnaMultiArray.length - 4; j++) {
      let dnaVertical = [];
      for (k = 0; k < 4; k++) {
        dnaVertical.push(dnaSequence[j + k][i]);
      }
      const dataJoined = dnaVertical.join();
      if (dataJoined === secA || dataJoined === secC || dataJoined === secG || dataJoined === secT) {
        occurenceCounter++;
      }
    }
  }
  // Check diagonally
  for (i = 0; i <= dnaMultiArray.length - 4; i++) {
    for (j = 0; j <= dnaSequence[i].length - 4; j++) {
      let dnaDiagonally = [];
      for (k = 0; k < 4; k++) {
        dnaDiagonally.push(dnaSequence[i + k][j + k]);
      }
      const dataJoined = dnaDiagonally.join();
      if (dataJoined === secA || dataJoined === secC || dataJoined === secG || dataJoined === secT) {
        occurenceCounter++;
      }
    }
  }
  // Check reverse diagonal
  for (i = 0; i <= dnaMultiArray.length - 4; i++) {
    for (j = dnaSequence[i].length - 1; j >= 0 + 4 - 1; j--) {
      let dnaReverseDiagonal = [];
      for (k = 0; k < 4; k++) {
        dnaReverseDiagonal.push(dnaSequence[i + k][j - k]);
      }
      const dataJoined = dnaReverseDiagonal.join();
      if (dataJoined === secA || dataJoined === secC || dataJoined === secG || dataJoined === secT) {
        occurenceCounter++;
      }
    }
  }
  return (occurenceCounter > 0) ? true : false ;
};

const checkDna = function () {
  const allowedLetters = ['A', 'T', 'C', 'G'];
  const adnQuestions = [
    {
      type: 'input',
      name: 'sequence',
      message: "Enter the DNA sequence in Array format:",
      validate: function (value) {
        let pass = false;
        const squareBrackets = new RegExp(/\[.*?\]/g, 'i');
        // Check if the string contains square brakets, quotes and commas
        if (squareBrackets.test(value) && (value.indexOf('\'') >= 0 || value.indexOf('"') >= 0 || value.indexOf(',') >= 0)) {
          let notExists = false;
          const dnaArray = JSON.parse(value.replace(/\'/g, '"'));
          dnaArray.forEach((word) => {
            word.replace(/['"]+/g, '').split('').forEach((letter) => {
              const clean = letter.toUpperCase();
              if (clean.length) {
                if (!allowedLetters.includes(clean)) {
                  notExists = true;
                }
              }
            });
          });
          if (!notExists) {
            pass = !notExists;
          }
        }
        if (pass) {
          return true;
        }
        return 'Please enter a valid DNA sequence.';
      }
    }
  ];
  inquirer
    .prompt(adnQuestions)
    .then(adnAnswers => {
      if (hasMutation(adnAnswers.sequence)) {
        console.log('Are you Mutant!! :-O');
      } else {
        console.log('Are you Human!! :-D');
      }
      enter();
    });
};

const enter = function () {
  inquirer
    .prompt(initialQuestions)
    .then(initialAnswers => {
      if (initialAnswers.enter) {
        console.log('Example of DNA array (with square brackets [] and with single or double quotes):');
        console.log(' - Mutant:  ["ACGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]');
        console.log(" - Human:  ['ATGCGA','CAGTGC','TTATGT','AGAAGG','CCGCTA','TCACTG']");
        console.log('\n Only the following letters are allowed: A,T,C,G');
        checkDna();
      }
    });
}
enter();
