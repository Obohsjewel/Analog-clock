/*==========================================================
    LUXURY ANALOG CLOCK
    PART 1
==========================================================*/


//==========================================================
// SELECT HTML ELEMENTS
//==========================================================

const clock = document.querySelector(".clock");

const ticksContainer = document.getElementById("ticks");

const numbersContainer = document.getElementById("numbers");

const hourHand = document.querySelector(".hour-hand");

const minuteHand = document.querySelector(".minute-hand");

const secondHand = document.querySelector(".second-hand");

const digitalClock = document.querySelector(".digital-clock");

const dateDisplay = document.querySelector(".date");


//==========================================================
// CREATE THE 60 CLOCK TICKS
//==========================================================

for (let i = 0; i < 60; i++) {

    const tick = document.createElement("div");

    tick.classList.add("tick");

    // Every 5th tick is larger
    if (i % 5 === 0) {

        tick.classList.add("major-tick");

    }

    tick.style.transform =
        `rotate(${i * 6}deg)`;

    ticksContainer.appendChild(tick);

}


//==========================================================
// CREATE THE 12 CLOCK NUMBERS
//==========================================================

for (let i = 1; i <= 12; i++) {

    const number = document.createElement("div");

    number.classList.add("clock-number");

    number.innerText = i;

    // Position around the clock

    const angle = (i * 30 - 90) * Math.PI / 180;

    const radius = 165;

    const x = Math.cos(angle) * radius;

    const y = Math.sin(angle) * radius;

    number.style.left = `calc(50% + ${x}px)`;

    number.style.top = `calc(50% + ${y}px)`;

    numbersContainer.appendChild(number);

}


//==========================================================
// LOAD CLOCK SOUND
//==========================================================

// Two audio objects are used so that
// each new tick starts instantly.

const tickOne = new Audio("sounds/clockSound.mp3");

const tickTwo = new Audio("sounds/clockSound.mp3");

tickOne.preload = "auto";
tickTwo.preload = "auto";

tickOne.volume = 0.15;
tickTwo.volume = 0.15;

let useFirstAudio = true;


//==========================================================
// ENABLE AUDIO AFTER FIRST CLICK
//==========================================================

let soundEnabled = false;

document.addEventListener("click", () => {

    soundEnabled = true;

    console.log("Clock sound enabled.");

}, { once: true });


//==========================================================
// PLAY TICK SOUND
//==========================================================

function playTickSound() {

    if (!soundEnabled) return;

    const player = useFirstAudio ? tickOne : tickTwo;

    player.pause();

    player.currentTime = 0;

    player.play().catch(() => {});

    useFirstAudio = !useFirstAudio;

}


//==========================================================
// DATE FORMAT OPTIONS
//==========================================================

const dateOptions = {

    weekday: "long",

    year: "numeric",

    month: "long",

    day: "numeric"

};


//==========================================================
// VARIABLES
//==========================================================

let previousSecond = -1;


//==========================================================
// UPDATE DIGITAL CLOCK
//==========================================================

function updateDigitalClock(now) {

    digitalClock.textContent =
        now.toLocaleTimeString();

    dateDisplay.textContent =
        now.toLocaleDateString(
            undefined,
            dateOptions
        );

}


//==========================================================
// CONVERT TIME TO ANGLES
//==========================================================

function calculateAngles(now) {

    const milliseconds = now.getMilliseconds();

    const seconds =
        now.getSeconds() + milliseconds / 1000;

    const minutes =
        now.getMinutes() + seconds / 60;

    const hours =
        (now.getHours() % 12) + minutes / 60;

    return {

        secondAngle: seconds * 6,

        minuteAngle: minutes * 6,

        hourAngle: hours * 30,

        wholeSecond: now.getSeconds()

    };

}


/*==========================================================

END OF PART 1

Part 2 begins with:

function animateClock(){

==========================================================*/
/*==========================================================
    PART 2
    CLOCK ANIMATION
==========================================================*/


//==========================================================
// ROTATE CLOCK HANDS
//==========================================================

function rotateHands(hourAngle, minuteAngle, secondAngle) {

    hourHand.style.transform =
        `translateX(-50%) rotate(${hourAngle}deg)`;

    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteAngle}deg)`;

    secondHand.style.transform =
        `translateX(-50%) rotate(${secondAngle}deg)`;

}


//==========================================================
// UPDATE ANALOG CLOCK
//==========================================================

function updateAnalogClock(now) {

    const {

        secondAngle,

        minuteAngle,

        hourAngle,

        wholeSecond

    } = calculateAngles(now);


    rotateHands(
        hourAngle,
        minuteAngle,
        secondAngle
    );


    // Play one tick every new second

    if (wholeSecond !== previousSecond) {

        previousSecond = wholeSecond;

        playTickSound();

    }

}


//==========================================================
// MAIN ANIMATION LOOP
//==========================================================

function animateClock() {

    const now = new Date();

    updateAnalogClock(now);

    updateDigitalClock(now);

    requestAnimationFrame(animateClock);

}


//==========================================================
// OPTIONAL CLOCK ENTRANCE ANIMATION
//==========================================================

function startClockAnimation() {

    clock.animate(

        [

            {

                transform: "scale(0.7)",

                opacity: 0

            },

            {

                transform: "scale(1)",

                opacity: 1

            }

        ],

        {

            duration: 900,

            easing: "ease-out",

            fill: "forwards"

        }

    );

}


//==========================================================
// OPTIONAL GLOW EFFECT
//==========================================================

function glowClock() {

    let glow = true;

    setInterval(() => {

        if (glow) {

            clock.style.boxShadow = `
                0 0 35px rgba(0,255,255,.35),
                inset 0 0 25px rgba(255,255,255,.08),
                inset 0 0 60px rgba(0,0,0,.6)
            `;

        } else {

            clock.style.boxShadow = `
                0 0 20px rgba(0,255,255,.15),
                inset 0 0 25px rgba(255,255,255,.05),
                inset 0 0 60px rgba(0,0,0,.6)
            `;

        }

        glow = !glow;

    }, 1000);

}


//==========================================================
// OPTIONAL SECOND HAND PULSE
//==========================================================

function pulseCenterDot() {

    setInterval(() => {

        const centerDot = document.querySelector(".center-dot");

        centerDot.animate(

            [

                {

                    transform:
                        "translate(-50%,-50%) scale(1)"

                },

                {

                    transform:
                        "translate(-50%,-50%) scale(1.15)"

                },

                {

                    transform:
                        "translate(-50%,-50%) scale(1)"

                }

            ],

            {

                duration: 250

            }

        );

    }, 1000);

}


//==========================================================
// INITIALIZE CLOCK
//==========================================================

function initClock() {

    startClockAnimation();

    glowClock();

    pulseCenterDot();

    animateClock();

}


//==========================================================
// START APPLICATION
//==========================================================

window.addEventListener("load", initClock);
