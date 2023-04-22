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
async function logginRequest() {
    const r = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      headers: {
        accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(r.ok == true){
        return r.json()
        .then(json =>{
          localStorage.setItem("token", json.token)
          window.location.href = "./index.html"
        })
    }
    else{
      errorMessage.classList.remove("hidden")
    }
  }


// loginForm.addEventListener('submit', function(e){
//     e.preventDefault()
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify({
//             email: `${email.value}`,
//             password: `${password.value}`
//         }),
//         headers: {
//             "accept": "application/json",
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     })
//     .then(response => response.json(), error => error.json())
//     .then(json => {
//         console.log(json)
//         loginToken = json.token
//         // window.location.href = "./index.html"
//     })
// })