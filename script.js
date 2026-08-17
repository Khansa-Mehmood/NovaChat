/* =========================================
   NOVACHAT
   Frontend Chat Application
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const clearChatButton = document.getElementById("clearChat");

const typingWrapper = document.getElementById("typingWrapper");
const welcomeMessage = document.getElementById("welcomeMessage");
const charCount = document.getElementById("charCount");

const suggestions = document.querySelectorAll(".suggestion");


/* =========================================
   LOCAL STORAGE KEY
========================================= */

const STORAGE_KEY = "novachat_messages";


/* =========================================
   CHATBOT RESPONSES
========================================= */

const botResponses = {

    hello: [
        "Hey there! 👋 It's great to see you.",
        "Hello! ✨ How can I help you today?",
        "Hey! I'm Nova. What are we talking about?"
    ],

    hi: [
        "Hi! 👋 How's your day going?",
        "Hello there! ✨",
        "Hey! Nice to have you here."
    ],

    hey: [
        "Hey! 👋 What's up?",
        "Hey there! How can I help?",
        "Hello! Ready for a conversation?"
    ],

    joke: [
        "Why did the developer go broke? Because he used up all his cache. 😂",
        "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
        "I told my computer I needed a break... now it won't stop sending me vacation ads. 😂"
    ],

    idea: [
        "Here's an idea: build a personal dashboard that tracks your goals, habits, and daily progress. 🚀",
        "How about creating a beautiful portfolio with interactive animations? ✨",
        "Try building a mini AI assistant using JavaScript and predefined responses. 🤖"
    ],

    help: [
        "Sure! I can chat with you, tell jokes, give ideas, and respond to simple questions. 😊",
        "I'm here to help! Try asking me for a joke or an idea."
    ],

    thanks: [
        "You're very welcome! 😊",
        "Anytime! ✨",
        "Glad I could help!"
    ],

    bye: [
        "Goodbye! 👋 Come back anytime.",
        "See you later! ✨",
        "Take care! Have an amazing day!"
    ],

    default: [
        "That's interesting! Tell me more. 👀",
        "Hmm... I like where this conversation is going. ✨",
        "Interesting thought! I'm listening.",
        "I'm still learning, but I'd love to hear more about that.",
        "That sounds cool! 🚀"
    ]

};


/* =========================================
   INITIALIZE CHAT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadMessages();

    updateCharacterCount();

    messageInput.focus();

});


/* =========================================
   LOAD MESSAGES
========================================= */

function loadMessages() {

    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (!savedMessages) {
        return;
    }

    try {

        const messages = JSON.parse(savedMessages);

        if (messages.length > 0) {

            welcomeMessage.style.display = "none";

            messages.forEach(message => {

                createMessageElement(
                    message.text,
                    message.sender,
                    message.time,
                    false
                );

            });

            scrollToBottom(false);
        }

    } catch (error) {

        console.error(
            "Could not load saved messages:",
            error
        );

    }

}


/* =========================================
   SAVE MESSAGES
========================================= */

function saveMessage(text, sender, time) {

    let messages = [];

    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (savedMessages) {

        try {
            messages = JSON.parse(savedMessages);
        } catch {
            messages = [];
        }

    }

    messages.push({
        text,
        sender,
        time
    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
    );

}


/* =========================================
   SEND MESSAGE
========================================= */

function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) {
        shakeInput();
        return;
    }

    /* Hide welcome screen */
    welcomeMessage.style.display = "none";


    /* Current time */
    const time = getCurrentTime();


    /* Add user message */
    createMessageElement(
        text,
        "sent",
        time,
        true
    );


    /* Save user message */
    saveMessage(
        text,
        "sent",
        time
    );


    /* Clear input */
    messageInput.value = "";

    updateCharacterCount();


    /* Bot response */
    showBotResponse(text);

}


/* =========================================
   CREATE MESSAGE ELEMENT
========================================= */

function createMessageElement(
    text,
    sender,
    time,
    animate = true
) {

    const message = document.createElement("div");

    message.classList.add(
        "message",
        sender
    );

    if (!animate) {
        message.style.animation = "none";
    }


    const content = document.createElement("div");

    content.classList.add(
        "message-content"
    );


    const bubble = document.createElement("div");

    bubble.classList.add(
        "message-bubble"
    );

    bubble.textContent = text;


    const timestamp = document.createElement("div");

    timestamp.classList.add(
        "message-time"
    );

    timestamp.textContent = time;


    content.appendChild(bubble);
    content.appendChild(timestamp);

    message.appendChild(content);

    chatBox.appendChild(message);


    /* Scroll after message appears */

    scrollToBottom(animate);


    return message;
}


/* =========================================
   BOT RESPONSE
========================================= */

function showBotResponse(userText) {

    showTyping();


    const delay = randomNumber(
        700,
        1500
    );


    setTimeout(() => {

        hideTyping();


        const response =
            getBotResponse(userText);


        const time = getCurrentTime();


        createMessageElement(
            response,
            "received",
            time,
            true
        );


        saveMessage(
            response,
            "received",
            time
        );


    }, delay);

}


/* =========================================
   GET BOT RESPONSE
========================================= */

function getBotResponse(text) {

    const message = text
        .toLowerCase()
        .trim();


    if (
        message.includes("hello")
    ) {
        return randomResponse(
            botResponses.hello
        );
    }


    if (
        message === "hi" ||
        message.startsWith("hi ")
    ) {
        return randomResponse(
            botResponses.hi
        );
    }


    if (
        message.includes("hey")
    ) {
        return randomResponse(
            botResponses.hey
        );
    }


    if (
        message.includes("joke") ||
        message.includes("funny")
    ) {
        return randomResponse(
            botResponses.joke
        );
    }


    if (
        message.includes("idea") ||
        message.includes("ideas")
    ) {
        return randomResponse(
            botResponses.idea
        );
    }


    if (
        message.includes("help")
    ) {
        return randomResponse(
            botResponses.help
        );
    }


    if (
        message.includes("thank") ||
        message.includes("thanks")
    ) {
        return randomResponse(
            botResponses.thanks
        );
    }


    if (
        message.includes("bye") ||
        message.includes("goodbye")
    ) {
        return randomResponse(
            botResponses.bye
        );
    }


    return randomResponse(
        botResponses.default
    );

}


/* =========================================
   RANDOM RESPONSE
========================================= */

function randomResponse(array) {

    const index = Math.floor(
        Math.random() * array.length
    );

    return array[index];

}


/* =========================================
   TYPING INDICATOR
========================================= */

function showTyping() {

    typingWrapper.classList.add("active");

    scrollToBottom(true);

}


function hideTyping() {

    typingWrapper.classList.remove("active");

}


/* =========================================
   GET CURRENT TIME
========================================= */

function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================
   SCROLL TO BOTTOM
========================================= */

function scrollToBottom(smooth = true) {

    setTimeout(() => {

        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: smooth
                ? "smooth"
                : "auto"
        });

    }, 50);

}


/* =========================================
   RANDOM DELAY
========================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


/* =========================================
   CHARACTER COUNTER
========================================= */

function updateCharacterCount() {

    const length =
        messageInput.value.length;

    charCount.textContent =
        `${length}/500`;

}


/* =========================================
   INPUT EVENTS
========================================= */

messageInput.addEventListener(
    "input",
    updateCharacterCount
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================
   SEND BUTTON
========================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================
   SUGGESTION BUTTONS
========================================= */

suggestions.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const text =
                button.textContent
                    .replace("👋", "")
                    .replace("😂", "")
                    .replace("💡", "")
                    .trim();

            messageInput.value = text;

            updateCharacterCount();

            sendMessage();

        }
    );

});


/* =========================================
   CLEAR CHAT
========================================= */

clearChatButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure you want to clear the conversation?"
            );

        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            STORAGE_KEY
        );


        /* Remove all messages */

        const messages =
            chatBox.querySelectorAll(
                ".message"
            );

        messages.forEach(message => {
            message.remove();
        });


        /* Hide typing */

        hideTyping();


        /* Show welcome screen */

        welcomeMessage.style.display =
            "flex";


        /* Small animation */

        welcomeMessage.style.animation =
            "none";

        requestAnimationFrame(() => {

            welcomeMessage.style.animation =
                "fadeUp 0.5s ease";

        });

    }
);


/* =========================================
   INPUT SHAKE
========================================= */

function shakeInput() {

    const wrapper =
        document.querySelector(
            ".input-wrapper"
        );


    wrapper.animate(
        [
            {
                transform: "translateX(0)"
            },
            {
                transform: "translateX(-6px)"
            },
            {
                transform: "translateX(6px)"
            },
            {
                transform: "translateX(-4px)"
            },
            {
                transform: "translateX(4px)"
            },
            {
                transform: "translateX(0)"
            }
        ],
        {
            duration: 350,
            easing: "ease"
        }
    );

}