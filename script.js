import questions from './data.js'
import Quiz from "./quiz.js"

const quiz = new Quiz({
    questions,  // questions:questions (her ikisi eyni adda oldugu ucun birini yazmaq kifayet edir)
    ui: {
        time: document.querySelector('#time'),
        options: document.querySelector('#options'),
        question: document.querySelector('#question'),
        nextQuestion: document.querySelector('#nextQuestion'),
        currentQuestion: document.querySelector('#currentQuestion'),
        totalQuestion: document.querySelector('#totalQuestion'),
        lineBar: document.querySelector('#lineBar'),
        answerSuccess: document.querySelector('#answerSuccess'),
        answerError: document.querySelector('#answerError'),
        answerNone: document.querySelector('#answerNone'),
        quizContent: document.querySelector('#quizContent'),
        answerContent: document.querySelector('#answerContent'),
        start: document.querySelector('#start'),
        quiz: document.querySelector('#quiz'),
        restart: document.querySelector('#restart'),
    },
    optionTemplate: `
        <div data-variant=":variant" class="py-[9px] px-[12px] border rounded-lg cursor-pointer">
            <b>:variant.</b> :text
        </div>
    `
});

quiz.events();