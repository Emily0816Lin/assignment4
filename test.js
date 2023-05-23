// get random pokemon images
async function newFetch() {
    console.log("cards.length", $(".card").length);
  
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    let pokemon = response.data.results;
    console.log("pokemon.length", pokemon.length);
  
    let randomIndices = [];
    // while (randomIndices.length < $(".card").length / 2) {
    //   let randomIndex = Math.floor(Math.random() * pokemon.length);
    //   if (!randomIndices.includes(randomIndex)) {
    //     randomIndices.push(randomIndex);
    //   }
    //   console.log("randomIndex1", randomIndex);
    // }
    for (let i = 0; i < $(".card").length / 2; i++) {
      const randomNumber = Math.floor(Math.random() * pokemon.length) + 1;
      randomIndices.push(randomNumber);
    }
    randomIndices = randomIndices.concat(randomIndices);
    console.log("randomIndices", randomIndices);
  
    for (let i = 1; i <= $(".card").length; i++) {
    // for (let i = 0; i < randomIndices.length; i++) {
      let randomIndex = randomIndices[Math.floor((i - 1) / 2) % ($(".card").length / 2)];
      console.log("randomIndex2", randomIndex);
  
      // let randomIndex = randomIndices[i];
  
      let res = await axios.get(`${pokemon[randomIndex].url}`);
      const pokemonName = res.data.name;
      res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  
      let imgTag = `<img id="img${i}" class="front_face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">`;
      document.getElementById(`img${i}`).outerHTML = imgTag;
  
    }
  
    // Shuffle the cards
    const cards = $(".card").toArray();
    cards.forEach(card => {
      const randomPosition = Math.floor(Math.random() * cards.length);
      $(card).before(cards[randomPosition]);
    });
  }