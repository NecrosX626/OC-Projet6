const url = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
let works;
//RECUPERATION DES DONNEES DE L'API
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    works = data;
    displayGallery(works);
  })
  .catch(function (error) {
    console.log(error);
  });
//CREATION ET NESTING D'ELEMENTS HTML
function createNode(element) {
  return document.createElement(element);
}
function append(parent, child) {
  return parent.appendChild(child);
}
//AFFICHAGE DE LA GALLERIE
function displayGallery(displayedWorks) {
  gallery.innerHTML = "";
  for (let work of displayedWorks) {
    let figure = createNode("figure");
    let img = createNode("img");
    let figcaption = createNode("figcaption");
    append(figure, img);
    append(figure, figcaption);
    append(gallery, figure);
    figure.dataset.category = `${work.category.name}`;
    img.src = work.imageUrl;
    figcaption.innerHTML = `${work.title}`;
  }
}
//FILTRAGE DES RESULTATS
const filterList = document.getElementsByClassName("filter");

for (let filter of filterList) {
  filter.addEventListener("click", function () {
    let previousFilter = document.querySelector(".activeFilter");
    previousFilter.classList.remove("activeFilter");
    filter.classList.add("activeFilter");
    updateGallery();
  });
}
//MISE A JOUR DU CONTENU DE LA GALLERIE
function updateGallery() {
  let activeFilter = document.querySelector(".activeFilter");
  if (activeFilter.innerText != "Tous") {
    displayedWorks = works.filter(function (work) {
      return work.category.name == activeFilter.innerText;
    });
  } else {
    displayedWorks = works;
  }
  displayGallery(displayedWorks);
}

/*---------------------------------------------------------------GESTION DE LA CONNEXION*/
const body = document.querySelector("body")
const introFigure = document.querySelector("#introduction figure")
const projectsTitle = document.querySelector(".portfolio__title")
const loginAction = document.querySelector(".loginAction");
const editHeaderSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>'
const editBtnSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>'

//Vérification de la présence du Token
function loginCheck() {
  if (localStorage.getItem("token") == null) {
    return;
  } else {
    createEditMode()
    loginAction.innerText = "logout";
    loginAction.addEventListener("click", listen);
  }
}
//Déconnexion
function listen(e) {
  e.preventDefault();
  logout();
}
function logout() {
  localStorage.removeItem("token");
  loginAction.innerText = "login";
  loginAction.removeEventListener("click", listen);
  deleteEditMode()
}
//Mode Edition
function createEditMode(){
  //Création du Bandeau
  let editHeader = createNode("div")
  editHeader.classList.add("edit")
  editHeader.innerHTML = `${editHeaderSvg} Mode édition <span class="edit__save">publier les changements</span>`
  body.prepend(editHeader)
  //Création des Boutons "modifier"
  function createEditBtn(parent){
    let editBtn = createNode("a")
    editBtn.classList.add("edit__button")
    editBtn.href = "#"
    editBtn.innerHTML = `${editBtnSvg} modifier`
    append(parent, editBtn)
  }
  createEditBtn(introFigure)
  createEditBtn(projectsTitle)
}
function deleteEditMode(){
  //Suppression du Bandeau
  const editHeader = document.querySelector(".edit")
  editHeader.remove()
  //Suppression des Boutons
  const editBtns = document.querySelectorAll(".edit__button")
  for (let editBtn of editBtns){
    editBtn.remove()
  }
}
loginCheck();
/*----------------------------------------------------------------MODALES*/