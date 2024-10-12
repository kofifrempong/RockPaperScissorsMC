
class User {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.highscore = 0;
        this.errors = 0;
        this.history = [];
    }
    
    updateScore(isCorrect) {
        if (isCorrect) {
            this.score++;
        }
        else {
            this.errors++;
        }
        this.history.push(isCorrect);
        if (this.score > this.highscore) this.highscore = this.score;
        console.log(this.history);
    }

   


}


class Question {
    constructor(question, options, answer, difficulty = 'easy') {
        this.question = question;
        this.options = options;
        this.answer = answer;
        this.difficulty = difficulty; 
    }
    
    isCorrect(answer, guess) {
        return guess.toLowerCase() === answer.toLowerCase();
    }

}


class Quiz {
    constructor(questions, user) {
        this.questions = questions;
        this.currentIndex = 0;
        this.easyIndex = 0;
        this.mediumIndex =0;
        this.hardIndex = 0;
        this.user = user;
        this.computerScore = 0;
        this.compErrors = 0;
        this.difficulty = 'easy';  
    }
    
    
    adjustDifficulty() {
        const correctCount = this.user.history.filter(correct => correct).length;
        const totalAnswers = this.user.history.length;

        if (totalAnswers >= 3) {
            const correctRate = correctCount / totalAnswers;
            if (correctRate > 0.7) {
                this.difficulty = 'hard'; 
                this.currentIndex = this.hardIndex;
            } else if (correctRate > 0.4) {
                this.difficulty = 'medium';  
                this.currentIndex = this.mediumIndex;
            } else {
                this.difficulty = 'easy';  
                this.currentIndex = this.easyIndex;

            }
        }
    }
   
    getNextQuestion() {
        this.adjustDifficulty();  
        const questionCount = document.querySelector('.q-count');
        const questionsOfCurrentDifficulty = this.questions.filter(q => q.difficulty === this.difficulty);



        questionCount.textContent = `Easy:`+ this.easyIndex + `/` + (this.questions.filter(q => q.difficulty === "easy")).length + "   " + `   Medium:`+ this.mediumIndex + `/` + (this.questions.filter(q => q.difficulty === "medium")).length + "   " + `   Hard:`+ this.hardIndex +`/`+ (this.questions.filter(q => q.difficulty === "hard")).length;
        
        
       

        if (this.currentIndex < questionsOfCurrentDifficulty.length) {
            this.currentIndex++;
            
            if (this.difficulty == "hard") this.hardIndex = this.currentIndex;
            else if (this.difficulty == "medium") this.mediumIndex = this.currentIndex;
            else if (this.difficulty == "easy") this.easyIndex = this.currentIndex;
    
            return questionsOfCurrentDifficulty[this.currentIndex-1];
        }
        return null;
    }

    updateComputerScore(isCorrect) {
        if (isCorrect) {
            this.computerScore++;
        }
        else {
            this.compErrors++;

        }
    }
    
    isGameOver() {
        return this.currentIndex >= 15;
    }
    
    getFinalResult() {
        if (this.user.score > this.computerScore) {
            return 'You beat the game!';
        } else if (this.user.score < this.computerScore) {
            return 'You were beat by the game.';
        } else {
            return 'You tied with the game.';
        }
    }
}


var easyQuestions = [
    new Question("Which planet is known as the Red Planet?", ["Mars", "Jupiter", "Saturn", "Venus"], "Mars", 'easy'),
    new Question("What is the capital of France?", ["Berlin", "Paris", "Madrid", "Brussels"], "Paris", 'easy'),
    new Question("What is the largest ocean on Earth?", ["Atlantic Ocean","Indian Ocean", "Pacific Ocean", "Arctic Ocean"], "Pacific Ocean", "easy"),
    new Question("What is the fastest land animal?", ["Cheetah", "Lion", "Horse", "Elephant"], "Cheetah", "easy"),
    new Question("How many continents are there?", ["Five", "Six", "Seven", "Eight"], "Seven", "easy")

];

var mediumQuestions = [
    new Question("What transport protocol(s) does DNS use?", ["TCP", "UDP", "Neither", "Both"], "Both", 'medium'),
    new Question("A typical Linux file system uses:", ["contiguous space allocation", "linked-list approach", "direct/indirect indexed approach", "both Rock and Paper"], "direct/indirect indexed approach", 'medium'),
    new Question("Which element has the chemical symbol 'O'?", ["Oxygen", "Osmium", "Oganesson", "None of the above"], "Oxygen", 'medium'),
    new Question("Who wrote the play 'Romeo and Juliet'?", ["William Shakespeare", "Jane Austen", "Mark Twain", "John Milton"], "William Shakespeare", 'medium'),
    new Question("What is the longest river in the world?", ["Nile", "Amazon", "Yangtze", "Congo"], "Nile", 'medium')

];

var hardQuestions = [
    new Question("The su command on a Linux system allows a user to:", ["temporarily assume the identity of the superuser (or another user)", "start up the system following a shutdown", "suspend the execution of a selected process", "invoke legal proceedings to collect financial damages for suffering"], "temporarily assume the identity of the superuser (or another user)", 'hard'),
    new Question("Among CPU scheduling policies, First Come First Serve (FCFS) is attractive because:", ["it is simple to implement", "it is fair to all processes", "it minimizes the total waiting time in the system"], "it is simple to implement", 'hard'),
    new Question("What is the square root of 256?", ["14", "16", "18", "15"], "16", 'hard'),
    new Question("In what year did the Titanic sink?", ["1912", "1905", "1923", "1910"], "1912", 'hard'),
    new Question("Which scientist developed the theory of general relativity?", ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Alan Turing"], "Albert Einstein", 'hard')

];



function* questionGenerator(quiz) {
    while (!quiz.isGameOver()) {
        yield quiz.getNextQuestion();
    }
}

async function fetchTrivia() {
    const url = 'https://opentdb.com/api.php?amount=15'; 
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.results); 

      const opentdbquestions = data.results;
      opentdbquestions.forEach((question, index) => {
        let incompleteoptions = question.incorrect_answers.toString().split(",");

       
        incompleteoptions.splice((incompleteoptions.length+1) * Math.random() | 0, 0, question.correct_answer.toString())
        console.log(`${incompleteoptions}`);
        const newquest = new Question(question.question, incompleteoptions, question.correct_answer, question.difficulty);

        if (question.difficulty == "easy") easyQuestions.push(newquest)
        else if (question.difficulty == "medium") mediumQuestions.push(newquest)
        else if (question.difficulty == "hard") hardQuestions.push(newquest)






      });




  
    } catch (error) {
      console.error('Failed to fetch trivia questions:', error);
    }
  }
  

  
var knownusers = [


]

async function game() {
    let guess = '';
    let answertext = '';
    loadUsersFromLocalStorage(); 
    
    let givenname = prompt("Who are you?", "Player");
    var user;
    console.log(knownusers)

    let existingUserIndex = knownusers.findIndex(o => o.name === givenname);
    
    if (existingUserIndex !== -1) {
        let existingUserData = knownusers[existingUserIndex];
        user = new User(existingUserData.name);
        user.score = 0;
        user.highscore = existingUserData.highscore;
        user.history = [];
    } else {
       
        user = new User(givenname);
    }

    
    await fetchTrivia();

    
    var questions = easyQuestions.concat(mediumQuestions, hardQuestions);
    console.log(questions);

    const quiz = new Quiz(questions, user);
    const questionFlow = questionGenerator(quiz);
    function getComputerChoice() {
        const choices = ["rock", "paper", "scissors", "shoot"];
        return choices[Math.floor(Math.random() * choices.length)];
    }
    function saveUsersToLocalStorage() {
        if (existingUserIndex !== -1) {
            knownusers[existingUserIndex] = user; 
        } else {
            knownusers.push(user);
        }
        localStorage.setItem('knownUsers', JSON.stringify(knownusers));
    }
    function loadUsersFromLocalStorage() {
        const storedUsers = localStorage.getItem('knownUsers');
        if (storedUsers) {
            knownusers = JSON.parse(storedUsers);
        }
    }

    


    
    const rockBtn = document.querySelector('.btn-rock');
    const paperBtn = document.querySelector('.btn-paper');
    const scissorsBtn = document.querySelector('.btn-scissors');
    const shootBtn = document.querySelector('.btn-shoot');
    const nextBtn = document.querySelector('.btn-next');
    const resultDisplay = document.querySelector('.result');
    const questionDisplay = document.querySelector('.question');
    const questionsDisplay = document.querySelector('.questions');
    const historyClear = document.querySelector('.btn-history');

    function cleardisplay() {

        const optionsDivs = questionsDisplay.getElementsByTagName('div');

        for (var i = 0; i < optionsDivs.length; i++) {
            console.log(optionsDivs[i])
           
            optionsDivs[i].textContent = " ";

        }
    }
    



    function displayQuestion() {
       

        const currentQuestion = questionFlow.next().value;
        if (currentQuestion) {
 
            questionDisplay.textContent = currentQuestion.difficulty + ": " + currentQuestion.question;
            const optionsDivs = questionsDisplay.getElementsByTagName('div');
      
            

     
            currentQuestion.options.forEach((option, index) => {
                optionsDivs[index].textContent = option;
                if (currentQuestion.options[index] === currentQuestion.answer) {
                    guess = optionsDivs[index].className; 
                    answertext = guess +  ": " + currentQuestion.answer;
                }
            });
        } else {
            resultDisplay.textContent = `Quiz over! Final score: Player ${user.score}, Computer ${quiz.computerScore}. ${quiz.getFinalResult()}`;
           
            saveUsersToLocalStorage();
           
        }
    }

    function checkAnswer(playerSelection, computerSelection) {
        const currentQuestion = questions[quiz.currentIndex - 1];
        const isPlayerCorrect = currentQuestion.isCorrect(playerSelection, guess);
        const isComputerCorrect = currentQuestion.isCorrect(computerSelection, guess);

        user.updateScore(isPlayerCorrect);
        quiz.updateComputerScore(isComputerCorrect);

        const playerScoreBoard = document.querySelector('.p-count');
        const playerErrors = document.querySelector('.pe-count');
        const computerErrors = document.querySelector('.ce-count');
        const computerScoreBoard = document.querySelector('.c-count');
        const playerHighScoreBoard = document.querySelector('.p-high-count');
        playerHighScoreBoard.textContent = user.highscore;
        playerScoreBoard.textContent = user.score;
        playerErrors.textContent = user.errors;
        computerErrors.textContent = quiz.compErrors;
        computerScoreBoard.textContent = quiz.computerScore;

        return `Player was ${isPlayerCorrect ? 'correct' : 'incorrect'}, Computer was ${isComputerCorrect ? 'correct' : 'incorrect'}.` + ` The answer was "${answertext}"`;
    }

    
    const playerOptions = [rockBtn, paperBtn, scissorsBtn, shootBtn];
    displayQuestion();


    playerOptions.forEach(option => {
        option.addEventListener('click', function () {
            const computerSelection = getComputerChoice();
            const roundResult = checkAnswer(this.innerText, computerSelection);
            resultDisplay.textContent = roundResult;
            setTimeout(cleardisplay(), 200);
            
            setTimeout(displayQuestion.bind(this), 200);
        }.bind(option));
    });

    nextBtn.addEventListener('click', function () {
        resultDisplay.textContent = "Player hit next and passed on this question";
        setTimeout(cleardisplay(), 200);
        displayQuestion();
    });;

    function clearUserData() {
        localStorage.clear();
    }
    historyClear.addEventListener('click', function () {
        clearUserData();
    });
    
};


game();
