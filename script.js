import questions from './data.js'

const time = document.querySelector('#time');
const options = document.querySelector('#options');
const questionTitle = document.querySelector('#question');
const nextQuestion = document.querySelector('#nextQuestion');
const currentQuestion = document.querySelector('#currentQuestion');
const totalQuestion = document.querySelector('#totalQuestion');

String.prototype.toHtmlEntities = function () {
    return this.replace(/./gm, function (s) {
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.index = 0;
        this.question = this.getQuestion();

        totalQuestion.innerHTML = this.questions.length;
        currentQuestion.innerHTML = this.index + 1;

        nextQuestion.addEventListener('click', () => {
            this.nextQuestion();
        })
    }

    designOption(variant, text) {
        return `
            <div data-variant="${variant}" class="py-[9px] px-[12px] border rounded-lg cursor-pointer">
                <b>${variant}.</b> ${text.toHtmlEntities()}
            </div>
        `
    }

    getQuestion() {
        return this.questions[this.index]
    }

    nextQuestion() {
        if (this.index < this.questions.length - 1) {
            this.index++;
        }
        else {
            console.log("Oyun bitdi");
        }
        nextQuestion.classList.add('hidden');
        options.style.pointerEvents = 'initial';
        currentQuestion.innerHTML = this.index + 1;
        this.question = this.getQuestion();
        this.start();
    }

    checkVariant(variant) {
        const el = options.querySelector(`[data-variant="${variant}"]`);
        options.style.pointerEvents = 'none';
        nextQuestion.classList.remove('hidden');
        if (this.question.current.toString().toLowerCase() === variant.toString().toLowerCase()) {
            el.classList.add('bg-[#D4FFBA]');
        }
        else {
            el.classList.add('bg-[#FFDEDE]');
        }
    }

    start() {
        questionTitle.innerHTML = `<b>${this.index + 1}.</b> ${this.question.text}`

        options.innerHTML = '';
        for (let option of Object.keys(this.question.options)) {
            options.innerHTML += this.designOption(option, this.question.options[option]);
        }

        options.addEventListener('click', (e) => {
            const variant = e.target.getAttribute('data-variant');
            if (variant) {
                this.checkVariant(variant);
            }
        })
    }
}

const quiz = new Quiz(questions);
quiz.start();