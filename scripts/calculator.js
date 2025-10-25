class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewInput = false;
        this.memory = 0;
        this.calculationHistory = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
       
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.inputNumber(button.getAttribute('data-value'));
            });
        });
        
        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.inputOperator(button.getAttribute('data-action'));
            });
        });
        
        document.querySelectorAll('.btn.function').forEach(button => {
            button.addEventListener('click', () => {
                this.inputFunction(button.getAttribute('data-action'));
            });
        });
        
        document.querySelectorAll('.btn.memory').forEach(button => {
            button.addEventListener('click', () => {
                this.inputMemory(button.getAttribute('data-action'));
            });
        });
        
        document.querySelector('.btn.equals').addEventListener('click', () => {
            this.calculate();
        });
        
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
        
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }
    
    inputNumber(number) {
        if (this.waitingForNewInput) {
            this.currentInput = number;
            this.waitingForNewInput = false;
        } else {
            this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
        }
        this.updateDisplay();
    }
    
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation();
            this.currentInput = String(result);
            this.previousInput = result;
        }
        
        this.waitingForNewInput = true;
        this.operator = nextOperator;
        this.updateHistoryDisplay();
    }
    
    inputFunction(func) {
        switch (func) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'percentage':
                this.percentage();
                break;
            case 'square':
                this.square();
                break;
            case 'sqrt':
                this.squareRoot();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
        }
    }
    
    inputMemory(memoryAction) {
        const currentValue = parseFloat(this.currentInput);
        
        switch (memoryAction) {
            case 'm-plus':
                this.memory += currentValue;
                break;
            case 'm-minus':
                this.memory -= currentValue;
                break;
            case 'mr':
                this.currentInput = String(this.memory);
                this.waitingForNewInput = true;
                break;
            case 'mc':
                this.memory = 0;
                break;
        }
        
        this.updateDisplay();
    }
    
    calculate() {
        if (this.operator && this.previousInput !== '') {
            const result = this.performCalculation();
            
            this.addToHistory(`${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${this.currentInput} = ${result}`);
            
            this.currentInput = String(result);
            this.previousInput = '';
            this.operator = null;
            this.waitingForNewInput = true;
            this.updateDisplay();
        }
    }
    
    performCalculation() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return 0;
        
        switch (this.operator) {
            case 'add': return prev + current;
            case 'subtract': return prev - current;
            case 'multiply': return prev * current;
            case 'divide': return current !== 0 ? prev / current : 'Error';
            default: return current;
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewInput = false;
        this.updateDisplay();
        this.updateHistoryDisplay();
    }
    
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    percentage() {
        this.currentInput = String(parseFloat(this.currentInput) / 100);
        this.updateDisplay();
    }
    
    square() {
        const value = parseFloat(this.currentInput);
        this.addToHistory(`sqr(${value}) = ${value * value}`);
        this.currentInput = String(value * value);
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    squareRoot() {
        const value = parseFloat(this.currentInput);
        if (value >= 0) {
            this.addToHistory(`√(${value}) = ${Math.sqrt(value)}`);
            this.currentInput = String(Math.sqrt(value));
        } else {
            this.currentInput = 'Error';
        }
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForNewInput) {
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.display.textContent = this.currentInput;
        this.display.classList.add('display-update');
        setTimeout(() => {
            this.display.classList.remove('display-update');
        }, 300);
    }
    
    updateHistoryDisplay() {
        if (this.operator && this.previousInput !== '') {
            this.historyDisplay.textContent = `${this.previousInput} ${this.getOperatorSymbol(this.operator)}`;
        } else {
            this.historyDisplay.textContent = '';
        }
    }
    
    getOperatorSymbol(operator) {
        switch (operator) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    addToHistory(calculation) {
        this.calculationHistory.unshift(calculation);
        if (this.calculationHistory.length > 10) {
            this.calculationHistory.pop();
        }
        this.updateHistoryList();
    }
    
    updateHistoryList() {
        this.historyList.innerHTML = '';
        this.calculationHistory.forEach(calc => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = calc;
            this.historyList.appendChild(historyItem);
        });
    }
    
    clearHistory() {
        this.calculationHistory = [];
        this.updateHistoryList();
    }
    
    handleKeyboardInput(event) {
        if (event.key >= '0' && event.key <= '9') {
            this.inputNumber(event.key);
        } else if (event.key === '.') {
            this.inputDecimal();
        } else if (event.key === '+') {
            this.inputOperator('add');
        } else if (event.key === '-') {
            this.inputOperator('subtract');
        } else if (event.key === '*') {
            this.inputOperator('multiply');
        } else if (event.key === '/') {
            event.preventDefault();
            this.inputOperator('divide');
        } else if (event.key === 'Enter' || event.key === '=') {
            this.calculate();
        } else if (event.key === 'Escape' || event.key === 'Delete') {
            this.clear();
        } else if (event.key === 'Backspace') {
            this.backspace();
        } else if (event.key === '%') {
            this.percentage();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});