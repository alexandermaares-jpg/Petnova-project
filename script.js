const cards = document.querySelectorAll('.carousel-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let classes = ['back-left', 'mid-left', 'active', 'mid-right', 'back-right'];
let autoMove;

function updateCarousel() {
    cards.forEach((card, index) => {
        card.className = 'carousel-card';
        if (classes[index]) {
            card.classList.add(classes[index]);
        }
    });
}

function moveNext() {
    classes.push(classes.shift());
    updateCarousel();
}

function movePrev() {
    classes.unshift(classes.pop());
    updateCarousel();
}

function startAutoMove() {
    autoMove = setInterval(moveNext, 3000);
}

function stopAutoMove() {
    clearInterval(autoMove);
}

prevBtn.addEventListener('click', () => {
    stopAutoMove();
    movePrev();
    startAutoMove();
});

nextBtn.addEventListener('click', () => {
    stopAutoMove();
    moveNext();
    startAutoMove();
});

updateCarousel();
startAutoMove();
