// Calculate the HCF (Highest Common Factor/GCD) of two numbers using Euclidean algorithm
function calculateHCFTwoNumbers(a, b) {
    const steps = [];
    let originalA = a, originalB = b;
    
    steps.push(`Calculate HCF(${originalA}, ${originalB})`);
    
    while (b !== 0) {
        const quotient = Math.floor(a / b);
        const remainder = a % b;
        steps.push(`${a} = ${b} × ${quotient} + ${remainder}`);
        a = b;
        b = remainder;
    }
    
    steps.push(`Therefore HCF(${originalA}, ${originalB}) = ${a}`);
    
    return {
        result: a,
        steps: steps
    };
}

// Calculate the HCF (Highest Common Factor/GCD) of multiple numbers
function calculateHCF(numbers) {
    if (numbers.length < 2) {
        throw new Error('At least two numbers are required');
    }
    
    const steps = [];
    steps.push(`Calculate HCF(${numbers.join(', ')})`);
    
    let result = numbers[0];
    let currentSteps = [];
    
    for (let i = 1; i < numbers.length; i++) {
        const twoNumberResult = calculateHCFTwoNumbers(result, numbers[i]);
        steps.push(`Step ${i}: HCF(${result}, ${numbers[i]})`);
        steps.push(...twoNumberResult.steps.slice(1)); // Skip the first title line
        result = twoNumberResult.result;
    }
    
    steps.push(`Final result: HCF(${numbers.join(', ')}) = ${result}`);
    
    return {
        result: result,
        steps: steps
    };
}

// Calculate the LCM (Least Common Multiple) of two numbers
function calculateLCMTwoNumbers(a, b) {
    const hcf = calculateHCFTwoNumbers(a, b).result;
    const lcm = (a * b) / hcf;
    
    return {
        result: lcm,
        hcf: hcf
    };
}

// Calculate the LCM (Least Common Multiple) of multiple numbers
function calculateLCM(numbers) {
    if (numbers.length < 2) {
        throw new Error('At least two numbers are required');
    }
    
    const steps = [];
    steps.push(`Calculate LCM(${numbers.join(', ')})`);
    steps.push(`Using formula: LCM(a,b) = (a × b) ÷ HCF(a,b)`);
    steps.push(`For multiple numbers: LCM(a,b,c) = LCM(LCM(a,b), c)`);
    
    let result = numbers[0];
    
    for (let i = 1; i < numbers.length; i++) {
        const twoNumberResult = calculateLCMTwoNumbers(result, numbers[i]);
        steps.push(`Step ${i}: LCM(${result}, ${numbers[i]})`);
        steps.push(`HCF(${result}, ${numbers[i]}) = ${twoNumberResult.hcf}`);
        steps.push(`LCM(${result}, ${numbers[i]}) = (${result} × ${numbers[i]}) ÷ ${twoNumberResult.hcf} = ${result * numbers[i]} ÷ ${twoNumberResult.hcf} = ${twoNumberResult.result}`);
        result = twoNumberResult.result;
    }
    
    steps.push(`Final result: LCM(${numbers.join(', ')}) = ${result}`);
    
    return {
        result: result,
        steps: steps
    };
}

// Validate input
function validateInputs(inputStr) {
    const errors = [];
    
    if (!inputStr || inputStr.trim() === '') {
        errors.push('Please enter numbers');
        return errors;
    }
    
    // Split and clean input
    const parts = inputStr.split(',').map(part => part.trim());
    
    if (parts.length < 2) {
        errors.push('At least 2 numbers are required');
        return errors;
    }
    
    if (parts.length > 10) {
        errors.push('Maximum 10 numbers supported');
        return errors;
    }
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (part === '') {
            errors.push(`Position ${i + 1} is empty`);
            continue;
        }
        
        const num = Number(part);
        
        if (isNaN(num)) {
            errors.push(`"${part}" is not a valid number`);
        } else if (num <= 0) {
            errors.push(`"${part}" must be a positive number`);
        } else if (!Number.isInteger(num)) {
            errors.push(`"${part}" must be an integer`);
        } else if (num > 1000000) {
            errors.push(`"${part}" is too large, please enter a number less than 1,000,000`);
        }
    }
    
    return errors;
}

// Parse input numbers
function parseNumbers(inputStr) {
    return inputStr.split(',')
        .map(part => part.trim())
        .filter(part => part !== '')
        .map(part => parseInt(part))
        .filter(num => !isNaN(num));
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    errorElement.classList.add('show');
}

// Hide error message
function hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.classList.remove('show');
    errorElement.classList.add('hidden');
}

// Display calculation steps
function displaySteps(steps, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.textContent = `${index + 1}. ${step}`;
        element.appendChild(stepDiv);
    });
}

// Main calculation function
function calculate() {
    hideError();
    
    const inputStr = document.getElementById('numbers').value;
    
    // Validate input
    const errors = validateInputs(inputStr);
    if (errors.length > 0) {
        showError(errors.join('; '));
        return;
    }
    
    const numbers = parseNumbers(inputStr);
    
    try {
        // Calculate HCF
        const hcfResult = calculateHCF(numbers);
        document.getElementById('hcfResult').textContent = hcfResult.result;
        displaySteps(hcfResult.steps, 'hcfSteps');
        
        // Calculate LCM
        const lcmResult = calculateLCM(numbers);
        document.getElementById('lcmResult').textContent = lcmResult.result;
        displaySteps(lcmResult.steps, 'lcmSteps');
        
        // Add animation effects
        document.querySelectorAll('.result-card').forEach(card => {
            card.classList.add('calculated');
        });
        
        // Display the input numbers
        displayInputNumbers(numbers);
        
    } catch (error) {
        showError('Error during calculation: ' + error.message);
        console.error('Calculation error:', error);
    }
}

// Display input numbers
function displayInputNumbers(numbers) {
    const inputDisplay = document.getElementById('inputDisplay');
    if (inputDisplay) {
        inputDisplay.textContent = `Input numbers: ${numbers.join(', ')}`;
    }
}

// Clear inputs and results
function clearInputs() {
    document.getElementById('numbers').value = '';
    document.getElementById('hcfResult').textContent = '-';
    document.getElementById('lcmResult').textContent = '-';
    document.getElementById('hcfSteps').innerHTML = '';
    document.getElementById('lcmSteps').innerHTML = '';
    
    const inputDisplay = document.getElementById('inputDisplay');
    if (inputDisplay) {
        inputDisplay.textContent = '';
    }
    
    hideError();
    
    // Remove animation effects
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.remove('calculated');
    });
}

// Add keyboard event listeners
document.addEventListener('DOMContentLoaded', function() {
    const numbersInput = document.getElementById('numbers');
    
    // Enter key triggers calculation
    numbersInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculate();
        }
    });
    
    // Auto-hide error message when typing
    numbersInput.addEventListener('input', hideError);
    
    // Add input hints
    numbersInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.placeholder = 'Example: 12, 18, 24, 36';
        }
    });
    
    numbersInput.addEventListener('blur', function() {
        this.placeholder = 'Enter positive integers separated by commas, e.g., 12, 18, 24';
    });
});
