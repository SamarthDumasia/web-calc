document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');
    let rect = calculator.getBoundingClientRect();
    const maxTilt = 10; // Maximum tilt angle

    function updateTilt(e) {
        rect = calculator.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate tilt based on cursor position
        const tiltX = ((y - rect.height / 2) / rect.height) * maxTilt;
        const tiltY = ((rect.width / 2 - x) / rect.width) * maxTilt;
        
        // Apply the tilt effect
        calculator.style.setProperty('--tilt-x', `${tiltX}deg`);
        calculator.style.setProperty('--tilt-y', `${tiltY}deg`);
        calculator.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    function resetTilt() {
        calculator.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }

    // Add event listeners
    calculator.addEventListener('mousemove', updateTilt);
    calculator.addEventListener('mouseleave', resetTilt);
    calculator.addEventListener('mouseenter', (e) => {
        calculator.classList.add('is-tilting');
        updateTilt(e);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const expressionDisplay = document.getElementById('expression');
    const historyDisplay = document.getElementById('history');
    const buttons = document.querySelectorAll('button');
    
    let currentNumber = '';
    let previousNumber = '';
    let operation = null;
    let shouldResetScreen = false;
    let expressionHistory = [];    function updateDisplay() {
        let expression = '';
        if (previousNumber !== '' && operation) {
            expression = `${previousNumber} <span class="operator-text">${operation}</span>`;
            if (currentNumber !== '') {
                expression += ` ${currentNumber}`;
            }
        } else if (currentNumber !== '') {
            expression = currentNumber;
        } else {
            expression = '0';
        }
        expressionDisplay.innerHTML = expression;
    }

    function addToHistory(expression, result) {
        expressionHistory.push(`${expression} <span class="operator-text">=</span> <span class="result-text">${result}</span>`);
        historyDisplay.innerHTML = expressionHistory[expressionHistory.length - 1] || '';
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                handleNumber(button.textContent);
            } else if (button.classList.contains('operator')) {
                handleOperator(button.textContent);
            } else if (button.classList.contains('equals')) {
                handleEquals();
            } else if (button.classList.contains('decimal')) {
                handleDecimal();
            } else if (button.classList.contains('clear')) {
                clearCalculator();
            }
        });
    });

    function handleNumber(number) {
        if (shouldResetScreen) {
            currentNumber = number;
            shouldResetScreen = false;
        } else {
            currentNumber = currentNumber === '0' ? number : currentNumber + number;
        }
        updateDisplay();
    }    function handleOperator(op) {
        if (operation !== null) handleEquals();
        previousNumber = currentNumber;
        currentNumber = '';
        operation = op;
        shouldResetScreen = true;
        updateDisplay();
    }

    function handleEquals() {
        if (operation === null || shouldResetScreen) return;
        
        let computation = 0;
        const prev = parseFloat(previousNumber);
        const current = parseFloat(currentNumber);
        const currentExpression = expressionDisplay.innerHTML;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            case '±':
                computation = -current;
                break;
            default:
                return;
        }

        addToHistory(currentExpression, computation);
        currentNumber = computation.toString();
        previousNumber = '';
        operation = null;
        shouldResetScreen = true;
        updateDisplay();
    }

    function handleDecimal() {
        if (shouldResetScreen) {
            currentNumber = '0.';
            shouldResetScreen = false;
        } else if (!currentNumber.includes('.')) {
            currentNumber += '.';
        }
        updateDisplay();
    }

    function clearCalculator() {
        currentNumber = '';
        previousNumber = '';
        operation = null;
        expressionHistory = [];
        historyDisplay.innerHTML = '';
        updateDisplay();
    }

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            handleNumber(event.key);
        } else if (event.key === '.') {
            handleDecimal();
        } else if (event.key === '+' || event.key === '-') {
            handleOperator(event.key);
        } else if (event.key === '*') {
            handleOperator('×');
        } else if (event.key === '/') {
            handleOperator('÷');
        } else if (event.key === 'Enter' || event.key === '=') {
            handleEquals();
        } else if (event.key === 'Escape') {
            clearCalculator();
        }
    });
});