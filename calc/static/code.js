function isNumeric(str) {
    return /^\d+(\.\d+)?$/.test(str);
}

function isDigit(str) {
    return /^\d$/.test(str);
}

function isOperation(str) {
    return /^[+\-*/]$/.test(str);
}

function tokenize(expression) {
    let tokens = [];
    let lastNumber = '';
    for (char of expression) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function getPriority(operator) {
    if (operator == '+' || operator == '-') {
        return 1;
    } else if (operator == '*' || operator == '/') {
        return 2;
    } else {
        return 0;
    }
}

function convertToRPN(expression) {
    let output = [];
    let stack = [];
    for (token of tokenize(expression)) {
        if (isNumeric(token)) {
            output.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && getPriority(stack[stack.length - 1]) >= getPriority(token)) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                output.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output.join(' ');
}

function evaluateRPN(expression) {
    let stack = [];
    let tokens = expression.split(' ');
    for (token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token == '+') {
                stack.push(operand1 + operand2);
            } else if (token == '-') {
                stack.push(operand1 - operand2);
            } else if (token == '*') {
                stack.push(operand1 * operand2);
            } else if (token == '/') {
                stack.push(operand1 / operand2);
            }
        }
    }
    return stack.pop();
}

function handleButtonClick(event) {
    let screen = document.querySelector('.screen p');
    let target = event.target;
    let value = target.textContent;

    if (target.classList.contains('digit') || target.classList.contains('bracket')) {
        screen.textContent == "0" || screen.textContent == "." ? screen.textContent = "" : console.log(111);
        screen.textContent += value;
        if (screen.textContent.length > 8) screen.textContent = screen.textContent.substring(0, 8);
    } else if (target.classList.contains('operation')) {
        let lastChar = screen.textContent.charAt(screen.textContent.length - 1);
        console.log(lastChar)
        if (!(lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/' || lastChar == '.')) {
            screen.textContent += value;
        }
    } else if (target.classList.contains('clear')) {
        screen.textContent = '';
    } else if (target.classList.contains('result')) {
        let result = evaluateRPN(convertToRPN(screen.textContent));
        screen.textContent = result.toFixed(2);
    }
}

window.onload = function () {
    let calculator = document.querySelector('.buttons');
    calculator.addEventListener('click', handleButtonClick);
}
