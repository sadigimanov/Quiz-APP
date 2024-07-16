String.prototype.toHtmlEntities = function () {
    return this.replace(/./gm, function (s) {
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};

let startTimeInterval;
let lineBarInterval;

let answer = {
    success: 0,
    error: 0,
    none: 0
}
class Quiz {
    constructor({ questions, ui, optionTemplate }) {
        this.questions = questions;
        this.ui = ui;
        this.optionTemplate = optionTemplate;

        this.index = 0;
        this.question = this.getQuestion();

        this.ui.totalQuestion.innerHTML = this.questions.length;
        this.ui.currentQuestion.innerHTML = this.index + 1;
    }

    // Tek bir suali getirmek ucun
    getQuestion() {
        return this.questions[this.index];
    }

    // Sualin cavablarini DOM-da yaratmaq ucun
    createQuestionOption(variant, text) {
        return this.optionTemplate
            .replace(':variant', variant)
            .replace(':variant', variant)
            .replace(':text', text.toHtmlEntities())
    }

    // DOM-da suali yaratmaq ucun
    creatQuestion() {
        this.ui.question.innerHTML = `<b>${this.index + 1}.</b> ${this.question.text}`
        this.ui.options.innerHTML = '';
        for (let opt of Object.keys(this.question.options)) {
            this.ui.options.innerHTML += this.createQuestionOption(opt, this.question.options[opt]);
        }
    }

    // Intervallari temizlemek ucun
    clearInterval() {
        clearInterval(lineBarInterval);
        clearInterval(startTimeInterval);
    }

    // Sualin cavablarina klikledikde bas verecek hadiseler ucun
    clickOptions() {
        this.ui.options.addEventListener('click', (e) => {
            const variant = e.target.getAttribute('data-variant');
            if (variant) {
                this.clearInterval();
                this.checkVariant(variant);
            }
        })
    }

    // Secilen cavabin duzgunluyunu yoxlamaq ucun
    checkVariant(variant, system = false) {
        const el = options.querySelector(`[data-variant="${variant}"]`);
        this.ui.options.style.pointerEvents = 'none';

        if (this.index + 1 < this.questions.length) {
            this.ui.nextQuestion.classList.remove('hidden');
        }

        if (this.question.current.toString().toLowerCase() === variant.toString().toLowerCase()) {
            el.classList.add('bg-[#D4FFBA]');
            if (!system) {
                answer.success++;
            }
        }
        else {
            el.classList.add('bg-[#FFDEDE]');
            answer.error++;
            const success = options.querySelector(`[data-variant="${this.question.current}"]`);
            if (success) {
                success.classList.add('bg-[#D4FFBA]');
            }
        }

        if (this.index === this.questions.length - 1) {
            this.finish();
        }
    }

    // Bu method next butonunda event dinleyir
    nextEvent() {
        this.ui.nextQuestion.addEventListener('click', () => {
            this.next();
            this.creatQuestion();
            this.time(10);
            this.progress(0);
        });
    }

    // Novbeti suala kecit 
    next() {
        if (this.index < this.questions.length - 1) {
            this.index++;
        }

        this.ui.nextQuestion.classList.add('hidden');
        this.ui.options.style.pointerEvents = 'initial';
        this.ui.currentQuestion.innerHTML = this.index + 1;
        this.question = this.getQuestion();
    }

    // Imtahan vaxtini geri sayim ucun
    time(time) {
        this.ui.time.textContent = time;
        startTimeInterval = setInterval(timer, 1000);

        const obj = this;

        function timer() {
            time--;
            obj.ui.time.textContent = time;

            if (time < 1) {
                clearInterval(startTimeInterval);
                answer.none++;
                obj.checkVariant(obj.question.current, true);
            }
        }
    }

    // Vaxta uygun zaman barinin dolmasi ucun
    progress(width) {
        lineBarInterval = setInterval(timer, 100);
        const obj = this;

        function timer() {
            width += 1;
            obj.ui.lineBar.style.width = width + '%'

            if (width === 100) {
                clearInterval(lineBarInterval);
            }
        }
    }

    // Imtahani baslatmaq ucun 
    start() {
        this.ui.start.addEventListener('click', (e) => {
            e.target.parentElement.classList.add('hidden');
            this.ui.quiz.classList.remove('hidden');
            this.creatQuestion();
            this.time(10);
            this.progress(0);
        })
    }

    // Imtahani bitirmek ve neticeleri gostermek
    finish() {
        this.ui.quizContent.classList.add('hidden');
        this.ui.answerContent.classList.remove('hidden');
        this.ui.answerSuccess.textContent = answer.success;
        this.ui.answerError.textContent = answer.error;
        this.ui.answerNone.textContent = answer.none;
    }

    // Imtahani yeniden baslatmaq ucun
    restart() {
        this.ui.restart.addEventListener('click', () => {
            this.ui.answerContent.classList.add('hidden');
            this.ui.quizContent.classList.remove('hidden');

            this.index = 0;
            this.time(10);
            this.progress(0);
              
            answer = {
                success: 0,
                error: 0,
                none: 0
            }
            
            this.ui.options.style.pointerEvents = 'initial';
            this.creatQuestion();   
        })
    }

    // Butun eventleri isletmek ucun
    events() {
        this.start();
        this.restart();
        this.clickOptions();
        this.nextEvent();
    }
}

export default Quiz;