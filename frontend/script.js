document.getElementById('verifyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = document.getElementById('mode').value;
    const question = document.getElementById('question').value;
    const aiResponse = document.getElementById('aiResponse').value;
    
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');

    // Show loading state
    loader.style.display = 'block';
    resultSection.style.display = 'none';

    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mode, question, aiResponse }),
        });

        // For demo purposes: If the backend isn't real yet, let's simulate a response
        // In a real app, you would use: const data = await response.json();
        const data = await simulateBackendResponse(aiResponse);

        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Verification failed. Please try again.');
    } finally {
        loader.style.display = 'none';
    }
});

function displayResults(data) {
    const section = document.getElementById('resultSection');
    const badge = document.getElementById('statusBadge');
    const bar = document.getElementById('confidenceBar');
    const confText = document.getElementById('confidenceText');
    const correction = document.getElementById('correctionText');
    const sourceList = document.getElementById('sourceList');

    section.style.display = 'block';

    // Set Status
    const isHallucination = data.status === 'Possible Hallucination';
    badge.innerText = data.status;
    badge.className = `status-badge ${isHallucination ? 'status-hallucination' : 'status-verified'}`;

    // Set Confidence
    bar.style.width = `${data.confidence}%`;
    bar.style.backgroundColor = isHallucination ? 'var(--danger)' : 'var(--success)';
    confText.innerText = `${data.confidence}% Confidence`;

    // Set Text & Sources
    correction.innerText = data.correction;
    sourceList.innerHTML = data.sources.map(s => `<li><a href="#">${s}</a></li>`).join('');
}

// Mock function for Hackathon presentation if backend is not connected
async function simulateBackendResponse(text) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: text.length > 50 ? "Possible Hallucination" : "Verified",
                confidence: text.length > 50 ? 42 : 98,
                correction: "The AI claimed the 2024 Olympics were in London, but they are actually in Paris.",
                sources: ["Official Olympic Committee", "Wikipedia: 2024 Summer Olympics"]
            });
        }, 1500);
    });
}