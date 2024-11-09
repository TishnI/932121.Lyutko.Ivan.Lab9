const calcTextElement = document.querySelector('.calc-display__text');
const calcSelectedTextElement = document.querySelector('.calc-display__selected-text');

let firstOperand = '';
let secondOperand = '';
let operation = '';

let isFloat = false;
let errorReceived = false;
let calculationIsFinish = false;

const OPERATIONS = 
{
    sum: '+',
    substract: '-',
    multiply: '*',
    division: '/',

    calc: '=',
    point: '.',
    clearAll: 'C',
    backspace: '←'
};

OPERATIONS.hasMathOperation = function(operation)
{
    if(operation == OPERATIONS.sum 
    || operation == OPERATIONS.substract
    || operation == OPERATIONS.multiply 
    || operation == OPERATIONS.division)
    {
        return operation;
    }
    return null;
};

const clearAll = () =>
{
    firstOperand = '';
    secondOperand = '';
    operation = '';
    calcTextElement.innerText = '';
    calcSelectedTextElement.innerText = '0';
    isFloat = false;
};

const calculate = () =>
{
    if(operation != '')
    {

        if(secondOperand == '')
        {
            secondOperand = firstOperand;
        }
        
        if(secondOperand == '0' && operation == OPERATIONS.division)
        {
            clearAll();
            calcSelectedTextElement.innerText = "ОШИБКА!";
            errorReceived = true;
            return;
        }

        calcSelectedTextElement.innerText = Math.round(eval(firstOperand + operation + secondOperand) * 10000000) / 10000000;
        calcTextElement.innerText = '';
        firstOperand = calcSelectedTextElement.innerText;
        isFloat = false;
        calculationIsFinish = true;
    }
};

let buttonElements = Array.from(document.querySelectorAll(".calc-button"));

buttonElements.map((button) => 
{
    button.addEventListener("click", (e) =>
    {
        let buttonValue = e.target.innerText;
        if(errorReceived)
        {
            if(buttonValue)
            {
                clearAll();
            }
            errorReceived = false; 
            return;
        }

        switch (buttonValue) 
        {
            case OPERATIONS.clearAll:
                clearAll();
                break;

            case OPERATIONS.backspace:
                let text = calcSelectedTextElement.innerText;
                if(text != '')
                {
                    if(text.length == 1)
                    {
                        if(calcTextElement.innerText != '')
                        {
                            let arr = calcTextElement.innerText.split(' ');
                            text = arr[arr.length - 1];
                            if(!isNaN(text))
                            {
                                if(text % 1 !== 0)
                                    isFloat = true;
                            }
                            arr.pop();
                            calcTextElement.innerText = arr.join(' ');
                        }
                        else
                        {
                            clearAll();
                            break;
                        }
                    }
                    else
                    {
                        if(text[text.length - 1] == OPERATIONS.point)
                        {
                            isFloat = false;
                        }
                        text = text.slice(0,-1);
                        if(OPERATIONS.hasMathOperation(text))
                        {
                            clearAll();
                            break;
                        }
                    }
                    calcSelectedTextElement.innerText = text;
                    secondOperand = '';
                    operation = '';
                }

                break;

            case OPERATIONS.hasMathOperation(buttonValue):
                if(!OPERATIONS.hasMathOperation(calcSelectedTextElement.innerText) && calcTextElement.innerText != '')
                {
                    calculate();
                    calculationIsFinish = false;
                }
                
                if(secondOperand != '')
                {
                    secondOperand = '';
                    operation = '';
                }

                if(operation == '')
                {   
                    firstOperand = calcSelectedTextElement.innerText;
                    calcTextElement.innerText = firstOperand;
                }

                operation = buttonValue;
                calcSelectedTextElement.innerText = buttonValue;
                isFloat = false;
                break;

            case OPERATIONS.calc:
                calculate();
                break;

            case OPERATIONS.point:
                if(!isFloat)
                {
                    if(OPERATIONS.hasMathOperation(calcSelectedTextElement.innerText))
                    {
                        calcTextElement.innerText += ' ' + calcSelectedTextElement.innerText;
                        calcSelectedTextElement.innerText = '';
                    }
                    calcSelectedTextElement.innerText += '.';
                    isFloat = true;
                }
                break;
                
            default:
                if(calcSelectedTextElement.innerText == '0' || calculationIsFinish)
                {
                    calcSelectedTextElement.innerText = buttonValue;
                    calculationIsFinish = false;
                }
                else
                {
                    if(OPERATIONS.hasMathOperation(calcSelectedTextElement.innerText))
                    {
                        calcTextElement.innerText += ' ' + calcSelectedTextElement.innerText;
                        calcSelectedTextElement.innerText = '';
                    }

                    calcSelectedTextElement.innerText += buttonValue;

                    if(firstOperand == '')
                    {
                        firstOperand = calcSelectedTextElement.innerText;
                    }
                    else
                    {
                        secondOperand = calcSelectedTextElement.innerText;
                    }
                }
                break;
        }
    });
});

