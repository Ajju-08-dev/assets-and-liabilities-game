document.addEventListener("DOMContentLoaded", () => {
    const allItems = document.querySelectorAll("#all-items .item");
    const itemsContainer = document.getElementById("all-items");
    const dropZones = document.querySelectorAll(".dropzone");
    let score = 0;
    let timeLeft = 20; // Timer in seconds

    // Initialize timer
    const timerElement = document.getElementById("timer");

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            endGame(); // Show popup when time runs out
        } else {
            timeLeft--;
        }
    }

    function dropItem(event) {
        event.preventDefault();
        const itemId = event.dataTransfer.getData("text");
        const item = document.getElementById(itemId);
    
        // Check if item is dropped in the correct category
        const isCorrectCategory = checkCategory(item, event.target.id);
        if (isCorrectCategory) {
            event.target.appendChild(item);
            updateScore(10); // Increase score by 10 for correct drop
            item.classList.add("dropped"); // Mark as dropped
            item.setAttribute("draggable", false); // Disable dragging after correct drop
        } else {
            updateScore(-5); // Deduct score by 5 for incorrect drop
        }
        checkGameCompletion(); // Check completion after every drop
    }
    
    function checkGameCompletion() {
        // Check if all active items have been correctly placed
        const allDroppedCorrectly = document.querySelectorAll(".item.active.dropped").length === 10;
        if (allDroppedCorrectly) {
            endGame();
        }
    }
    

    // Start the timer countdown
    const timerInterval = setInterval(updateTimer, 1000);

    // Shuffle items and display only 10
    const shuffledItems = Array.from(allItems).sort(() => 0.5 - Math.random());
    shuffledItems.slice(0, 10).forEach(item => {
        item.classList.add("active");
    });
    itemsContainer.classList.remove("hidden");
    allItems.forEach(item => {
        if (!item.classList.contains("active")) {
            item.style.display = "none";
        }
    });

    // Enable dragging for each active item
    shuffledItems.slice(0, 10).forEach(item => {
        item.addEventListener("dragstart", dragStart);
    });

    // Set up the drop zones to allow dropping
    dropZones.forEach(zone => {
        zone.addEventListener("dragover", dragOver);
        zone.addEventListener("drop", dropItem);
    });

    function dragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.id);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dropItem(event) {
        event.preventDefault();
        const itemId = event.dataTransfer.getData("text");
        const item = document.getElementById(itemId);
        
        // Check if item is dropped in the correct category
        const isCorrectCategory = checkCategory(item, event.target.id);
        if (isCorrectCategory) {
            event.target.appendChild(item);
            updateScore(10); // Increase score by 10 for correct drop
            item.classList.add("dropped"); // Mark as dropped
            item.setAttribute("draggable", false); // Disable dragging after correct drop
        } else {
            updateScore(-5); // Deduct score by 5 for incorrect drop
        }
    }

    function checkCategory(item, dropZoneId) {
        // Define correct categories for items
        const categories = {
            "C-assets": [
                "cashinhand", 
                "cashatbank", 
                "billsreceivable", 
                "shortterminvestment", 
                "sundrydebtor", 
                "closingstock", 
                "prepaidexpenses"
            ],
            "F-assets": [
                "furniture", 
                "loosetools", 
                "motorvehicle", 
                "longterminvestment", 
                "landandbuilding", 
                "patent", 
                "goodwill"
            ],
            "C-liabilities": [
                "bankoverdraft", 
                "billspayable", 
                "sundrycreditor", 
                "outstandingexp", 
                "unearnedincome"
            ],
            "F-liabilities": [
                "longtermloan", 
                "reserves", 
                "capital", 
                "longtermprovision", 
                "longtermobligation"
            ]
        };
        

        return categories[dropZoneId]?.includes(item.id);
    }

    function updateScore(points) {
        score += points;
        document.getElementById("score").textContent = `Score: ${score}`;
        checkGameCompletion();
    }

    function checkGameCompletion() {
        const allDropped = document.querySelectorAll(".item.dropped").length === 10;
        if (allDropped) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval); // Stop the timer
        showPopup(score); // Show the final score popup
    }

    function showPopup(finalScore) {
        const popup = document.getElementById("game-over-popup");
        const finalScoreElement = document.getElementById("final-score");
    
        // Update the final score in the popup
        finalScoreElement.textContent = `Your final score is: ${finalScore}`;
        
        // Show the popup
        popup.classList.remove("popup-hidden");
        popup.classList.add("popup-visible");
    }
    
    // Restart game function
    window.restartGame = function() {
        const popup = document.getElementById("game-over-popup");
        popup.classList.remove("popup-visible");
        popup.classList.add("popup-hidden"); // Hide the popup
        location.reload(); // Reload the page to restart the game
    };
});
