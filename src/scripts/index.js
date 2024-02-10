document.addEventListener("DOMContentLoaded", ready);

function ready() {
    /* mouse movement - changing background-position-x */
    const moveBg = document.querySelector('.move-bg');
    const handlerMove = (e) => {
        const header = document.querySelector('.header');
        const {y: headerY, height: headerHeight} = header.getBoundingClientRect();
        const headerBottomY = headerY + headerHeight;
        if (e.clientY < headerBottomY) {
            return;
        }
        const centerBody = moveBg.getBoundingClientRect().width / 2;
        const DEFAULT_POSITION = 50;
        const offset = e.clientX - centerBody;
        const newPosition = offset * DEFAULT_POSITION / centerBody + DEFAULT_POSITION;
        moveBg.setAttribute("style", `background-position-x: ${newPosition}%`)
    }
    moveBg.addEventListener('mousemove', throttle(handlerMove, 110));
    moveBg.addEventListener('pointermove', throttle(handlerMove, 110));

    /* fullscreenPopup */
    const fullscreenPopup = document.querySelector('.full-screen-popup');
    const btnBuyTicket = document.querySelector('.header__btn');
    const btnClosed = document.querySelector('.buy-tickets__closed');

    btnBuyTicket.addEventListener('click', () => {
        fullscreenPopup.classList.add('full-screen-popup--active');
    })

    btnClosed.addEventListener('click', () => {
        fullscreenPopup.classList.remove('full-screen-popup--active');
    })

    /* js-datapicker */
    setOrResetDatePicker();

    /* for animation */
    setTimeout(() => {
        document.body.classList.add('site-open-animation');
    }, 700);

    /* nav mobile */
    const burger = document.querySelector('.nav__burger-wrap');
    const navMobile = document.querySelector('.full-screen-nav-mobile');
    const btnClosedNav = document.querySelector('.nav-mobile__closed');

    burger.addEventListener('click', () => {
        navMobile.classList.add('full-screen-nav-mobile--active');
    })

    btnClosedNav.addEventListener('click', () => {
        navMobile.classList.remove('full-screen-nav-mobile--active');
    })

    /* form */
    addHandlerInputChange();
    addHandlerFormSubmit();

}

const throttle = (fn, throttleTime) => {
    let start = -Infinity;
    let cachedResult;
    return function () {
        const end = Date.now();
        if (end - start >= throttleTime) {
            start = end;
            cachedResult = fn.apply(this, arguments);
        }
        return cachedResult;
    };
}

let startDatePicker = null;
let endDatePicker = null;

function setOrResetDatePicker() {
    if (startDatePicker && endDatePicker) {
        startDatePicker.remove();
        startDatePicker = null;
        endDatePicker.remove();
        endDatePicker = null;
    }
    const options = {
        id: 1,
        formatter: (input, date) => {
            input.value = date.toLocaleDateString();
        },
        customDays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        onSelect: ({ el }) => resetErrorMessage(el)
    }

    startDatePicker = datepicker('.buy-tickets-range[name="date-from"]', options);
    endDatePicker = datepicker('.buy-tickets-range[name="date-to"]', options);
}


function addHandlerInputChange() {
    const form = document.querySelector('.form-booking');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            resetErrorMessage(input);

            const errorCode = validateInput(input);

            if (errorCode) {
                showErrorMessage(input, errorCode);
            }
        })
    })
}

// data-max=50 - реализовать
function addHandlerFormSubmit() {
    const form = document.querySelector('.form-booking');

    form.addEventListener('submit', e => {
        e.preventDefault();
        resetAllErrorMessage(form);

        let isValid = validateFormAndShowErrorIfNeeded(form);

        if (!isValid) {
            return;
        }
        const formBookingSaving = 'form-booking--saving';
        form.classList.add(formBookingSaving);
        fakeSaveData().then(() => {
            form.classList.remove(formBookingSaving);
            showSuccessMessage(form);
        })
    })
}

function fakeSaveData() {
    // имитация отправки на сервер
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

function validateFormAndShowErrorIfNeeded(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        const errorCode = validateInput(input);
        if (errorCode) {
            showErrorMessage(input, errorCode);
            isValid = false;
        }
    })
    return isValid;
}

function showSuccessMessage(form) {
    const formData = new FormData(form);

    const baseFormClassName = 'form-booking';
    const fadeFormClassName = `${baseFormClassName}--fade`;
    const hiddenFormClassName = `${baseFormClassName}--hidden`;

    // скрываем форму
    form.classList.add(fadeFormClassName);
    form.addEventListener('transitionend', () => {
        form.classList.add(hiddenFormClassName);
        // добавляем данные в блок success
        const parent = form.closest('.buy-tickets__screen');
        const successElement = parent.querySelector('.buy-tickets__success');
        [...formData.keys()].forEach(name => {
            const element = successElement.querySelector(`.buy-tickets__success-value--${name}`);
            element.innerText = formData.get(name);
        })
        // сбрасываем форму
        form.reset();

        // datepicker
        setOrResetDatePicker();

        // показываем блок success
        const buyTicketsSuccess = 'buy-tickets__success';
        const showBuyTicketsSuccess = `${buyTicketsSuccess}--show`;
        const appearBuyTicketsSuccess = `${buyTicketsSuccess}--appear`;

        successElement.classList.add(showBuyTicketsSuccess);
        setTimeout(() => successElement.classList.add(appearBuyTicketsSuccess));
        // через 5 сек. скрываем блок success и показываем форму
        setTimeout(() => {
            successElement.classList.remove(appearBuyTicketsSuccess);
            successElement.addEventListener('transitionend', () => {
                successElement.classList.remove(showBuyTicketsSuccess);
                form.classList.remove(hiddenFormClassName);
                setTimeout(() => form.classList.remove(fadeFormClassName));
            }, { once: true });
        }, 5000);
    }, { once: true });
}

function resetAllErrorMessage(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => resetErrorMessage(input));
}

function resetErrorMessage(input) {
    input.classList.remove('form-booking__input--invalid');
    const parent = input.closest('.form-booking__input-wrap');
    const errorMessageElement = parent.querySelector('.form-booking__error-message');
    if (errorMessageElement) {
        errorMessageElement.remove();
    }
}

function createErrorMessageElement(message) {
    const errorMessageElement = document.createElement('div');
    errorMessageElement.classList.add('form-booking__error-message');
    errorMessageElement.innerText = message;
    return errorMessageElement;
}

const errorValidateMessages = {
    required: 'Заполните поле, пожалуйста',
    typeNumber: 'Поле может содержать только цифры',
    typeDate: 'Выберите дату из календаря',
}

function showErrorMessage(input, errorCode) {
    const message = errorValidateMessages[errorCode];
    input.classList.add('form-booking__input--invalid');
    const parent = input.closest('.form-booking__input-wrap');
    parent.append(createErrorMessageElement(message))
}

function validateInput(input) {
    const isRequired = Boolean(input.getAttribute('required'));
    const type = input.dataset.type;
    const value = input.value;
    return validateValue(value, isRequired, type);
}

function validateValue(value, isRequired, type) {
    if (isRequired && !value) {
        return 'required';
    }
    if (type === 'number') {
        const isPositiveInteger = /^\d*$/.test(value.trim());
        if (!isPositiveInteger) {
            return 'typeNumber'
        }
    }
}

/* play/pause video onclick*/

// const myVideo = document.getElementById("video");
// myVideo.addEventListener('click', function(e){
//     e.preventDefault();
//     // this[this.paused ? 'play' : 'pause']();
//
//     if (this.paused) {
//         this.play();
//     } else {
//         this.pause();
//     }
// });
