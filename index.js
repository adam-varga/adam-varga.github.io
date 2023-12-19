let root;
let countries;
let winnerCountry;
const foodEmojis = ['🍕', '🍔', '🍦', '🍣', '☕', '🍰', '🥦', '🥕', '🍅', '🍗', '🍖', '🍟', '🍜', '🍝', '🌮', '🌯', '🍲', '🍛', '🍱', '🍤', '🍩', '🍪', '🍫', '🍭', '🍬', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍓', '🥝', '🍈', '🍇', '🍍', '🍑', '🍅', '🍆', '🥑', '🥔', '🥖', '🍞', '🥓', '🍔', '🍟', '🌭', '🍕'];
const flagEmojis = ['🇦🇫', '🇦🇷', '🇦🇺', '🇧🇷', '🇨🇦', '🇨🇭', '🇨🇳', '🇩🇪', '🇪🇸', '🇫🇷', '🇬🇧', '🇬🇷', '🇮🇳', '🇮🇹', '🇯🇵', '🇰🇷', '🇲🇽', '🇳🇱', '🇳🇴', '🇳🇿', '🇵🇪', '🇵🇭', '🇵🇱', '🇷🇺', '🇸🇦', '🇸🇬', '🇹🇷', '🇺🇸', '🇻🇪', '🇿🇦', '🇿🇭', '🇦🇪', '🇦🇹', '🇧🇪', '🇨🇴', '🇩🇰', '🇪🇬', '🇮🇪', '🇮🇩', '🇱🇺', '🇲🇦', '🇲🇾', '🇵🇹', '🇷🇴', '🇸🇪', '🇹🇼', '🇹🇭', '🇺🇦', '🇻🇳', '🇿🇼'];
const emojiScalar = 2;


function randomizeWinner(e) {
    winnerCountry = countries[Math.floor(Math.random() * countries.length)];

    renderCountry();
};

function shootConfettisWithTimeout(timeout, confettiText) {

    let confettiOptions = {
        particleCount: 150,
        spread: 60,
        ticks: 300,
        origin: {
            x: 0.5,
            y: 0.7
        }
    }

    if (confettiText && confettiText.length) {
        const confettiShapes = confettiText.map(text => confetti.shapeFromText({ text, scalar: emojiScalar }));

        confettiOptions = {
            ...confettiOptions,
            shapes: confettiShapes,
            scalar: emojiScalar
        }
    }

    setTimeout(() => {
        confetti(confettiOptions);
    }, timeout)

}

function renderButton() {
    const button = $("<button>", { class: 'primary' }).append("Sorsolj!!!").click(randomizeWinner);
    root.empty();
    root.append(button);
};

function renderCountry() {
    root.empty();

    const container = $("<div>", { id: 'winner' });
    const title = $("<p>", {
    }).append("A győztes ország:").hide();
    const country = $("<a>", {
        target: "_blank",
        href: winnerCountry && winnerCountry.maps && winnerCountry.maps.googleMaps
    }).append(winnerCountry && winnerCountry.name && winnerCountry.name.common);
    const flag = $("<img>", {
        id: 'flag',
        src: winnerCountry && winnerCountry.flags && winnerCountry.flags.png
    });


    container.append(title);
    container.append(country);
    container.append(flag);
    container.hide();

    root.append(container);

    const buttonContainer = $("<div>", { id: 'buttons' });
    const saveButton = $("<button>", { id: "saveButton", class: 'primary' }).append("Mehet a főzés!").click(function () {
        let winningCountries = JSON.parse(localStorage.getItem('winningCountries'));
        if (!(winningCountries instanceof Array)) {
            winningCountries = [];
        };

        if (winningCountries.indexOf(winnerCountry.name.common) > -1) {
            if (winningCountries.indexOf(winnerCountry.name.common) != winningCountries.length - 1) {
                alert(`${winnerCountry.name.common} már megvolt...`);

                return;
            } else {
                console.log('uccso');
            }
        } else {
            winningCountries.push(winnerCountry.name.common);
        }

        localStorage.setItem("winningCountries", JSON.stringify(winningCountries));





        setTimeout(() => {

            buttonContainer.fadeOut();
            container.fadeOut();


            setTimeout(() => {
                const previousCountries = winningCountries.slice(0, -1);

                if (previousCountries.length) {
                    container.append($("<p>", {
                        class: 'prev'
                    }).append(`\<div\>\<b\>Előző országaink:\<\/b\>\<\/div\> \<i\>${previousCountries.join(', ')}\<\/i\>`));
                }
                title.show();
                container.addClass('saved');
                container.fadeIn(1000);

                const numberOfConfettiShots = Math.floor(Math.random() * 3) + 3;
                const confettiTypes = [null, foodEmojis, flagEmojis];

                for (let i = 0; i <= numberOfConfettiShots; i++) {
                    if (i === 0) {
                        shootConfettisWithTimeout(i * 1500 + 1000);
                    } else {
                        shootConfettisWithTimeout(i * 1500 + 1000, confettiTypes[Math.min(Math.floor(Math.random() * confettiTypes.length), confettiTypes.length - 1)]);
                    }
                }
            }, 600);


        }, 200);
    });
    const retryButton = $("<button>", {
        class: "secondary"
    }).append("Újat kérek :(").click(randomizeWinner);

    buttonContainer.append(saveButton).append(retryButton).hide();
    root.append(buttonContainer);

    container.fadeIn(500);
    buttonContainer.fadeIn(500);

}

$(document).ready(function () {
    root = $('#root');

    $.ajax({
        url: "https://restcountries.com/v3.1/all"
    }).then(function (data) {

        console.log(data);
        countries = data;

        renderButton();

    });
});