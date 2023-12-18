let root;
let countries;
let winnerCountry;


function randomizeWinner() {
    winnerCountry = countries[Math.floor(Math.random() * countries.length)];
    renderCountry();
};

function renderButton() {
    const button = $("<button>", { class: 'primary' }).append("Sorsolj!!!").click(randomizeWinner);
    root.empty();
    root.append(button);
};

function renderHistory() {
    let winningCountries = JSON.parse(localStorage.getItem('winningCountries'));
}

function renderCountry() {
    root.empty();

    const container = $("<div>", { id: 'winner' });
    const title = $("<p>", {
    }).append("A győztes ország:");
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

    root.append(container);

    const buttonContainer = $("<div>", { id: 'buttons' });
    const saveButton = $("<button>", { class: 'primary' }).append("Mehet a főzés!").click(function () {
        let winningCountries = JSON.parse(localStorage.getItem('winningCountries'));
        if (!(winningCountries instanceof Array)) {
            winningCountries = [];
        };
        winningCountries.push(winnerCountry.name.common); 
        localStorage.setItem("winningCountries", JSON.stringify(winningCountries));
    });
    const retryButton = $("<button>", {
        class: "secondary"
    }).append("Újat kérek :(").click(randomizeWinner);

    buttonContainer.append(saveButton).append(retryButton);
    root.append(buttonContainer);



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