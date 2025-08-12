var button = document.getElementById("enter");
var input = document.getElementById("userinput");
var ul = document.querySelector("ul");

function inputLength() {
  return input.value.trim().length;
}

function addDeleteButton(li) {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);
}

function createListElement() {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(input.value + " "));
  addDeleteButton(li);
  ul.appendChild(li);
  input.value = "";
}

function addList() {
  if (inputLength() > 0) {
    createListElement();
  }
}

function listControl(e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("done");
  } else if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove();
  }
}

button.addEventListener("click", addList);

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addList();
  }
});

ul.addEventListener("click", listControl);

// Tambahkan delete button ke item yang sudah ada sebelumnya
const existingItems = ul.querySelectorAll("li");
existingItems.forEach(li => addDeleteButton(li));


// YANG DI BAWAH ADALAH HASIL UPAYA SENDIRI

// var button = document.getElementById("enter")
// var input = document.getElementById("userinput")
// var ul = document.querySelector("ul")

// function inputLength() {
// 	return input.value.length;
// };

// function createListElement() {
// 	var li = document.createElement("li");
// 	var delBtn = document.createElement("button");
// 	li.appendChild(document.createTextNode(input.value + " "));
// 	delBtn.textContent = "Hapus";
// 	li.appendChild(delBtn);
// 	ul.appendChild(li);
// 	input.value = "";
// };

// function addListAfterClick() {
// 	if (inputLength() > 0) {
// 		createListElement();
// 	}
// };

// function addListAfterEnter(e) {
// 	if (inputLength() > 0 && event.keyCode === 13) {
// 		createListElement();
// 	}
// };

// function listControl(e) {
// 	if (e.target.tagName === "LI") {
// 		e.target.classList.toggle("done");
// 	} else if (e.target.tagName === "BUTTON") {
// 		e.target.parentElement.remove();
// 	}
// };

// button.addEventListener("click", addListAfterClick);

// input.addEventListener("keypress", addListAfterEnter);

// ul.addEventListener("click", listControl);