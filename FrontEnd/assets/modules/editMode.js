import {displayModal} from './modal.js'

/*---------------------------------------------------------------GESTION DE LA CONNEXION*/
const body = document.querySelector("body")
const loginLink = document.querySelector(".loginLink");
const introFigure = document.querySelector("#introduction figure")
const projectsTitle = document.querySelector(".portfolio__title")
//Vérification de la présence du Token
function loginCheck() {
  if (localStorage.getItem("token") == null) {
    return;
  } else {
    createEditMode()
    loginLink.innerText = "logout";
    loginLink.addEventListener("click", listen);
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
  body.prepend(editHeader)
  editHeader.classList.add("edit")
  editIcon.classList.add("fa-solid")
  editIcon.classList.add("fa-pen-to-square")
  editText.innerText = "Mode édition"
  editSave.classList.add("edit__save")
  editSave.innerText = "publier les changements"
  //Création des Boutons "modifier"
  function createEditBtn(parent){
    let editBtn = document.createElement("a")
    let editBtnIcon = document.createElement("i")
    editBtn.classList.add("edit__button")
    editBtn.innerText = `modifier`
    editBtnIcon.classList.add("fa-solid")
    editBtnIcon.classList.add("fa-pen-to-square")
    editBtn.prepend(editBtnIcon)
    parent.appendChild(editBtn)
    editBtn.addEventListener("click", displayModal)
  }
  createEditBtn(introFigure)
  createEditBtn(projectsTitle)
}
//Déconnexion
function listen(e) {
  e.preventDefault();
  logout();
}
function logout() {
  localStorage.removeItem("token");
  loginLink.innerText = "login";
  loginLink.removeEventListener("click", logout);
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