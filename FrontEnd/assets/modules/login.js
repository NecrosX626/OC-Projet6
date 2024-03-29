import { url } from "../script.js";

const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#motdepasse");
const errorMessage = document.querySelector(".errorMessage");

function loginRequest() {
  const postMethod = {
    method: "POST",
    headers: {
      "accept" : "application/json",
      "Content-type" : "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    }),
  };
  fetch(url + "users/login", postMethod)
    .then((response) => {
      if (response.status !== 200){
        throw new Error(response.status)
      }
      else{
        return response.json()
      }
    })
    .then((json) => {
      localStorage.setItem("token", json.token);
      window.location.href = "./index.html";
    })
    .catch(() => errorMessage.classList.remove("hidden"));
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loginRequest();
});
