document.addEventListener('DOMContentLoaded', function() {
    // Get form and input elements
    const form = document.getElementById('kdm-form');
    const tSaidInput = document.getElementById('t-said');
    const gammaInput = document.getElementById('gamma');
    const moodInput = document.getElementById('mood');
    const dadInput = document.getElementById('dad');
    const dressupInput = document.getElementById('dressup');
    
    // Get result elements
    const resultCard = document.getElementById('result-card');
    const resultStated = document.getElementById('result-stated');
    const resultDelay = document.getElementById('result-delay');
    const resultActual = document.getElementById('result-actual');
    const notComingWarning = document.getElementById('not-coming-warning');
    
    // Get value display elements
    const gammaValue = document.getElementById('gamma-value');
    const moodValue = document.getElementById('mood-value');
    const dadValue = document.getElementById('dad-value');
    const dressupValue = document.getElementById('dressup-value');
    const dadStatus = document.getElementById('dad-status');
    const dadIndicator = document.getElementById('dad-indicator');
    
    // Set default time to current time rounded to nearest 30 min
    const now = new Date();
    const minutes = Math.round(now.getMinutes() / 30) * 30;
    now.setMinutes(minutes);
    now.setSeconds(0);
    tSaidInput.value = now.toTimeString().slice(0, 5);
    
    // Initialize results section
    resultCard.style.display = 'none';
    notComingWarning.style.display = 'none';
    
    // Update value displays on input change
    gammaInput.addEventListener('input', function() {
        gammaValue.textContent = this.value + ' minutes';
    });
    
    moodInput.addEventListener('input', function() {
        moodValue.textContent = parseFloat(this.value).toFixed(2);
    });
    
    dadInput.addEventListener('input', function() {
        const value = parseFloat(this.value).toFixed(2);
        dadValue.textContent = value;
        
        // Update dad status text
        if (parseFloat(value) >= 0.95) {
            dadStatus.textContent = 'Dad is pissed';
            dadIndicator.className = 'dad-indicator dad-pissed';
        } else if (parseFloat(value) >= 0.5) {
            dadStatus.textContent = 'Dad is home';
            dadIndicator.className = 'dad-indicator dad-home';
        } else {
            dadStatus.textContent = 'Dad not home';
            dadIndicator.className = 'dad-indicator dad-away';
        }
    });
    
    dressupInput.addEventListener('input', function() {
        dressupValue.textContent = parseFloat(this.value).toFixed(2);
    });
    
    // Initialize dad status
    dadInput.dispatchEvent(new Event('input'));
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateArrivalTime();
    });
    
    function calculateArrivalTime() {
        // Get input values
        const tSaid = tSaidInput.value;
        const gamma = parseFloat(gammaInput.value);
        const epsilonK = parseFloat(moodInput.value);
        const alphaF = parseFloat(dadInput.value);
        const betaD = parseFloat(dressupInput.value);
        
        // Parse time
        const [hours, minutes] = tSaid.split(':').map(num => parseInt(num));
        const statedTime = new Date();
        statedTime.setHours(hours, minutes, 0);
        
        // Format stated time for display
        const statedTimeFormatted = formatTime(statedTime);
        resultStated.textContent = statedTimeFormatted;
        
        // Check if dad is pissed (alphaF = 1 or very close to 1)
        if (alphaF >= 0.95) {
            resultDelay.textContent = "∞ (infinite)";
            resultActual.textContent = "NEVER";
            resultCard.style.display = 'block';
            notComingWarning.style.display = 'block';
            
            // Scroll to results
            resultCard.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        // Calculate delay using the KDM formula
        // ΔT = γ × [(1 - εK) + f(αF) + βD²]
        const deltaT = gamma * ((1 - epsilonK) + alphaF + Math.pow(betaD, 2));
        
        // Calculate actual arrival time
        const actualTime = new Date(statedTime.getTime() + deltaT * 60000);
        
        // Format results for display
        resultDelay.textContent = deltaT.toFixed(1) + " minutes";
        resultActual.textContent = formatTime(actualTime);
        
        // Show results
        resultCard.style.display = 'block';
        notComingWarning.style.display = 'none';
        
        // Add animation class
        resultCard.classList.add('result-pop');
        setTimeout(() => {
            resultCard.classList.remove('result-pop');
        }, 500);
        
        // Scroll to results
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${formattedMinutes} ${ampm}`;
    }
    
    // Add tooltip functionality
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tip = document.createElement('div');
            tip.className = 'tooltip-content';
            tip.textContent = this.getAttribute('data-tip');
            this.appendChild(tip);
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tip = this.querySelector('.tooltip-content');
            if (tip) {
                this.removeChild(tip);
            }
        });
    });
});