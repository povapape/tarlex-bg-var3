// Оптимізований серверний лічільник для Tarlex
class OptimizedTarlexCounter {
    constructor() {
        this.currentValue = 98550000;
        this.initialValue = 98550000;
        this.hourlyIncrement = 1.5;
        this.startTime = new Date('2024-01-01T00:00:00Z');
        this.counterElement = null;
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        this.counterElement = document.getElementById("counter");
        if (!this.counterElement) return;
        
        this.renderDigits();
        this.updateCounter();
        this.startAutoUpdate();
        this.isInitialized = true;
    }
    
    getCurrentTargetValue() {
        const now = new Date();
        const hoursPassed = (now - this.startTime) / (1000 * 60 * 60);
        return Math.floor(this.initialValue + (hoursPassed * this.hourlyIncrement));
    }
    
    renderDigits() {
        const valueStr = this.currentValue.toLocaleString("uk-UA").replace(/\s/g, '');
        this.counterElement.innerHTML = '';
        
        for (let i = 0; i < valueStr.length; i++) {
            const span = document.createElement('span');
            span.className = 'digit';
            span.style.display = 'inline-block';
            span.style.minWidth = '0.6em';
            span.style.textAlign = 'center';
            span.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            span.dataset.index = i;
            span.textContent = valueStr[i];
            this.counterElement.appendChild(span);
        }
    }
    
    updateToValue(newValue, animate = true) {
        if (!this.counterElement) return;
        
        const oldValueStr = this.currentValue.toLocaleString("uk-UA").replace(/\s/g, '');
        const newValueStr = newValue.toLocaleString("uk-UA").replace(/\s/g, '');
        
        // Якщо довжина змінилась, перерендерюємо повністю
        if (oldValueStr.length !== newValueStr.length) {
            this.currentValue = newValue;
            this.renderDigits();
            return;
        }
        
        const digits = this.counterElement.querySelectorAll('.digit');
        
        // Знаходимо і оновлюємо тільки змінені цифри
        for (let i = 0; i < newValueStr.length; i++) {
            if (oldValueStr[i] !== newValueStr[i] && digits[i]) {
                if (animate) {
                    // Додаємо анімацію тільки для змінених цифр
                    digits[i].style.animation = 'digitFlip 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    setTimeout(() => {
                        digits[i].textContent = newValueStr[i];
                    }, 300); // Половина анімації
                    
                    setTimeout(() => {
                        digits[i].style.animation = '';
                    }, 600); // Повна анімація
                } else {
                    digits[i].textContent = newValueStr[i];
                }
            }
        }
        
        this.currentValue = newValue;
    }
    
    updateCounter() {
        const targetValue = this.getCurrentTargetValue();
        if (targetValue !== this.currentValue) {
            this.updateToValue(targetValue);
        }
    }
    
    smoothUpdate() {
        const targetValue = this.getCurrentTargetValue();
        if (targetValue !== this.currentValue) {
            this.updateToValue(targetValue, false); // Без анімації для плавності
        }
    }
    
    startAutoUpdate() {
        // Оновлення з анімацією кожні 10 секунд
        setInterval(() => this.updateCounter(), 10000);
        
        // Плавне оновлення кожну секунду (без анімації)
        setInterval(() => this.smoothUpdate(), 1000);
    }
}

// Додаємо CSS для анімації цифр
const digitAnimationCSS = `
    @keyframes digitFlip {
        0% { 
            transform: rotateX(0deg) scale(1);
        }
        50% { 
            transform: rotateX(90deg) scale(0.8);
        }
        100% { 
            transform: rotateX(0deg) scale(1);
        }
    }
`;

// Додаємо стилі до головного документу
if (!document.querySelector('#digit-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'digit-animation-styles';
    style.textContent = digitAnimationCSS;
    document.head.appendChild(style);
}

// Запуск лічільника
document.addEventListener('DOMContentLoaded', function() {
    window.tarlexCounter = new OptimizedTarlexCounter();
});