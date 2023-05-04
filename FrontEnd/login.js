//RECUPERATION DES INFOS DE CONNEXION
const loginForm = document.querySelector("#logRequest");
const url = "http://localhost:5678/api/users/login";
const email = document.querySelector("#email");
const password = document.querySelector("#motdepasse");
const errorMessage = document.querySelector(".errorMessage")
let logged = false
let loginToken;

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  logginRequest()
});


//remplacer async/await par .then
function logginRequest() {
    const postMethod = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    }
    fetch(url, postMethod)
    .then((response) => response.json())
    .then((json) =>{
      localStorage.setItem("token", json.token)
      window.location.href = "./index.html"
    })
    .catch(() => errorMessage.classList.remove("hidden"))
  }
