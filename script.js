const url = "http://localhost:5678/api/";
const gallery = document.querySelector(".gallery");
let works;
let categoriesList
/*---------------------------------------------------------------AFFICHAGE ET FILTRAGE DES TRAVAUX*/
//Récupération des données de l'API
function getWorks(){
  fetch(url + "works")
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
let token = localStorage.getItem("token")

/*---------------------------------------------------------------CREATIONS ET UTILISATION DES MODALES*/
const modalA = document.querySelector('.modalA')
const modalAClose = document.querySelector('.modalA .cross')
const modalAContent = document.querySelector('.modalA .content')
const modalADelete = document.querySelector('.modalA .delete')
  //MODALE A
//Fermeture de la Modale A
modalAClose.addEventListener('click', function(){
  modalA.classList.add('hidden')
})
//Ouverture de la Modale
function displayModal(){
  modalA.classList.remove('hidden')
  displayModalA(works)
}
//Création du contenu de la Modale A (Galerie)
function displayModalA(displayedWorks) {
  modalAContent.innerHTML = "";
  for (let work of displayedWorks) {
    let figure = createNode("figure");
    let img = createNode("img");
    let figcaption = createNode("figcaption");
    let deleteIcon = createNode("a");
    append(figure, img);
    append(figure, figcaption);
    append(figure, deleteIcon);
    append(modalAContent, figure);
    deleteIcon.id = work.id
    img.src = work.imageUrl;
    figcaption.innerHTML = `<a class="editBtn" href="#">éditer</a>`;
    deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
    deleteIcon.classList.add('deleteIcon')
    deleteIcon.href = "#"
  }
  setModalAFunction()
}
//Fonctionnalitées de la Modale A
function setModalAFunction(){
  const deleteBtns = document.querySelectorAll(".deleteIcon")
  for (let deleteBtn of deleteBtns){
    deleteBtn.addEventListener("click", deleteWork)
  }
  const addImg = document.querySelector('.modalA .btn')
  addImg.addEventListener('click', displayModalB)
}
//Requete de Suppression
function deleteWork(){
  const deleteMethod = {
    method: 'DELETE',
    headers: {'Authorization': `Bearer ${token}`}
  }
  fetch(`${url}works/${this.id}`, deleteMethod)
    .then(() => getWorks)
    .catch(function (error) {
      console.log(error);
    });
}

const modalB = document.querySelector('.modalB')
const modalBBack = document.querySelector('.modalB .arrow')
const modalBClose = document.querySelector('.modalB .cross')
const modalBContent = document.querySelector('.modalB .content')
  //MODALE B
//Fermeture de la Modale B
modalBClose.addEventListener('click', function(){
  modalB.classList.add('hidden')
})
//Transition à la Modale B
function displayModalB(){
  //Remplacement de la Modale Affichée
  modalA.classList.add('hidden')
  modalB.classList.remove('hidden')

  //Retour à la Modale A
  modalBBack.addEventListener('click', function(){
    modalA.classList.remove('hidden')
    modalB.classList.add('hidden')
  })
}
//Formulaire d'ajout de Travaux
const titleInput = document.querySelector('.modalB #title')
const imgInput = document.querySelector('.modalB #img')
const categoryInput = document.querySelector('.modalB #categorySelect')
const submitForm = document.querySelector('.modalB .btn')
const imgAddBox = document.querySelector('.modalB .imgAdd')
let imgURL
let catID
resetForm()
//Chargement d'une Image
imgInput.addEventListener('change', function(){
  const newImg = imgInput.files
  // console.log(URL.createObjectURL(newImg[0]))
  displayPreview(newImg[0])
})
//Prévisualisation de l'Image
function displayPreview(img){
  if(img.value == ""){
    return
  }
  imgURL = URL.createObjectURL(img)
  let preview = `<img src="${imgURL}" alt="preview">`
  let previewBox = createNode("output")
  let closePreview = createNode("a")
  modalBContent.prepend(previewBox)
  previewBox.prepend(closePreview)
  previewBox.innerHTML = preview
  if(previewBox.innerHTML != ""){
    imgAddBox.classList.add("hidden")
  }
  //Suppression de la Preview
  previewBox.addEventListener('click', function(){
    imgInput.value = ""
    imgAddBox.classList.remove("hidden")
    previewBox.remove()
  })
}
//Activation du Bouton de Submit
if(titleInput.value != "" && imgInput.value != "" && categoryInput.value !=""){
  submitForm.classList.remove("disabled")
  console.log(imgInput.value)
}
else{
  submitForm.classList.add("disabled")
}

//Reinitialisation du Formulaire
function resetForm(){
  imgInput.value = ""
  titleInput.value = ""
  categoryInput.value = ""
}
//Attribution de la Catégorie
categoryInput.addEventListener('change', function(){
  fetch(url + "categories")
  .then((response) => response.json())
  .then((data) => {
    categoriesList = data
    console.log(categoriesList)
  })
  .then(() => {
    switch (categoryInput.value){
      case "Objets" :
        catID = 1
        break;
      case "Appartement" :
        catID = 2
        break;
      case "Hotels & restaurants" :
        catID = 3
        break;
    }
    console.log(catID)
  })
})
//Envoi du Nouvel Element à l'API
modalBContent.addEventListener("submit", function(e){
  e.preventDefault();
  addWork()
})
function addWork(){
  const postMethod = {
    method: 'POST',
    headers: {
      accept: "application/json",
      "Content-type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      "title": titleInput.value,
      "image": imgURL,
      "categoryId": catID
    }),
  }
  const r = fetch(url + "works", postMethod)
  console.log(r)
}