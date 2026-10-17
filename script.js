document.addEventListener("DOMContentLoaded", function () {

  /* ============================================
     MOBILE NAVIGATION TOGGLE
  =============================================== */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  var navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  /* ============================================
     SCROLL REVEAL
  =============================================== */
  var revealTargets = document.querySelectorAll(".section, .hero");
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });

  /* ============================================
     CONTACT FORM VALIDATION + FORMSPREE SUBMIT
  =============================================== */
  var form = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");

  var fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter your name.";
      }
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim().length === 0) return "Please enter your email.";
        if (!pattern.test(value.trim())) return "Please enter a valid email address.";
        return "";
      }
    },
    projectType: {
      input: document.getElementById("projectType"),
      error: document.getElementById("projectTypeError"),
      validate: function (value) {
        return value ? "" : "Please select a project type.";
      }
    },
    details: {
      input: document.getElementById("details"),
      error: document.getElementById("detailsError"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please share a few details about your project.";
      }
    }
  };

  function validateField(fieldKey) {
    var field = fields[fieldKey];
    var message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.closest(".form-row").classList.toggle("has-error", Boolean(message));
    return message === "";
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("blur", function () {
      validateField(key);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) {
        isValid = false;
      }
    });

    if (!isValid) {
      formSuccess.textContent = "";
      return;
    }

    var submitBtn = form.querySelector(".form-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          formSuccess.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
          formSuccess.style.color = "#4CD080";
          form.reset();
        } else {
          formSuccess.textContent = "Something went wrong. Please email me directly instead.";
          formSuccess.style.color = "#E6555C";
        }
      })
      .catch(function () {
        formSuccess.textContent = "Something went wrong. Please email me directly instead.";
        formSuccess.style.color = "#E6555C";
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
  });

  /* ============================================
     PROJECT MODAL
  =============================================== */
  var projectsData = {
    ecommerce: {
      title: "Premium E-commerce Storefront",
      description: "A concept online store layout with a product grid, clean navigation, and a streamlined checkout flow — built to make browsing and buying simple.",
      tech: "HTML · CSS · JavaScript",
      image: "https://picsum.photos/id/26/800/500"
    },
    saas: {
      title: "SaaS Product Landing Page",
      description: "A conversion-focused landing page concept for a software product, with a clear headline and a single, obvious call to action.",
      tech: "HTML · CSS · JavaScript",
      image: "https://picsum.photos/id/180/800/500"
    },
    business: {
      title: "Modern Business Website",
      description: "A multi-section business site concept covering services, about, and contact in one clean, organized layout.",
      tech: "HTML · CSS · JavaScript",
      image: "https://picsum.photos/id/119/800/500"
    }
  };

  var projectModal = document.getElementById("projectModal");
  var modalMock = document.getElementById("modalMock");
  var modalTitle = document.getElementById("modalTitle");
  var modalDescription = document.getElementById("modalDescription");
  var modalTech = document.getElementById("modalTech");
  var modalClose = document.getElementById("modalClose");
  var modalOverlay = document.getElementById("modalOverlay");

  function openProjectModal(key) {
    var data = projectsData[key];
    if (!data) return;

    modalMock.src = data.image;
    modalMock.alt = data.title;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalTech.textContent = data.tech;

    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openProjectModal(btn.getAttribute("data-project"));
    });
  });

  modalClose.addEventListener("click", closeProjectModal);
  modalOverlay.addEventListener("click", closeProjectModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && projectModal.classList.contains("is-open")) {
      closeProjectModal();
    }
  });

  /* ============================================
     FOOTER YEAR
  =============================================== */
  document.getElementById("year").textContent = new Date().getFullYear();

});