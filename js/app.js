// ============================================
// Main Application Logic - Shape IQ Test
// ============================================

let currentPuzzle = null;
let currentDifficulty = null;

// ============================================
// UI Control Functions
// ============================================

function startQuiz(difficulty) {
    currentDifficulty = difficulty;

    // Hide difficulty selection and show puzzle interface
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('puzzleInterface').style.display = 'block';

    // Update difficulty text
    const difficultyNames = {
        'easy': '초급',
        'medium': '중급',
        'hard': '고급'
    };
    document.getElementById('currentDiffText').textContent = difficultyNames[difficulty];

    // Generate and display first puzzle
    generateNewPuzzle();
}

function backToSelection() {
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('puzzleInterface').style.display = 'none';

    // Reset feedback and controls
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextPuzzleBtn').style.display = 'none';

    currentPuzzle = null;
    currentDifficulty = null;
}

function generateNewPuzzle() {
    if (!currentDifficulty) return;

    // Generate new puzzle
    currentPuzzle = generatePuzzle(currentDifficulty);

    // Clear previous feedback and hide next button
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextPuzzleBtn').style.display = 'none';

    // Render the puzzle
    renderPuzzle();
}

// ============================================
// Puzzle Rendering Functions
// ============================================

function renderPuzzle() {
    if (!currentPuzzle) return;

    // Show/hide appropriate containers
    if (currentPuzzle.grid) {
        document.querySelector('.sequence-container').style.display = 'none';
        document.getElementById('gridContainer').style.display = 'block';
        renderGrid();
    } else {
        document.querySelector('.sequence-container').style.display = 'block';
        document.getElementById('gridContainer').style.display = 'none';
        renderSequence();
    }

    // Render options
    renderOptions();
}

function renderSequence() {
    const container = document.getElementById('sequenceDisplay');
    container.innerHTML = '';

    currentPuzzle.sequence.forEach(shape => {
        const shapeElement = createShapeElement(shape);
        container.appendChild(shapeElement);
    });

    // Add arrow to indicate next
    const arrow = document.createElement('div');
    arrow.className = 'sequence-item arrow';
    arrow.innerHTML = '→';
    container.appendChild(arrow);
}

function renderGrid() {
    const container = document.getElementById('gridDisplay');
    container.innerHTML = '';

    currentPuzzle.grid.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';

        row.forEach((shape, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';

            if (currentPuzzle.missingCell &&
                currentPuzzle.missingCell.row === rowIndex &&
                currentPuzzle.missingCell.col === colIndex) {
                cellElement.innerHTML = '<div class="missing-shape">?</div>';
                cellElement.classList.add('missing');
            } else {
                const shapeElement = createShapeElement(shape);
                cellElement.appendChild(shapeElement);
            }

            rowElement.appendChild(cellElement);
        });

        container.appendChild(rowElement);
    });
}

function renderOptions() {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    currentPuzzle.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.onclick = () => selectOption(index, optionElement);

        const shapeElement = createShapeElement(option);
        optionElement.appendChild(shapeElement);

        container.appendChild(optionElement);
    });
}

function createShapeElement(shape) {
    const element = document.createElement('div');
    element.className = 'shape-item';

    if (!shape.type && !shape.dots) {
        // Missing shape
        element.innerHTML = '<div class="empty-shape"></div>';
        return element;
    }

    // Create shape visual representation
    const visual = document.createElement('div');
    visual.className = `shape ${shape.type || 'circle'} ${shape.fill || 'empty'} ${shape.color || 'black'} ${shape.size || 'medium'}`;

    if (shape.rotation) {
        visual.style.transform = `rotate(${shape.rotation}deg)`;
    }

    // Add dots if present
    if (shape.dots && shape.dots > 0) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-container';

        for (let i = 0; i < shape.dots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotsContainer.appendChild(dot);
        }

        visual.appendChild(dotsContainer);
    }

    element.appendChild(visual);
    return element;
}

// ============================================
// Answer Selection and Feedback
// ============================================

function selectOption(selectedIndex, optionElement) {
    // Disable all options
    const allOptions = document.querySelectorAll('.option-item');
    allOptions.forEach(option => {
        option.onclick = null;
        option.style.cursor = 'default';
    });

    // Check if correct
    const isCorrect = selectedIndex === currentPuzzle.correctIndex;
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        optionElement.classList.add('correct');
        feedback.innerHTML = `
            <div class="success">
                <span class="feedback-icon">🎉</span>
                <span class="feedback-text">정답입니다!</span>
            </div>
            <div class="rule-explanation">
                규칙: ${currentPuzzle.ruleDescription}
            </div>
        `;
        feedback.className = 'feedback success';
    } else {
        optionElement.classList.add('wrong');
        allOptions[currentPuzzle.correctIndex].classList.add('correct');
        feedback.innerHTML = `
            <div class="error">
                <span class="feedback-icon">❌</span>
                <span class="feedback-text">아쉽네요! 정답이 표시되었습니다.</span>
            </div>
            <div class="rule-explanation">
                규칙: ${currentPuzzle.ruleDescription}
            </div>
        `;
        feedback.className = 'feedback error';
    }

    // Show next puzzle button
    document.getElementById('nextPuzzleBtn').style.display = 'block';
}

// ============================================
// Initialization
// ============================================

window.onload = function() {
    console.log('Shape IQ Test System Loaded');

    // Initialize with difficulty selection
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('puzzleInterface').style.display = 'none';
};