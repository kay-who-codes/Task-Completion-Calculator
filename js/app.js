document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Helper function to parse time input (e.g., "1h 30m" to seconds)
    function parseTimeToSeconds(timeStr) {
        if (!timeStr) return 0;
        
        const timeParts = timeStr.trim().split(/\s+/);
        let totalSeconds = 0;
        
        timeParts.forEach(part => {
            const unit = part.slice(-1);
            const value = parseFloat(part.slice(0, -1));
            
            switch (unit) {
                case 'h': totalSeconds += value * 3600; break;
                case 'm': totalSeconds += value * 60; break;
                case 's': totalSeconds += value; break;
                default: totalSeconds += parseFloat(part) || 0;
            }
        });
        
        return totalSeconds;
    }

    // Helper function to format seconds to readable time
    function formatSeconds(seconds) {
        if (isNaN(seconds)) return "--";
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        let parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        
        return parts.join(' ');
    }

    // Calculator 1: Completion Count
    const completionCountInputs = ['total-time', 'task-time-cc', 'deviation-cc'];
    completionCountInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateCompletionCount);
    });

    function calculateCompletionCount() {
    const totalTime = parseTimeToSeconds(document.getElementById('total-time').value);
    const taskTime = parseTimeToSeconds(document.getElementById('task-time-cc').value);
    const deviation = parseTimeToSeconds(document.getElementById('deviation-cc').value);
    
    if (totalTime <= 0 || taskTime <= 0) return;
    
    const lowerTime = Math.max(1, taskTime - deviation);
    const higherTime = taskTime + deviation;
    
    const expected = totalTime / taskTime;
    const lower = totalTime / higherTime;  // Changed from lowerTime to higherTime
    const higher = totalTime / lowerTime;  // Changed from higherTime to lowerTime
    
    document.getElementById('expected-cc').textContent = Math.floor(expected);
    document.getElementById('lower-cc').textContent = Math.floor(lower);
    document.getElementById('higher-cc').textContent = Math.floor(higher);
}

    // Calculator 2: Time Until Completion
    const timeUntilCompletionInputs = ['task-count', 'task-time-tuc', 'deviation-tuc'];
    timeUntilCompletionInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTimeUntilCompletion);
    });

    function calculateTimeUntilCompletion() {
        const taskCount = parseFloat(document.getElementById('task-count').value);
        const taskTime = parseTimeToSeconds(document.getElementById('task-time-tuc').value);
        const deviation = parseTimeToSeconds(document.getElementById('deviation-tuc').value);
        
        if (taskCount <= 0 || taskTime <= 0) return;
        
        const lowerTime = Math.max(1, taskTime - deviation);
        const higherTime = taskTime + deviation;
        
        const expected = taskCount * taskTime;
        const lower = taskCount * lowerTime;
        const higher = taskCount * higherTime;
        
        document.getElementById('expected-tuc').textContent = formatSeconds(expected);
        document.getElementById('lower-tuc').textContent = formatSeconds(lower);
        document.getElementById('higher-tuc').textContent = formatSeconds(higher);
    }
});
