document.addEventListener("DOMContentLoaded", function () {
  let currentPage = window.location.pathname;

  // LOGIN FUNCTION
  if (currentPage.includes("index.html")) {
    let loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        let storedEmail = localStorage.getItem("userEmail");
        let storedPassword = localStorage.getItem("userPassword");

        let adminEmail = "dhasarathandhas28@gmail.com";
        let adminPassword = "dhasar61";

        if (
          (email === storedEmail && password === storedPassword) ||
          (email === adminEmail && password === adminPassword)
        ) {
          alert("Login Successful! Redirecting...");
          localStorage.setItem("currentUser", email);
          window.location.href = "dashboard.html";
        } else {
          alert("Invalid email or password.");
        }
      });
    }
  }

  // SIGNUP FUNCTION
  if (currentPage.includes("signup.html")) {
    let signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        if (!name || !email || !password || !confirmPassword) {
          alert("All fields are required!");
          return;
        }

        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        alert("Sign-up successful! You can now log in.");
        window.location.href = "index.html";
      });
    }
  }

  // DASHBOARD FUNCTIONALITY
  if (currentPage.includes("dashboard.html")) {
    let userEmail = localStorage.getItem("currentUser");
    let welcomeMessage = document.getElementById("welcomeMessage");
    let profilePic = document.getElementById("profilePic");
    let photoUpload = document.getElementById("photoUpload");
    let gallery = document.getElementById("gallery");

    if (!userEmail) {
      alert("You are not logged in! Redirecting to login page...");
      window.location.href = "index.html";
      return;
    }

    // Set welcome message
    if (welcomeMessage) {
      welcomeMessage.innerText = `Welcome, ${userEmail}!`;
    }

    // Load saved profile picture
    let savedPhoto = localStorage.getItem("profilePic");
    if (savedPhoto && profilePic) {
      profilePic.src = savedPhoto;
    }

    // Upload profile picture
    if (photoUpload) {
      photoUpload.addEventListener("change", function () {
        let file = photoUpload.files[0];
        if (file) {
          let reader = new FileReader();
          reader.onload = function (event) {
            let imageURL = event.target.result;
            profilePic.src = imageURL;

            // Store in localStorage
            localStorage.setItem("profilePic", imageURL);
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select a photo to upload.");
        }
      });
    }

    // Load saved gallery images
    loadGallery();

    // Attach event listener for image uploads
    document
      .getElementById("photoUpload")
      .addEventListener("change", previewPhotos);
  }
});

// FUNCTION TO PREVIEW AND UPLOAD MULTIPLE PHOTOS
function previewPhotos() {
  let gallery = document.getElementById("gallery");
  let files = document.getElementById("photoUpload").files;

  if (!gallery || !files.length) {
    alert("Please select images to upload.");
    return;
  }

  if (files.length > 20) {
    alert("You can only upload up to 20 images.");
    return;
  }

  let imagesArray = [];

  for (let file of files) {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      continue;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
      let container = document.createElement("div");
      container.classList.add("image-container");

      let img = document.createElement("img");
      img.src = event.target.result;
      img.alt = file.name;

      let details = document.createElement("p");
      details.textContent = `${file.name} (${(file.size / 1024).toFixed(
        2
      )} KB)`;

      let removeBtn = document.createElement("button");
      removeBtn.textContent = "❌ Remove";
      removeBtn.classList.add("remove-btn");
      removeBtn.onclick = function () {
        container.remove();
        saveGallery();
      };

      container.appendChild(img);
      container.appendChild(details);
      container.appendChild(removeBtn);
      gallery.appendChild(container);

      imagesArray.push(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Save images to localStorage
  setTimeout(saveGallery, 500);
}

// SAVE GALLERY IMAGES TO LOCAL STORAGE
function saveGallery() {
  let gallery = document.getElementById("gallery");
  if (gallery) {
    localStorage.setItem("galleryImages", gallery.innerHTML);
  }
}

// LOAD GALLERY IMAGES FROM LOCAL STORAGE
function loadGallery() {
  let gallery = document.getElementById("gallery");
  let savedImages = localStorage.getItem("galleryImages");

  if (gallery && savedImages) {
    gallery.innerHTML = savedImages;

    // Re-attach event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.onclick = function () {
        btn.parentElement.remove();
        saveGallery();
      };
    });
  }
}

// LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("currentUser");
  alert("You have been logged out.");
  window.location.href = "index.html";
}
