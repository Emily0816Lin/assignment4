let firstpokeCard = undefined
let secondpokeCard = undefined
let isFlipping = false;
let isGameFinished = false;
let isGameStarted = false;
let matches = 0;
let clicks = 0;

const setup = async () => {

  newFetch();
  handlepokeCardClick(50);

  //Easy difficulty
  document.getElementById("option1").addEventListener("click", function () {
    if (isGameStarted && !isGameFinished) {
      alert("Please finish the current game first or click on reset!");
      return;
    } else {
      newFetch();
      handlepokeCardClick(50);
    }
  })

  //Medium difficulty
  document.getElementById("option2").addEventListener("click", function () {
    if (isGameStarted && !isGameFinished) {
      alert("Please finish the current game first or click on reset!");
      return;
    } else {
      document.getElementById("game_grid").style.width = "800px";
      document.getElementById("game_grid").style.height = "600px";
      addpokeCard(12);
      newFetch();
      handlepokeCardClick(100);
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
      addpokeCard(24);
      newFetch();
      handlepokeCardClick(150);
    }
  })

  //theme buttons
  document.getElementById("dark").addEventListener("click", function () {
    document.getElementById("game_grid").style.backgroundColor = "black";
  });
  document.getElementById("light").addEventListener("click", function () {
    document.getElementById("game_grid").style.backgroundColor = "white";
  });

  // Start button
  $("#start").on("click", function () {
    const difficulty = $("input[name='options']:checked").val();
    console.log("difficulty", difficulty);
    switch (difficulty) {
      case "easy":
        startGame(50); // Start the game with a timer of 50 seconds for easy difficulty
        break;
      case "medium":
        startGame(100); // Start the game with a timer of 100 seconds for medium difficulty
        break;
      case "hard":
        startGame(150); // Start the game with a timer of 150 seconds for hard difficulty
        break;
      default:
        break;
    }
  });
}


//start game
const startGame = (timer) => {

  isGameStarted = true;
  $("#start").hide();
  $("#info").show();
  $("#game_grid").show();
  $("#themes").show();

  let initialTime = timer; // Set the initial time in seconds
  let timeLeft = timer;
  setInterval(() => {
    if (!isGameFinished) {
      timeLeft--;
      $("#time").text(initialTime - timeLeft);
      $("#timer").text(initialTime);
      $("#s").text(timeLeft === 1 ? "" : "s");

      if (timeLeft === 0) {
        // clearInterval(timerInterval);
        setTimeout(() => {
          alert("Time's up! Try again!");
          window.location.reload();
        }, 500);
      }

      //Power Up
      if (timeLeft % 25 === 0) {
        alert("Power Up!");
        $(".pokecard").addClass("flip");

        setTimeout(() => {
          $(".pokecard").each(function () {
            if (!$(this).hasClass("match") && $(this).find(".front_face")[0] !== firstpokeCard) {
              $(this).removeClass("flip");
            }
          });
        }, 1000);
      }
    }
  }, 1000);
}





// clicking the pokecards
const handlepokeCardClick = function (timer) {

  // header info
  let totalPairs = $(".pokecard").length / 2;
  let leftPairs = totalPairs;

  // Update count elementS
  $("#total").text(totalPairs);
  $("#clicks").text(clicks);
  $("#matches").text(matches);
  $("#left").text(leftPairs);

  //pokecard actions
  $(".pokecard").on(("click"), function () {

    if ($(this).hasClass("match") || $(this).hasClass("flip") || isFlipping) { // Ignore clicks on already matched, flipped pokecards or during flipping
      return;
    }

    clicks++;
    $("#clicks").text(clicks); // Update "Number of Clicks" element


    $(this).toggleClass("flip");
    console.log("clicked");
    console.log("0_firstpokeCard", firstpokeCard);
    console.log("0_secondpokeCard", secondpokeCard);

    if (!firstpokeCard) {
      firstpokeCard = $(this).find(".front_face")[0]
      console.log("1_firstpokeCard", firstpokeCard);
      console.log("1_secondpokeCard", secondpokeCard);


    } else {
      secondpokeCard = $(this).find(".front_face")[0]

      // $(this).addClass("disabled");
      console.log("2_firstpokeCard", firstpokeCard);
      console.log("2_secondpokeCard", secondpokeCard);

      if (firstpokeCard.src == secondpokeCard.src) {
        console.log("match")

        $(`#${firstpokeCard.id}`).parent().off("click")
        $(`#${secondpokeCard.id}`).parent().off("click")
        $(`#${firstpokeCard.id}`).parent().addClass("match");
        $(`#${secondpokeCard.id}`).parent().addClass("match");

        firstpokeCard = undefined;
        secondpokeCard = undefined;

        matches++;
        $("#matches").text(matches); // Update "Number of matches" element

        leftPairs = totalPairs - matches; // Update "Number of pairs left" element
        $("#left").text(leftPairs);

        if (matches === $(".pokecard").length / 2) {
          isGameFinished = true;
          setTimeout(() => {
            alert("You win! Try different difficulty level!");
            window.location.reload();
          }, 500);
        }

      } else {
        console.log("no match")
        console.log($(`#${firstpokeCard.id} `));

        isFlipping = true;

        setTimeout(() => {
          $(`#${firstpokeCard.id}`).parent().toggleClass("flip")
          $(`#${secondpokeCard.id}`).parent().toggleClass("flip")
          firstpokeCard = undefined;
          secondpokeCard = undefined;

          isFlipping = false;

        }, 1000)
      }
    }
  }
  )
};





// Add more pokecards
function addpokeCard(pokecardLimit) {
  $("#game_grid").empty();
  let gameGrid = document.getElementById("game_grid");
  let pokecardCount = $(".pokecard").length;

  for (let i = 1; i <= pokecardLimit; i++) {
    let pokecard = document.createElement("div");
    pokecard.className = "pokecard";

    let img = document.createElement("img");
    img.id = `img${pokecardCount + i}`;
    img.className = "front_face";
    img.src = "";  // Use a placeholder image or update with actual image source
    img.alt = "";

    let backImg = document.createElement("img");
    backImg.className = "back_face";
    backImg.src = "back.webp";
    backImg.alt = "";

    pokecard.appendChild(img);
    pokecard.appendChild(backImg);

    gameGrid.appendChild(pokecard);
  }
}


// get random pokemon images
async function newFetch() {
  console.log("pokecards.length", $(".pokecard").length);

  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  let pokemon = response.data.results;
  console.log("pokemon.length", pokemon.length);

  let randomIndices = [];
  // for (let i = 0; i < $(".pokecard").length / 2; i++) {
  //   const randomNumber = Math.floor(Math.random() * pokemon.length) + 1;
  //   randomIndices.push(randomNumber);
  // }
  while (randomIndices.length < $(".pokecard").length / 2) {
    const randomNumber = Math.floor(Math.random() * pokemon.length) + 1;
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
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
}


$(document).ready(setup);




