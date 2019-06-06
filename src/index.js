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
  // Convert the single dimensional Array to multidimencional array
  const dnaMultiArray = dnaArray.map((item) => {
    return Object.keys(item).sort().map((key) => {
      return item[key]
    })
  });
  // Four letters to check if is mutant
  const secA = ['A', 'A', 'A', 'A'];
  const secC = ['C', 'C', 'C', 'C'];
  const secG = ['G', 'G', 'G', 'G'];
  const secT = ['T', 'T', 'T', 'T'];
  // Count the number of occurrences
  let occurenceCounter = 0;
  // Check horizontally
  for (i = 0; i < dnaMultiArray.length; i++) {
    for (j = 0; j <= dnaArray[i].length - secA.length; j++) {
      let dnaHorizontal = [];
      for (k = 0; k < secA.length; k++) {
        dnaHorizontal.push(dnaArray[i][j + k]);
      }
      const dataJoined = dnaHorizontal.join();
      if (dataJoined === secA.join() || dataJoined === secC.join() || dataJoined === secG.join() || dataJoined === secT.join()) {
        occurenceCounter++;
      }
    }
  }
  // Check vertically
  for (i = 0; i < dnaSequence[0].length; i++) {
    for (j = 0; j <= dnaMultiArray.length - secA.length; j++) {
      let dnaVertical = [];
      for (k = 0; k < secA.length; k++) {
        dnaVertical.push(dnaSequence[j + k][i]);
      }
      const dataJoined = dnaVertical.join();
      if (dataJoined === secA.join() || dataJoined === secC.join() || dataJoined === secG.join() || dataJoined === secT.join()) {
        occurenceCounter++;
      }
    }
  }
  // Check diagonally
  for (i = 0; i <= dnaMultiArray.length - secA.length; i++) {
    for (j = 0; j <= dnaSequence[i].length - secA.length; j++) {
      let dnaDiagonally = [];
      for (k = 0; k < secA.length; k++) {
        dnaDiagonally.push(dnaSequence[i + k][j + k]);
      }
      const dataJoined = dnaDiagonally.join();
      if (dataJoined === secA.join() || dataJoined === secC.join() || dataJoined === secG.join() || dataJoined === secT.join()) {
        occurenceCounter++;
      }
    }
  }
  // Check reverse diagonal
  for (i = 0; i <= dnaMultiArray.length - secA.length; i++) {
    for (j = dnaSequence[i].length - 1; j >= 0 + secA.length - 1; j--) {
      let dnaReverseDiagonal = [];
      for (k = 0; k < secA.length; k++) {
        dnaReverseDiagonal.push(dnaSequence[i + k][j - k]);
      }
      const dataJoined = dnaReverseDiagonal.join();
      if (dataJoined === secA.join() || dataJoined === secC.join() || dataJoined === secG.join() || dataJoined === secT.join()) {
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
