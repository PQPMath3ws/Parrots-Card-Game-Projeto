const availableImages = [
    "bobrossparrot.gif",
    "explodyparrot.gif",
    "fiestaparrot.gif",
    "metalparrot.gif",
    "revertitparrot.gif",
    "tripletsparrot.gif",
    "unicornparrot.gif"
];

const imageDir = "assets/images/";
const birdImage = "back.png";

let amountCards = null;

let initialMessage = null;
let messageChanged = null;

let timeInterval = null;
let time = null;

let canHoverCards = null;

let pairs = [];

let flippedCards = [];

let clicksCount = 0;

window.onload = async function() {
    await configGame();
    document.getElementById("restart").addEventListener("click", async function() {
        await configGame();
    });
};

async function configGame() {
    await preloadImages();
    document.getElementById("title-div").style.display = "none";
    document.getElementById("cards-div").innerHTML = "";
    document.getElementById("restart-div").style.display = "none";
    document.getElementById("counter-div").style.display = "none";
    document.getElementById("counter").innerHTML = "00:00";
    amountCards = null;
    initialMessage = "Quantas cartas deseja utilizar?";
    messageChanged = false;
    time = 0;
    canHoverCards = false;
    pairs = [];
    clicksCount = 0;
    while (!amountCards && Number.isNaN(parseInt(amountCards))) {
        amountCards = Math.abs(parseInt(prompt(initialMessage)));
        if (!Number.isNaN(amountCards) && amountCards < 4) {
            amountCards = null;
            changeMessage();
        }
        if (!Number.isNaN(amountCards) && amountCards > 14) {
            amountCards = null;
            changeMessage();
        }
        if (!Number.isNaN(amountCards) && amountCards % 2 != 0) {
            amountCards++;
            alert(`Valor Ímpar Detectado - Usando Valor Par Próximo: O Número ${amountCards}!`);
        }
    }
    await arrangeCards();
}

function preloadImages() {
    return new Promise(resolve => {
        for (let i = 0; i < availableImages.length; i++) {
            let image = new Image();
            image.src = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + imageDir + availableImages[i];
            delete(image);
        }
        resolve();
    });
}

function changeMessage() {
    if (!messageChanged) {
        initialMessage = "Quantidade Inválida - Tente Novamente!\n\n" + initialMessage;
        messageChanged = true;
    }
}

async function arrangeCards() {
    const titleDiv = document.getElementById("title-div");
    const cardsDiv = document.getElementById("cards-div");
    titleDiv.style.display = "block";
    titleDiv.classList.add("fadeIn");
    let card = `<div class="card" onclick="hoverCard(this)">
    <img src="assets/images/back.png" alt="">
</div>`;
    cardsDiv.innerHTML = "";
    let cardsArr = [...availableImages];
    for (let i = 1; i <= amountCards; i++) {
        cardsDiv.innerHTML += card;
    }
    for (let add = 0; add < amountCards / 2; add++) {
        let index = Math.floor(Math.random() * cardsArr.length);
        let indexOf = cardsArr.indexOf(cardsArr[index]);
        pairs.push(cardsArr[index]);
        if (indexOf > -1) cardsArr.splice(indexOf, 1);
    }
    pairs.push(...pairs);
    pairs.sort(function () {
        return Math.random() - 0.5;
    });
    for (let i = 0; i < cardsDiv.children.length; i++) {
        cardsDiv.children[i].style.opacity = 1;
        cardsDiv.children[i].classList.add("animCard");
        await sleep(500);
    }
    for (let i = 0; i < cardsDiv.children.length; i++) {
        cardsDiv.children[i].classList.remove("animCard");
        cardsDiv.children[i].style.transform = "rotateY(180deg)";
        cardsDiv.children[i].classList.add("flip");
        setTimeout(function() {
            cardsDiv.children[i].getElementsByTagName("img")[0].classList.add("animImg");
            cardsDiv.children[i].getElementsByTagName("img")[0].src = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + imageDir + pairs[i];
        }, 400);
    }
    await sleep(1000);
    for (let i = 0; i < cardsDiv.children.length; i++) {
        cardsDiv.children[i].classList.remove("flip");
    }
    await sleep(3000);
    for (let i = 0; i < cardsDiv.children.length; i++) {
        cardsDiv.children[i].style.transform = "rotateY(0deg)";
        cardsDiv.children[i].classList.add("unflip");
        setTimeout(function() {
            cardsDiv.children[i].getElementsByTagName("img")[0].classList.remove("animImg");
            cardsDiv.children[i].getElementsByTagName("img")[0].src = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + imageDir + birdImage;
        }, 400);
    }
    await sleep(1000);
    for (let i = 0; i < cardsDiv.children.length; i++) {
        cardsDiv.children[i].classList.remove("unflip");
    }
    canHoverCards = true;
    document.getElementById("counter-div").style.display = "block";
    timeInterval = setInterval(countTime, 1000);
}

function sleep(miliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds);
    });
}

function countTime() {
    const counter = document.getElementById("counter");
    time++;
    if (time > 3599) {
        counter.innerHTML = new Date(time * 1000).toISOString().slice(11, 19)
    } else {
        counter.innerHTML = new Date(time * 1000).toISOString().slice(14, 19);
    }
}

function hoverCard(element) {
    if (canHoverCards) {
        if (flippedCards.length < 2) {
            if (!element.classList.contains("correct")) {
                element.style.transform = "rotateY(180deg)";
                element.classList.add("flip");
                if (element.classList.contains("flip") && !element.classList.contains("selected")) {
                    element.classList.add("selected");
                    let parent = document.getElementById("cards-div");
                    let indexOf = Array.prototype.indexOf.call(parent.children, element);
                    setTimeout(function () {
                        element.getElementsByTagName("img")[0].classList.add("animImg");
                        element.getElementsByTagName("img")[0].src = window.location.origin + window.location.pathname + imageDir + pairs[indexOf];
                    }, 400);
                    flippedCards.push(element);
                    clicksCount++;
                }
            }
        }
        if (flippedCards.length === 2) {
            let cardsFlipped = [...flippedCards];
            flippedCards = [];
            setTimeout(function() {
                cardsFlipped[0].classList.remove("flip");
                cardsFlipped[1].classList.remove("flip");
                if (cardsFlipped[0].getElementsByTagName("img")[0].src === cardsFlipped[1].getElementsByTagName("img")[0].src) {
                    cardsFlipped[0].classList.add("correct");
                    cardsFlipped[1].classList.add("correct");
                    for (let index = 0; index < 2; index++) {
                        let indexOf = Array.prototype.indexOf.call(cardsFlipped, cardsFlipped[index]);
                        cardsFlipped.splice(indexOf, 1);
                    }
                    verifyWinGame();
                } else {
                    cardsFlipped[0].classList.remove("selected");
                    cardsFlipped[1].classList.remove("selected");
                    setTimeout(function() {
                        cardsFlipped[0].style.transform = "rotateY(0deg)";
                        cardsFlipped[0].classList.add("unflip");
                        cardsFlipped[1].style.transform = "rotateY(0deg)";
                        cardsFlipped[1].classList.add("unflip");
                        setTimeout(function() {
                            cardsFlipped[0].getElementsByTagName("img")[0].classList.remove("animImg");
                            cardsFlipped[1].getElementsByTagName("img")[0].classList.remove("animImg");
                            cardsFlipped[0].getElementsByTagName("img")[0].src = window.location.origin + window.location.pathname + imageDir + birdImage;
                            cardsFlipped[1].getElementsByTagName("img")[0].src = window.location.origin + window.location.pathname + imageDir + birdImage;
                            setTimeout(function() {
                                cardsFlipped[0].classList.remove("unflip");
                                cardsFlipped[1].classList.remove("unflip");
                                for (let index = 0; index < 2; index++) {
                                    let indexOf = Array.prototype.indexOf.call(cardsFlipped, cardsFlipped[index]);
                                    cardsFlipped.splice(indexOf, 1);
                                }
                            }, 400);
                        }, 400);
                    }, 1000);
                }
            }, 800);
        }
    }
}

function verifyWinGame() {
    const cardsDiv = document.getElementById("cards-div");
    let count = 0;
    for (let i = 0; i < cardsDiv.children.length; i++) {
        if (cardsDiv.children[i].classList.contains("correct")) count++;
    }
    if (count === cardsDiv.children.length) {
        clearInterval(timeInterval);
        alert(`Você ganhou em ${clicksCount} jogadas, no tempo de ${time} segundos!`);
        document.getElementById("restart-div").style.display = "block";
    };
}