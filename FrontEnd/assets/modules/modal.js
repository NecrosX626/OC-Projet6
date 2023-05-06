/*---------------------------------------------------------------CREATIONS ET UTILISATION DES MODALES*/
import { url } from "../script.js"
import { worksArray } from "../script.js"
import { getWorks } from "../script.js"
const modals = document.querySelectorAll(".modal")
const modalWrappers = document.querySelectorAll(".modal .wrapper")
const modalsExit = document.querySelectorAll(".modal .cross")
let token
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
const modalA = document.querySelector('.modalA')
const modalAContent = document.querySelector('.modalA .content')
const modalADelete = document.querySelector('.modalA .delete')
//Ouverture de la Modale
export function displayModal(){
  modalA.classList.remove('hidden')
  createModalA()
}
//Création du contenu de la Modale A (Galerie)
function createModalA() {
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
  addImg.addEventListener('click', switchToModalB)
}
//Requete de Suppression
function deleteWork(selectedWork){
  token = localStorage.getItem("token")
  const deleteMethod = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    }
  }
  fetch(`${url}works/${selectedWork.dataset.id}`, deleteMethod)
  .then(check401)
  .then(() => {
    getWorks().then(() => displayModal())
  })
  .catch(function (error) {
    console.log(error);
  });
}
//MODALE B
const modalB = document.querySelector('.modalB')
const modalBBack = document.querySelector('.modalB .arrow')
const modalBContent = document.querySelector('.modalB .content')
//Transition d'une Modale à l'autre
function switchToModalB(){
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
  token = localStorage.getItem("token")
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
  .then(check401)
  .then(() => refreshForm())
}
//Check 401
function check401(r){
  if(r.status === 401){
    logout()
    alert("Session expirée")
    window.location.href = "./login.html"
  }
}
//Reinitialisation du Formulaire
function refreshForm(){
  closePreview()
  titleInput.value = ""
  categoryInput.value = ""
  checkForm()
  getWorks()
}