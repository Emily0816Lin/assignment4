let firstCard = undefined
let secondCard = undefined
let isFlipping = false;
let isGameFinished = false;
let isGameStarted = false;
let matches = 0;
let clicks = 0;

const setup = async () => {

  //Easy difficulty
  newFetch();
  handleCardClick(50);

  //Medium difficulty
  document.getElementById("option2").addEventListener("click", function () {
    if (isGameStarted && !isGameFinished) {
      alert("Please finish the current game first or click on reset!");
      return;
    } else {
      document.getElementById("game_grid").style.width = "800px";
      document.getElementById("game_grid").style.height = "600px";
      addCard(12);
      newFetch();
      handleCardClick(100);
    }
  })

  //Hard difficulty
  document.getElementById("option3").addEventListener("click", function () {
    if (isGameStarted && !isGameFinished) {
      alert("Please finish the current game first or click on reset!");
      return;
    } else {
      document.getElementById("game_grid").style.width = "1200px";
      document.getElementById("game_grid").style.height = "800px";
      addCard(24);
      newFetch();
      handleCardClick(150);
    }
  })

  //theme buttons
  document.getElementById("dark").addEventListener("click", function () {
    document.getElementById("game_grid").style.backgroundColor = "black";
  });
  document.getElementById("light").addEventListener("click", function () {
    document.getElementById("game_grid").style.backgroundColor = "white";
  });

}


// Add more cards
function addCard(cardLimit) {
  $("#game_grid").empty();
  let gameGrid = document.getElementById("game_grid");
  let cardCount = $(".card").length;

  for (let i = 1; i <= cardLimit; i++) {
    let card = document.createElement("div");
    card.className = "card";

    let img = document.createElement("img");
    img.id = `img${cardCount + i}`;
    img.className = "front_face";
    img.src = "";  // Use a placeholder image or update with actual image source
    img.alt = "";

    let backImg = document.createElement("img");
    backImg.className = "back_face";
    backImg.src = "back.webp";
    backImg.alt = "";

    card.appendChild(img);
    card.appendChild(backImg);

    gameGrid.appendChild(card);
  }
}


// get random pokemon images
async function newFetch() {
  console.log("cards.length", $(".card").length);

  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  let pokemon = response.data.results;
  console.log("pokemon.length", pokemon.length);

  let randomIndices = [];
  for (let i = 0; i < $(".card").length / 2; i++) {
    const randomNumber = Math.floor(Math.random() * pokemon.length) + 1;
    randomIndices.push(randomNumber);
  }
  randomIndices = randomIndices.concat(randomIndices);

  for (let i = randomIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomIndices[i], randomIndices[j]] = [randomIndices[j], randomIndices[i]];
  }

  console.log("randomIndices", randomIndices);

  for (let i = 1; i <= randomIndices.length; i++) {
    let randomIndex = randomIndices[i - 1];
    console.log("randomIndex", randomIndex);

    let res = await axios.get(`${pokemon[randomIndex].url}`);
    const pokemonName = res.data.name;
    res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    let imgTag = `<img id="img${i}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">`;
    document.getElementById(`img${i}`).outerHTML = imgTag;
  }

  // // Shuffle the cards
  // const cards = $(".card").toArray();
  // cards.forEach(card => {
  //   const randomPosition = Math.floor(Math.random() * cards.length);
  //   $(card).before(cards[randomPosition]);
  // });
}



// Event listener for clicking the card
const handleCardClick = function (timer) {

  // header info
  let totalPairs = $(".card").length / 2;
  let leftPairs = totalPairs;

  // Update count elementS
  $("#total").text(totalPairs);
  $("#clicks").text(clicks);
  $("#matches").text(matches);
  $("#left").text(leftPairs);

  // Function to start the timer
  let initialTime = timer; // Set the initial time in seconds
  let timeLeft = timer;
  let timerInterval; // Variable to store the interval ID

  const startTimer = () => {
    timerInterval = setInterval(() => {
      if (!isGameFinished) {
        timeLeft--;
        $("#time").text(initialTime - timeLeft);
        $("#timer").text(initialTime);
        $("#s").text(timeLeft === 1 ? "" : "s");

        if (timeLeft === 0) {
          clearInterval(timerInterval);
          setTimeout(() => {
            alert("Time's up! Try again!");
            window.location.reload();
          }, 500);
        }
      }
    }, 1000);
  };

  //start the game
  $("#start").on("click", () => {
    isGameStarted = true;
    startTimer();
    $("#start").hide();
    $("#info").show();
    $("#game_grid").show();
    $("#themes").show();
  });

  //card actions
  $(".card").on(("click"), function () {

    if ($(this).hasClass("match") || $(this).hasClass("flip") || isFlipping) { // Ignore clicks on already matched, flipped cards or during flipping
      return;
    }

    clicks++;
    $("#clicks").text(clicks); // Update "Number of Clicks" element


    $(this).toggleClass("flip");
    console.log("clicked");
    console.log(firstCard, secondCard);

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]

      // $(this).addClass("disabled");
      console.log(firstCard, secondCard);

      if (firstCard.src == secondCard.src) {
        console.log("match")

        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        $(`#${firstCard.id}`).parent().addClass("match");
        $(`#${secondCard.id}`).parent().addClass("match");

        firstCard = undefined;
        secondCard = undefined;

        matches++;
        $("#matches").text(matches); // Update "Number of matches" element

        leftPairs = totalPairs - matches; // Update "Number of pairs left" element
        $("#left").text(leftPairs);

        if (matches === $(".card").length / 2) {
          isGameFinished = true;
          setTimeout(() => {
            alert("You win! Try different difficulty level!");
            window.location.reload();
          }, 500);
        }

      } else {
        console.log("no match")
        console.log($(`#${firstCard.id} `));

        isFlipping = true;

        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          firstCard = undefined;
          secondCard = undefined;

          isFlipping = false;

        }, 1000)
      }
    }
  }
  )
};


$(document).ready(setup);




