const url = 'http://localhost:5678/api/works'
const gallery = document.querySelector('.gallery')
let works

//RECUPERATION DES DONNEES DE L'API
fetch(url)
.then((response) => response.json())
.then((data) => {
    works = data
    displayGallery(works)
})
.catch(function(error) {
  console.log(error);
});
//CREATION ET NESTING D'ELEMENTS HTML
function createNode(element) {
    return document.createElement(element)
}
function append(parent, child) {
    return parent.appendChild(child)
}
//AFFICHAGE DE LA GALLERIE
function displayGallery(displayedWorks){
    gallery.innerHTML = ""
    for (let work of displayedWorks){
        let figure = createNode('figure')
        let img = createNode('img')
        let figcaption = createNode('figcaption')
        append(figure, img)
        append(figure, figcaption)
        append(gallery, figure)
        figure.dataset.category = `${work.category.name}`
        img.src = work.imageUrl
        figcaption.innerHTML = `${work.title}`
    }
}
//FILTRAGE DES RESULTATS
const filterList = document.getElementsByClassName("filter")

for(let filter of filterList){
    filter.addEventListener('click', function(){
        let previousFilter = document.querySelector(".activeFilter")
        previousFilter.classList.remove("activeFilter")
        filter.classList.add("activeFilter")
        updateGallery()
    })
}
//MISE A JOUR DU CONTENU DE LA GALLERIE
function updateGallery(){
    let activeFilter = document.querySelector(".activeFilter")
    if (activeFilter.innerText != "Tous"){
        displayedWorks = works.filter(function(work){
            return work.category.name == activeFilter.innerText
        })
    }
    else{
        displayedWorks = works
    }
    displayGallery(displayedWorks)
}