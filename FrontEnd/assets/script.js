export const url = "http://localhost:5678/api/";
export let worksArray;
export function getWorks(){
  return fetch(url + "works")
  .then((response) => response.json())
  .then((data) => {
    worksArray = data;
    displayGallery(worksArray);
  })
  .catch(function (error) {
    console.log(error);
  });
}
//Affichage de la Galerie
const gallery = document.querySelector(".gallery");

getWorks()

function displayGallery(displayedWorks) {
  gallery.innerHTML = "";
  for (let work of displayedWorks) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    figure.appendChild(img)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
    figure.dataset.category = work.category.name;
    figure.dataset.title = work.title;
    figure.id = work.id;
    img.src = work.imageUrl;
    figcaption.innerHTML = work.title;
  }
}

//Filtrage des Travaux
const filtersList = document.getElementsByClassName("filter");
for (let filter of filtersList) {
  filter.addEventListener("click", function () {
    let previousFilter = document.querySelector(".activeFilter");
    previousFilter.classList.remove("activeFilter");
    filter.classList.add("activeFilter");
    updateGallery();
  });
}
function updateGallery() {
  let activeFilter = document.querySelector(".activeFilter");
  if (activeFilter.innerText != "Tous") {
    displayedWorks = worksArray.filter(function (work) {
      if(work.category.name == activeFilter.innerText){
        return work
      }
    });
  } else {
    displayedWorks = worksArray;
  }
  displayGallery(displayedWorks);
}