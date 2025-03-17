class StatisticsManager {
    constructor() {
        // Setup canvases
        this.longCanvas = document.getElementById('phase-diagram');
        this.shortCanvas = document.getElementById('frequency-spectrum');
        this.longCtx = this.longCanvas.getContext('2d');
        this.shortCtx = this.shortCanvas.getContext('2d');
        
        // Data storage
        this.orderParameterHistory = [];
        this.DEFAULT_LONG_HISTORY = 5000;  // Store default value
        this.maxLongHistory = this.DEFAULT_LONG_HISTORY;
        this.maxShortHistory = 500;

        // Initialize both plots
        this.initPlot(this.longCtx, this.longCanvas, 'Long-term Order Parameter');
        this.initPlot(this.shortCtx, this.shortCanvas, 'Recent Order Parameter');
    }

    initPlot(ctx, canvas, title) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Draw title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(title, width/2, 5);

        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Vertical axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        // Horizontal axis (time)
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Add labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, height/2);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = 'center';
        ctx.fillText('Synchronization (r)', 0, 0);
        ctx.restore();
        
        // X-axis label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Time (ms)', width/2, height - padding + 25);

        // Y-axis values
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', padding - 5, height - padding);
        ctx.fillText('1', padding - 5, padding);
        
        // Draw ticks
        ctx.beginPath();
        ctx.moveTo(padding - 3, height - padding);
        ctx.lineTo(padding + 3, height - padding);
        ctx.moveTo(padding - 3, padding);
        ctx.lineTo(padding + 3, padding);
        ctx.stroke();

        // Draw grid line at 0.5
        ctx.strokeStyle = '#eee';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(padding, height - padding - (height - 2 * padding) * 0.5);
        ctx.lineTo(width - padding, height - padding - (height - 2 * padding) * 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    computeOrderParameter(pipes, currentTime) {
        // Compute phases for each pipe
        const phases = pipes.map(pipe => {
            const phase = 2 * Math.PI * (currentTime / pipe.period);
            return {
                real: Math.cos(phase),
                imag: Math.sin(phase)
            };
        });

        // Compute mean of complex exponentials
        const sum = phases.reduce((acc, val) => ({
            real: acc.real + val.real,
            imag: acc.imag + val.imag
        }), { real: 0, imag: 0 });

        const N = pipes.length;
        const meanReal = sum.real / N;
        const meanImag = sum.imag / N;

        // Compute absolute value (magnitude)
        const orderParameter = Math.sqrt(meanReal * meanReal + meanImag * meanImag);

        // Store in history
        this.orderParameterHistory.push(orderParameter);
        if (this.orderParameterHistory.length > this.maxHistoryLength) {
            this.orderParameterHistory.shift();
        }

        return orderParameter;
    }

    drawPhaseDiagrams() {
        // Draw long history - use sliding window like the short history
        const longHistory = this.orderParameterHistory.slice(-this.maxLongHistory);
        this.drawPhaseDiagram(
            this.longCtx,
            this.longCanvas,
            longHistory,
            this.maxLongHistory,
            'Long-term Order Parameter'
        );

        // Draw short history (last 500 points)
        const recentHistory = this.orderParameterHistory.slice(-this.maxShortHistory);
        this.drawPhaseDiagram(
            this.shortCtx,
            this.shortCanvas,
            recentHistory,
            this.maxShortHistory,
            'Recent Order Parameter'
        );
    }

    drawPhaseDiagram(ctx, canvas, data, maxPoints, title) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Draw title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(title, width/2, 5);

        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Vertical axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        // Horizontal axis (time)
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Add labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, height/2);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = 'center';
        ctx.fillText('Synchronization (r)', 0, 0);
        ctx.restore();
        
        // X-axis label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Time (ms)', width/2, height - padding + 25);

        // Y-axis values
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', padding - 5, height - padding);
        ctx.fillText('1', padding - 5, padding);
        
        // Draw ticks
        ctx.beginPath();
        ctx.moveTo(padding - 3, height - padding);
        ctx.lineTo(padding + 3, height - padding);
        ctx.moveTo(padding - 3, padding);
        ctx.lineTo(padding + 3, padding);
        ctx.stroke();

        // Draw grid lines at 0.5 and 1.0
        ctx.strokeStyle = '#eee';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        // Grid line at 0.5
        ctx.moveTo(padding, height - padding - (height - 2 * padding) * 0.5);
        ctx.lineTo(width - padding, height - padding - (height - 2 * padding) * 0.5);
        // Grid line at 1.0
        ctx.moveTo(padding, padding);
        ctx.lineTo(width - padding, padding);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw data
        if (data.length > 0) {
            ctx.strokeStyle = '#2980b9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const plotHeight = height - 2 * padding;
            const plotWidth = width - 2 * padding;
            
            data.forEach((value, index) => {
                const x = padding + (index / (maxPoints - 1)) * plotWidth;
                const y = height - padding - value * plotHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Add star for full synchronization (when value is very close to 1)
                if (Math.abs(value - 1.0) < 0.001) {
                    // Save current path
                    ctx.stroke();
                    
                    // Draw star
                    ctx.fillStyle = '#e74c3c';  // Red color for the star
                    ctx.beginPath();
                    const starSize = 8;
                    this.drawStar(ctx, x, y, 5, starSize, starSize/2);
                    ctx.fill();
                    
                    // Add "Full Sync" label
                    ctx.fillStyle = '#000';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText('Full Sync', x + 10, y - 5);
                    
                    // Resume line drawing
                    ctx.beginPath();
                    ctx.strokeStyle = '#2980b9';
                    ctx.moveTo(x, y);
                }
            });
            
            ctx.stroke();
        }
    }

    // Helper method to draw a star
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for(let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    update(pipes, currentTime) {
        const orderParameter = this.computeOrderParameter(pipes, currentTime);
        this.drawPhaseDiagrams();
        return {
            orderParameter
        };
    }

    clear() {
        // Clear the data storage
        this.orderParameterHistory = [];
        
        // Reinitialize both plots
        this.initPlot(this.longCtx, this.longCanvas, 'Long-term Order Parameter');
        this.initPlot(this.shortCtx, this.shortCanvas, 'Recent Order Parameter');
    }

    /**
     * Converts a decimal number to a fraction with the specified precision
     * @param {number} decimal - The decimal number to convert
     * @param {number} precision - The precision for determining when two numbers are equal
     * @returns {object} An object containing numerator and denominator
     */
    decimalToFraction(decimal, precision = 0.000001) {
        if (decimal == parseInt(decimal)) {
            return {
                numerator: decimal,
                denominator: 1
            };
        }

        let h1 = 1;
        let h2 = 0;
        let k1 = 0;
        let k2 = 1;
        let b = decimal;

        do {
            let a = Math.floor(b);
            let aux = h1;
            h1 = a * h1 + h2;
            h2 = aux;
            aux = k1;
            k1 = a * k1 + k2;
            k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * precision);

        return {
            numerator: h1,
            denominator: k1
        };
    }

    /**
     * Compute the Greatest Common Divisor (GCD) of two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The GCD of a and b
     */
    gcd(a, b) {
        while (b) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Compute the Least Common Multiple (LCM) of two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The LCM of a and b
     */
    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    /**
     * Compute the LCM of a series of numbers with a given increment
     * @param {number} start - Starting number of the series
     * @param {number} steps - Number of steps in the series
     * @param {number} increment - The increment between consecutive numbers
     * @returns {number} The LCM of all numbers in the series
     */
    computeSeriesLCM(start, steps, increment = 1) {
        if (steps < 1) {
            return start;
        }
        
        let result = start;
        for (let i = 1; i < steps; i++) {
            const nextNum = start + (i * increment);
            result = this.lcm(result, nextNum);
        }
        return result;
    }

    /**
     * Predicts the system restart time for uniform period arrangement
     * @param {number} numPipes - Number of pipes
     * @param {number} minPeriod - Minimum period in ms
     * @param {number} maxPeriod - Maximum period in ms
     * @returns {number} System restart time in ms, or null if not uniform arrangement
     */
    predictSystemRestart(numPipes, minPeriod, maxPeriod) {
        // Only works for uniform arrangement
        const k = numPipes - 1;
        if (k < 1) return null;

        const Tmin = minPeriod;
        const Tmax = maxPeriod;
        const deltaT = Tmax - Tmin;
        const Bk = k * Tmin;

        // Generate the series: Bk, Bk + deltaT, Bk + 2deltaT, ..., Bk + kdeltaT
        // Using our existing computeSeriesLCM function
        const lcmResult = this.computeSeriesLCM(Bk, k + 1, deltaT);
        
        // Return (1/k) * LCM
        return lcmResult / k;
    }

    // Add method to adjust history length
    adjustHistoryLength(systemRestartTime, dt) {
        if (systemRestartTime !== null) {
            // Set history length to cover at least two full cycles
            this.maxLongHistory = Math.ceil(systemRestartTime * 1.2 / dt);
        } else {
            this.maxLongHistory = this.DEFAULT_LONG_HISTORY;
        }

        // Trim history if needed
        if (this.orderParameterHistory.length > this.maxLongHistory) {
            this.orderParameterHistory = this.orderParameterHistory.slice(-this.maxLongHistory);
        }
    }
}

/**
 * Formats time in milliseconds to a human readable string
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
    // Convert ms to years (ms -> s -> min -> hours -> days -> years)
    const years = ms / (1000 * 60 * 60 * 24 * 365);
    
    // If more than 14 million years
    if (years > 14_000_000) {
        const yearsFormatted = years.toExponential(3).replace('e+', 'e');
        return `${yearsFormatted}y ⚠️ (> age of universe!)`;
    }

    const msRemaining = ms % 1000;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const yearsNormal = Math.floor(days / 365);

    const parts = [];

    if (yearsNormal > 0) {
        parts.push(`${yearsNormal}y`);
        // Only show remaining days if there are years
        const remainingDays = days % 365;
        if (remainingDays > 0) parts.push(`${remainingDays}d`);
    } else if (days > 0) {
        parts.push(`${days}d`);
    }
    
    if (hours % 24 > 0) parts.push(`${hours % 24}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    parts.push(`${seconds % 60}s`);
    parts.push(`${msRemaining.toString().padStart(3, '0')}ms`);

    return parts.join(' ');
} 