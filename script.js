const url = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
let works;
/*---------------------------------------------------------------AFFICHAGE ET FILTRAGE DES TRAVAUX*/
//Récupération des données de l'API
function getWorks(){
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    works = data;
    displayGallery(works);
  })
  .catch(function (error) {
    console.log(error);
  });
}
getWorks()
//Création et Nesting d'Elements HTML
function createNode(element) {
  return document.createElement(element);
}
function append(parent, child) {
  return parent.appendChild(child);
}
//Affichage de la galerie
function displayGallery(displayedWorks) {
  gallery.innerHTML = "";
  for (let work of displayedWorks) {
    let figure = createNode("figure");
    let img = createNode("img");
    let figcaption = createNode("figcaption");
    append(figure, img);
    append(figure, figcaption);
    append(gallery, figure);
    figure.dataset.category = work.category.name;
    figure.dataset.title = work.title;
    figure.id = work.id;
    img.src = work.imageUrl;
    figcaption.innerHTML = work.title;
  }
}
//Filtrage des Travaux
const filterList = document.getElementsByClassName("filter");
for (let filter of filterList) {
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
  editHeader.innerHTML = `${editHeaderSvg} Mode édition <a class="edit__save" href="#">publier les changements</a>`
  body.prepend(editHeader)
  //Création des Boutons "modifier"
  function createEditBtn(parent){
    let editBtn = createNode("a")
    editBtn.classList.add("edit__button")
    editBtn.href = "#"
    editBtn.innerHTML = `${editBtnSvg} modifier`
    editBtn.addEventListener("click", displayModal)
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

/*---------------------------------------------------------------CREATIONS ET UTILISATION DES MODALES*/
const modal = document.querySelector('.modal')
const modalHead = document.querySelector('.modal__head')
const modalTitle = document.querySelector('.modal__head h3')
const modalIcons = document.querySelector('.modal__head .icons')
const modalContent = document.querySelector(".modal__content")
const modalClose = document.querySelector(".cross")
const modalActionBtn = document.querySelector(".modal__actions .btn")
const deleteMsg = document.querySelector(".modal__actions .delete")

//Fermeture de la Modale
modalClose.addEventListener('click', function(){
  modal.classList.add('hidden')
})
  //MODALE A
//Ouverture de la Modale
function displayModal(){
  modal.classList.remove('hidden')
  displayModalA(works)
}
//Création du contenu de la Modale A (Galerie)
function displayModalA(displayedWorks) {
  modalContent.innerHTML = "";
  for (let work of displayedWorks) {
    let figure = createNode("figure");
    let img = createNode("img");
    let figcaption = createNode("figcaption");
    let deleteIcon = createNode("a");
    append(figure, img);
    append(figure, figcaption);
    append(figure, deleteIcon);
    append(modalContent, figure);
    deleteIcon.id = work.id
    img.src = work.imageUrl;
    figcaption.innerHTML = `<a class="modal__editBtn" href="#">éditer</a>`;
    deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
    deleteIcon.classList.add('modal__deleteIcon')
    deleteIcon.href = "#"
  }
  setModalAFunction()
}
//Fonctionnalitées de la Modale A
function setModalAFunction(){
  const deleteBtns = document.querySelectorAll(".modal__deleteIcon")
  for (let deleteBtn of deleteBtns){
    deleteBtn.addEventListener("click", deleteWork)
  }
  const addImg = document.querySelector('.modal__actions .btn')
  addImg.addEventListener('click', displayModalB)
}
//Requete de Suppression
function deleteWork(){
  let token = localStorage.getItem("token")
  const deleteMethod = {
    method: 'DELETE',
    headers: {'Authorization': `Bearer ${token}`}
  }
  fetch(`http://localhost:5678/api/works/${this.id}`, deleteMethod)
    .then(() => getWorks)
    .catch(function (error) {
      console.log(error);
    });
}
  //MODALE B
//Transition à la Modale B
function displayModalB(){
  //Mise à jour du Head
  modalIcons.classList.remove("modal1")
  modalTitle.innerText = "Ajout photo"
  let arrow = createNode("a")
  arrow.classList.add("arrow")
  arrow.href="#"
  arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>'
  modalIcons.prepend(arrow)
  //Mise à Jour du Contenu
  modalContent.innerHTML = ""
  let div = createNode("div")
  let label = createNode("label")
  let input = createNode("input")
  let icon = createNode("span")
  let imgReq = createNode("span")
  append(modalContent, div)
  append(div, icon)
  append(div, label)
  append(div, input)
  append(div, imgReq)
  div.classList.add('addImg')
  icon.classList.add('imgIcon')
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#858585" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>'
  label.for = 'img'
  label.innerText = '+ Ajouter photo'
  input.classList.add('imgInput')
  input.type = "file"
  input.id = "img"
  input.name = "img"
  input.accept = "image/png, image/jpeg"
  imgReq.classList.add('imgReq')
  
  //Mise à jour des Actions
  modalActionBtn.innerText = "Valider"
  modalActionBtn.classList.add("btn--disabled")
  deleteMsg.remove()
}