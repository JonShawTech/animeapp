function handleSearch() {  

  var animeID = document.getElementById("anime_search").value;
  var selection = document.getElementById("userSelection").value;
  
  searchAPI(selection, animeID)
 
 
}

function search() {  
  var id = window.location.hash.substring(1,6);
  var selection = window.location.hash.substring(6);
  console.log(id);
  console.log(selection);

  
  searchAPI(id, selection)
 
 
}

function searchAPI(selection, animeID) {
  fetch("https://api.jikan.moe/v3/search/" + selection + "?q=" + animeID + "&page=1")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displaySearchResults(data.results);
      passValues(data.results);
    });
}

function loadDefault() {
  fetch("https://api.jikan.moe/v3/top/manga/1")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data)
    
    passValues(data.top);
  
    var mangaContainer = document.getElementById("manga-results");
    data = data.top.slice(0,5);
  
    
      mangaContainer.innerHTML = data.map((manga) => {
        return `<a href="./anime.html#${manga.mal_id}"><div class="results-title"><img src="${manga.image_url}" </div> <div class="">${manga.title}</div></div>`;
      })
      .join("");


    
  });

  fetch("https://api.jikan.moe/v3/top/anime/1")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data)
  
    passValues(data.top);
    var resultsContainer = document.getElementById("anime-results");
    data = data.top.slice(0,5);
    
  
    
    resultsContainer.innerHTML = data.map((anime) => {
      return `<a href="./anime.html#${anime.mal_id}"><div class="results-title"><img src="${anime.image_url}" </div> <div class="">${anime.title}</div></div>`;
    })
    .join("");

    
  });



  
  

}

function searchTop(type,x,y) {
    fetch("https://api.jikan.moe/v3/top/" + type + "/1")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        displaySearchResults(data.top.slice(x,y));
        passValues(data.top);
      });
}
function loadTopAnime() {
    searchTop("anime",0,50)
}

function loadTopManga() {
    searchTop("manga",0,50)
}

function passValues(data) {

  if(data[0].type==="Manga" || data[0].type === "Novel" || data[0].type === "One-Piece" || data[0].type === "Manhwa") {
  
   let mangaSerialized = JSON.stringify(data);
   localStorage.setItem("manga", mangaSerialized);  
   let mangaDeserialized = JSON.parse(localStorage.manga);
   console.log(mangaDeserialized);
  } else {

  let animeSerialized = JSON.stringify(data); 
  localStorage.setItem("anime", animeSerialized); 
  let animeDeserialized = JSON.parse(localStorage.anime);
  console.log(animeDeserialized);

  } 

 }

function displaySearchResults(data) {
  var resultsContainer = document.getElementById("anime-results");
  var mangaContainer = document.getElementById("manga-results");

 
    resultsContainer.innerHTML = data.map((result) => {
      return `<a href="./anime.html#${result.mal_id}"><div class="results-title"><img src="${result.image_url}" </div> <div class="">${result.title}</div></div>`;
    })
    .join("");

  }




function displayNewPage() {
  var animeID;
 
  var mangaID;

  var resultsContainer = document.getElementById("anime-result");
  var arr = [];
  let animeData = JSON.parse(localStorage.anime);
  let mangaData = JSON.parse(localStorage.manga);
  console.log(animeData)
  console.log(mangaData)
  for (let i = 0; i < animeData.length; i++) {
    if (animeData[i].mal_id.toString() === window.location.hash.substring(1).toString() 
    ) {
      arr.push(animeData[i]);
      animeID = animeData[i].mal_id;
     
    } if (mangaData[i].mal_id.toString() === window.location.hash.substring(1).toString())  {
      arr.push(mangaData[i]);
      mangaID = mangaData[i].mal_id;
      console.log(mangaID)
    }
  }
  console.log(arr[0]);

  if (arr[0].type === "Manga" || arr[0].type === "Novel" || arr[0].type === "One-Piece" || arr[0].type === "Manhwa") { //if this is a Manga
  fetch("https://api.jikan.moe/v3/manga/" + mangaID)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    arr=[];
    arr.push(data)
    console.log(data);  
      resultsContainer.innerHTML = arr.map((manga) => {
        return `<div class="title">${manga.title}</div> <div><img src="${manga.image_url}"/></div><div class="syn">${manga.synopsis}</div><div><b>Author: </b>${manga.authors[0].name}</div>
        <div><b>Score: </b> ${manga.score} <div><div><b>Chapters:</b>  ${manga.chapters} </div><div><b>Volumes:</b>  ${manga.volumes} </div>
        <div><b>Genre:</b> ${data.genres[0].name}</div><div><b>Published:</b> ${data.published.prop.from.month}/${data.published.prop.from.day}/${data.published.prop.from.year}
        to ${data.published.prop.to.month}/${data.published.prop.to.day}/${data.published.prop.to.year}</div>`;
        
     }).join("");
    });
  
  } else { // if this is an Anime
    fetch("https://api.jikan.moe/v3/anime/" + animeID) 
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        resultsContainer.innerHTML = arr.map((anime) => {
            return `<div class="title">${anime.title}</div> <div><img src="${anime.image_url}"/></div><div class="syn">${data.synopsis}</div><div><b>Number of episodes:</b> ${anime.episodes} <div>
        <div class=""><b>Rating:</b>  ${data.rating} </div>  <div><b>Score:</b>  ${data.score} </div> <div><b>Aired:</b> ${data.aired.prop.from.month}/${data.aired.prop.from.day}/${data.aired.prop.from.year}
         to ${data.aired.prop.to.month}/${data.aired.prop.to.day}/${data.aired.prop.to.year}</div><div><b>Genre:</b> ${data.genres[0].name}</div>`;
          }).join("");
          
      });
  }

}
