class Course {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.courseId = Math.floor(Math.random() * 1000);
  }
}

class UI {
  addCourseToList(course) {
    let list = document.getElementById("book-list");
    let html = `
   <tr>
   <td>${course.title}</td>
   <td>${course.author}</td>
   <td>${course.isbn}</td>
   <td><a href="#" data-id="${course.courseId}" class="delete">Delete</a></td>
   </tr>
   `;
    list.innerHTML += html;
  }

  clearControls() {
    const titleInput = (document.getElementById("title").value = "");
    const authorInput = (document.getElementById("author").value = "");
    const isbnInput = (document.getElementById("isbn").value = "");
  }

  deleteCourse(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
      return true;
    }
  }

  showAlert(message, className) {
    let alert = `
  <div class="alert alert-${className}">
  ${message}
  </div> 
  `;
    bookForm.insertAdjacentHTML("beforebegin", alert);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

class Storage {
  static getCourses() {
    let courses;
    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem("courses"));
    }
    return courses;
  }
  static displayCourses() {
    const courses = Storage.getCourses();

    courses.forEach((course) => {
      const ui = new UI();
      ui.addCourseToList(course);
    });
  }
  static addCourse(course) {
    const courses = Storage.getCourses();
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
  }
  static deleteCourse(element) {
    if (element.classList.contains("delete")) {
      const id = element.getAttribute("data-id");
      const courses = Storage.getCourses();
      courses.forEach((course, index) => {
        if (course.courseId == id) {
          courses.splice(index, 1);
        }
      });
      localStorage.setItem("courses", JSON.stringify(courses));
    }
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayCourses);

const bookForm = document.getElementById("book-form");

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const titleInput = document.getElementById("title").value;
  const authorInput = document.getElementById("author").value;
  const isbnInput = document.getElementById("isbn").value;

  // Create course object
  const course = new Course(titleInput, authorInput, isbnInput);
  console.log(course);
  // Create UI
  const ui = new UI();
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill the blanks", "warning");
  } else {
    // Add course to list
    ui.addCourseToList(course);

    // Save to local storage
    Storage.addCourse(course);

    // Сlear controls
    ui.clearControls();

    ui.showAlert("The course has been added", "success");
  }
});

document.getElementById("book-list").addEventListener("click", function (e) {
  const ui = new UI();

  // Delete course
  if (ui.deleteCourse(e.target) == true) {
    // Delete local storage
    Storage.deleteCourse(e.target);

    ui.showAlert("The course has been deleeted", "danger");
  }
});
