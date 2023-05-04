const url = "http://localhost:5678/api/";
/*---------------------------------------------------------------AFFICHAGE ET FILTRAGE DES TRAVAUX*/
const gallery = document.querySelector(".gallery");
let worksArray;
let categoriesList
//Récupération des données de l'API
function getWorks(){
  fetch(url + "works")
  .then((response) => response.json())
  .then((data) => {
    worksArray = data;
    displayGallery(worksArray);
  })
  .catch(function (error) {
    console.log(error);
  });
}
getWorks()
//Affichage de la galerie
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
/*---------------------------------------------------------------GESTION DE LA CONNEXION*/
const body = document.querySelector("body")
const introFigure = document.querySelector("#introduction figure")
const projectsTitle = document.querySelector(".portfolio__title")
const loginLink = document.querySelector(".loginLink");
const editHeaderSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>'
const editBtnSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>'
//Vérification de la présence du Token
function loginCheck() {
  if (localStorage.getItem("token") == null) {
    return;
  } else {
    createEditMode()
    loginLink.innerText = "logout";
    loginLink.addEventListener("click", logout); //Remplacer "logout" par "listen" pour ne pas retourner a la page de connexion apres une déco
  }
}
//Mode Edition
function createEditMode(){
  //Création du Bandeau
  let editHeader = document.createElement("div")
  let editIcon = document.createElement("i")
  let editText = document.createElement("span")
  let editSave = document.createElement("a")
  editHeader.appendChild(editIcon)
  editHeader.appendChild(editText)
  editHeader.appendChild(editSave)
  editHeader.classList.add("edit")
  editIcon.classList.add("fa-solid")
  editIcon.classList.add("fa-pen-to-square")
  editText.innerText = "Mode édition"
  editSave.classList.add("edit__save")
  editSave.innerText = "publier les changements"
  body.prepend(editHeader)
  //Création des Boutons "modifier"
  function createEditBtn(parent){
    let editBtn = document.createElement("a")
    let editBtnIcon = document.createElement("i")
    editBtn.classList.add("edit__button")
    editBtn.innerText = `modifier`
    editBtnIcon.classList.add("fa-solid")
    editBtnIcon.classList.add("fa-pen-to-square")
    editBtn.prepend(editBtnIcon)
    editBtn.addEventListener("click", displayModal)
    parent.appendChild(editBtn)
  }
  createEditBtn(introFigure)
  createEditBtn(projectsTitle)
}
//Déconnexion
// function listen(e) {
//   e.preventDefault();
//   logout();
// } (Décommenter pour ligne 73)
function logout() {
  localStorage.removeItem("token");
  loginLink.innerText = "login";
  loginLink.removeEventListener("click", listen);
  deleteEditMode()
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
const modals = document.querySelectorAll(".modal")
const modalWrappers = document.querySelectorAll(".modal .wrapper")
const modalsExit = document.querySelectorAll(".modal .cross")
const modalA = document.querySelector('.modalA')
const modalAContent = document.querySelector('.modalA .content')
const modalADelete = document.querySelector('.modalA .delete')
//Fermeture des Modales
function stopPropag(e){
  e.stopPropagation()
}
for (let modal of modals){
  modal.addEventListener('click', function(){
    modal.classList.add('hidden')
  })
}
for (let wrapper of modalWrappers){
  wrapper.addEventListener('click', stopPropag)
}
for (let exitBtn of modalsExit){
  exitBtn.addEventListener('click', function(){
    let activeModal = exitBtn.closest(".modal")
    activeModal.classList.add('hidden')
  })
}
//MODALE A
//Ouverture de la Modale
function displayModal(){
  modalA.classList.remove('hidden')
  displayModalA()
}
//Création du contenu de la Modale A (Galerie)
function displayModalA() {
  modalAContent.innerHTML = "";
  let displayedWorks = worksArray
  for (let work of displayedWorks) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    let moveIcon = document.createElement("i")
    let deleteIcon = document.createElement("a");
    figure.appendChild(img);
    figure.appendChild(figcaption)
    figure.appendChild(moveIcon)
    figure.appendChild(deleteIcon)
    modalAContent.appendChild(figure)
    figure.dataset.title = work.title
    img.src = work.imageUrl;
    figcaption.innerHTML = `<a class="editBtn" href="#">éditer</a>`;
    moveIcon.classList.add('fa-solid')
    moveIcon.classList.add('fa-arrows-up-down-left-right')
    deleteIcon.dataset.id = work.id
    deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
    deleteIcon.classList.add('deleteIcon')
  }
  setModalAFunction()
}
//Fonctionnalitées de la Modale A
function setModalAFunction(){
  //Boutons de suppression individuels
  const deleteBtns = document.querySelectorAll(".deleteIcon")
  for (let deleteBtn of deleteBtns){
    deleteBtn.addEventListener("click", function(){
      deleteWork(deleteBtn)
    })
  }
  //Bouton de suppression globale
  modalADelete.addEventListener("click", function(){
    for (let deleteBtn of deleteBtns){
      deleteWork(deleteBtn)
      console.log("Gallery Deleted")
    }
  })
  //Bouton pour passer à la ModaleB
  const addImg = document.querySelector('.modalA .btn')
  addImg.addEventListener('click', displayModalB)
}
//Requete de Suppression
function deleteWork(selectedWork){
  const deleteMethod = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    }
  }
  fetch(`${url}works/${selectedWork.dataset.id}`, deleteMethod)
  .then(async() => {
    await fetch(url + "works") //Ou bien passer getWorks en Async directement ??
    .then((response) => response.json())
    .then((data) => {
      worksArray = data;
      displayGallery(worksArray);
    })
    .catch(function (error) {
      console.log(error);
    })
    displayModal()
  })
  .catch(function (error) {
    console.log(error);
  });
}
const modalB = document.querySelector('.modalB')
const modalBBack = document.querySelector('.modalB .arrow')
const modalBClose = document.querySelector('.modalB .cross')
const modalBContent = document.querySelector('.modalB .content')
//MODALE B
//Transition d'une Modale à l'autre
function displayModalB(){
  //Modale A vers Modale B
  modalA.classList.add('hidden')
  modalB.classList.remove('hidden')
  //Modale B vers Modale A
  modalBBack.addEventListener('click', function(){
    modalB.classList.add('hidden')
    displayModal()
  })
}
//Formulaire d'ajout de Travaux
const imgInput = document.querySelector('.modalB #img')
const titleInput = document.querySelector('.modalB #title')
const categoryInput = document.querySelector('.modalB #categorySelect')
const submitForm = document.querySelector('.modalB .btn')
const imgAddBox = document.querySelector('.modalB .imgAdd')
let catID
refreshForm()
//Chargement d'une Image
imgInput.addEventListener('change', function(){
  checkForm()
  const newImg = imgInput.files[0]
  displayPreview(newImg)
})
//Prévisualisation de l'Image
function displayPreview(img){
  // if(img.value == ""){
  //   return
  // }
  let previewBox = document.createElement("output")
  let preview = document.createElement("img")
  modalBContent.prepend(previewBox)
  previewBox.prepend(preview)
  preview.src = URL.createObjectURL(img)
  preview.alt = "preview"
  if(previewBox.innerHTML != ""){
    imgAddBox.classList.add("hidden")
  }
  //Suppression de la Preview
  previewBox.addEventListener('click', closePreview)
}
function closePreview(){
  if (imgInput.value != ""){
    let previewBox = document.querySelector('output')
    previewBox.remove()
  }
  imgInput.value = ""
  imgAddBox.classList.remove("hidden")
}
//Activation du Bouton de Submit
function checkForm(){
  if(titleInput.value != "" && imgInput.value != "" && categoryInput.value !=""){
    submitForm.classList.remove("disabled")
  }
  else{
    submitForm.classList.add("disabled")
  }
}
titleInput.addEventListener("change", checkForm)
//Attribution de la Catégorie
categoryInput.addEventListener('change', function(){
  checkForm()
  fetch(url + "categories")
  .then((response) => response.json())
  .then((data) => {
    categoriesList = data
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
  })
})
//Envoi du Nouvel Element à l'API
modalBContent.addEventListener("submit", function(e){
  e.preventDefault();
  addWork()
  return false // ???
})
function addWork(){
  const workData = new FormData()
  workData.append("title", titleInput.value) 
  workData.append("image", imgInput.files[0])
  workData.append("category", catID) 
  const postMethod = {
    method: 'POST',
    headers: {
      accept: "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: workData,
  }
  fetch(url + "works", postMethod)
  .then(() => console.log("Work Added"))
  .then(() => refreshForm())
}
//Reinitialisation du Formulaire
function refreshForm(){
  closePreview()
  titleInput.value = ""
  categoryInput.value = ""
  checkForm()
  getWorks()
}