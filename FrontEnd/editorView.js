const editHeader = document.querySelector(".edit")
const editButtons = document.getElementsByClassName(".editButton")

function editMode(){
    if (logged == true){
        editHeader.classList.remove("hidden")
        editButtons.classList.remove("hidden")
    }
}