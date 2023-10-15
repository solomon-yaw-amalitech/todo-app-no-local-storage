"use strict";

// Initialize the list of items
let items = [];

// Dark Mode
document
  .getElementById("toggle-checkbox")
  .addEventListener("change", function () {
    document.body.classList.toggle("dark");
    document.querySelector(".list_footer").classList.toggle("list-dark");
    document.querySelector(".header").classList.toggle("bg-image");
    const list = document.querySelectorAll(".list");
    list.forEach((item) => {
      item.classList.toggle("list-dark");
    });
  });

// Event listener for custom checkbox

function changeCheckBox() {
  const checkboxes = document.querySelectorAll(".custom-checkbox");
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = items[index].completed;
    checkbox.addEventListener("change", (event) => {
      items[index].completed = event.target.checked;

      if (!event.target.checked) {
        // Remove the item from the completed state
        items[index].completed = false;
      }

      // Update the item's visual representation
      updateItemUI(index);
      itemsLeft();
    });
  });
}

function updateItemUI(index) {
  const listItem = document.querySelectorAll(".list")[index];
  const listTitle = listItem.querySelector(".list_title");
  const checkboxImage = listItem.querySelector(".checkbox-image");

  listItem.classList.toggle("complete", items[index].completed);
  checkboxImage.src = items[index].completed
    ? "./images/check.png"
    : "./images/circle-white.png";
  listTitle.classList.toggle("completed_with_color", items[index].completed);
}

function addItem(description) {
  items.push({
    description,
    completed: false,
  });
  render();
}

function deleteListItem(index) {
  items.splice(index, 1);
  render();
  itemsLeft();
}

function itemsLeft() {
  const notCompletedItems = items.filter((item) => !item.completed);
  const itemsLeftCount = notCompletedItems.length;
  const itemsLeftElement = document.querySelector(".items_left");
  itemsLeftElement.textContent = `${itemsLeftCount} item${
    itemsLeftCount === 1 ? "" : "s"
  } left`;
}

// Drag and drop to reorder list
let draggedItem = null;

function draggableList() {
  const lists = document.querySelectorAll(".list");
  lists.forEach((list) => {
    list.addEventListener("dragstart", dragStart);
    list.addEventListener("dragover", dragOver);
    list.addEventListener("drop", drop);
  });
}

function dragStart(event) {
  draggedItem = event.target;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  const dropTarget = event.target;
  const parent = dropTarget.parentNode;
  const next = dropTarget.nextElementSibling;

  if (draggedItem !== dropTarget) {
    parent.insertBefore(draggedItem, dropTarget);
  } else if (next) {
    parent.insertBefore(draggedItem, next);
  } else {
    parent.appendChild(draggedItem);
  }
}

// Function to filter TODO items based on their completed status
function filterItems(filterType) {
  switch (filterType) {
    case "all":
      return items;
    case "active":
      return items.filter((item) => !item.completed);
    case "completed":
      return items.filter((item) => item.completed);
    default:
      return items;
  }
}

function updateFilteredList(filterType) {
  const todoList = document.querySelector(".todo_list");
  todoList.innerHTML = "";
  const filteredItems = filterItems(filterType);
  for (let i = 0; i < filteredItems.length; i++) {
    const item = filteredItems[i];
    const newHtml = `<div class="list ${
      item.completed ? "complete" : ""
    }" draggable="true">
            <label>
                <input type="checkbox" id="checkbox" class="custom-checkbox" ${
                  item.completed ? "checked" : ""
                }>
                <img src="${
                  item.completed
                    ? "./images/check.png"
                    : "./images/circle-white.png"
                }" alt="Checkbox" class="checkbox-image">
            </label>
            <p class="list_title">${item.description}</p>
            <svg onclick="deleteListItem(${items.indexOf(
              item
            )})" class="delete_list" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Combined Shape 2">
                    <path id="Combined Shape" fill-rule="evenodd" clip-rule="evenodd" d="M17.6777 0.707107L16.9706 0L8.83883 8.13173L0.707107 0L0 0.707107L8.13173 8.83883L0 16.9706L0.707106 17.6777L8.83883 9.54594L16.9706 17.6777L17.6777 16.9706L9.54594 8.83883L17.6777 0.707107Z" fill="#494C6B"/>
                </g>
            </svg>
        </div>`;
    todoList.insertAdjacentHTML("beforeend", newHtml);
  }
  draggableList();
  itemsLeft();
  changeCheckBox();
}

document.querySelectorAll(".status p").forEach((filterOption) => {
  filterOption.addEventListener("click", function () {
    const filterType = this.classList.contains("all")
      ? "all"
      : this.classList.contains("active")
      ? "active"
      : "completed";
    updateFilteredList(filterType);
  });
});

// Function to clear completed items
function clearCompletedItems() {
  items = items.filter((item) => !item.completed);
  render();
  itemsLeft();
}

// Event listener for the "Clear Completed" button
document.querySelector(".clear").addEventListener("click", clearCompletedItems);

// Event listener for the input field
document
  .querySelector(".text_input")
  .addEventListener("keyup", function (event) {
    event.preventDefault();
    const listItem = event.target.value.trim();
    if (listItem.length > 0 && event.keyCode === 13) {
      changeCheckBox();
      addItem(listItem);
      event.target.value = "";
    }
  });

// Call the render function on page load
window.onload = function () {
  render();
};

function render() {
  const todoList = document.querySelector(".todo_list");
  todoList.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const newHtml = `<div class="list ${
      item.completed ? "complete" : ""
    }" draggable="true">
            <label>
                <input type="checkbox" id="checkbox" class="custom-checkbox">
                <img src="${
                  item.completed
                    ? "./images/check.png"
                    : "./images/circle-white.png"
                }" alt="Checkbox" class="checkbox-image">
            </label>
            <p class="list_title">${item.description}</p>
            <svg onclick="deleteListItem(${i})" class="delete_list" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Combined Shape 2">
                    <path id="Combined Shape" fill-rule="evenodd" clip-rule="evenodd" d="M17.6777 0.707107L16.9706 0L8.83883 8.13173L0.707107 0L0 0.707107L8.13173 8.83883L0 16.9706
                    L0.707107 17.6777L8.83883 9.54594L16.9706 17.6777L17.6777 16.9706L9.54594 8.83883L17.6777 0.707107Z" fill="#494C6B"/>
                    </g>
                </svg>
            </div>`;
    todoList.insertAdjacentHTML("beforeend", newHtml);
  }
  draggableList();
  itemsLeft();
  changeCheckBox();
}

// Call the render function on page load
window.onload = function () {
  render();
};
