// Get the canvas element and its 2d context
let canvas = document.getElementById("scratch-card1");
let context = canvas.getContext("2d");

// Get the popup element
let popup = document.getElementById("popup");

// Initialize function to set up the canvas
const init = () => {
    let img = new Image();
    img.onload = function() {
        canvas.width = window.innerWidth; // Adjust canvas width to match window width
        canvas.height = window.innerHeight; // Adjust canvas height to match window height
        let x = (canvas.width - img.width) / 2; // Calculate x position to center the image
        let y = (canvas.height - img.height) / 2; // Calculate y position to center the image
        context.drawImage(img, x, y); // Draw image at calculated position
    };
    img.src = './images/1000.png';
}

// Variable to track if mouse/touch is over the canvas
let isHovering = false;

// Function to handle scratching effect
const scratch = (x, y) => {
    if (isHovering) {
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI); // Decrease the radius to make the brush smaller
        context.fill();

        // Check if 100% of the image has been scratched off
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
        let totalPixels = pixels.length / 4; // Each pixel has 4 values (RGBA)

        let transparentPixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            let alpha = pixels[i + 3];
            if (alpha === 0) {
                transparentPixels++;
            }
        }

        let transparencyPercentage = (transparentPixels / totalPixels) * 100;
        if (transparencyPercentage >= 99.6) { // If more than 99.5% of the image is transparent
            popup.style.display = "block"; // Show the popup

            // Hide the popup and reload the page after 14 seconds
            setTimeout(() => {
                popup.style.display = "none"; // Hide the popup
                location.reload(); // Reload the page
            }, 14000); // 14 seconds in milliseconds
        } else {
            popup.style.display = "none"; // Hide the popup if less than 99.5% of the image is transparent
        }
    }
};

// Event listeners for mouse interactions
canvas.addEventListener("mouseenter", () => {
    isHovering = true;
    canvas.addEventListener("mousemove", scratchOnHover);
});

canvas.addEventListener("mouseleave", () => {
    isHovering = false;
    canvas.removeEventListener("mousemove", scratchOnHover);
});

function scratchOnHover(event) {
    scratch(event.offsetX, event.offsetY);
}

// Event listeners for touch interactions
canvas.addEventListener("touchstart", (event) => {
    isHovering = true;
    event.preventDefault(); // Prevent default touch behavior
    scratchOnTouch(event);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Prevent default touch behavior
    scratchOnTouch(event);
});

canvas.addEventListener("touchend", () => {
    isHovering = false;
});

function scratchOnTouch(event) {
    let touch = event.touches[0]; // Get the first touch
    let rect = canvas.getBoundingClientRect(); // Get the position of the canvas
    let x = touch.clientX - rect.left; // Calculate x position relative to the canvas
    let y = touch.clientY - rect.top; // Calculate y position relative to the canvas
    scratch(x, y);
}

// Event listener for window resize
window.addEventListener("resize", () => {
    init();
});

// Initialize the canvas
init();

// Reset button functionality
document.getElementById("resetButton").addEventListener("click", function() {
    init(); // Reset the canvas
    popup.style.display = "none"; // Hide the popup
});

// Close button functionality
document.getElementById("closeButton").addEventListener("click", function() {
    window.close(); // Close the current window
});

// Get the video element
let video = document.querySelector("video");

// Function to handle video ending
const resetOnVideoEnd = () => {
    init(); // Reset the canvas
    popup.style.display = "none"; // Hide the popup
};

// Event listener for video end
video.addEventListener("ended", resetOnVideoEnd);
// Get the video element


// Get the audio element
let audio = document.querySelector("audio");

// Function to handle video starting
const playAudioWithVideo = () => {
    console.log("Video started playing");
    audio.play(); // Play the audio
};

// Event listener for video play
video.addEventListener("play", playAudioWithVideo);

// Event listener for video ended
video.addEventListener("ended", () => {
    console.log("Video ended");
    audio.pause(); // Pause the audio when the video ends
});

