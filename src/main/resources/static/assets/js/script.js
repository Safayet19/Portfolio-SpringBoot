const menuButton = document.getElementById("menu");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const scrollTopBtn = document.getElementById("scroll-top");
menuButton.addEventListener("click", () => {
  navbar.classList.toggle("open");
  const isOpen = navbar.classList.contains("open");
  menuButton.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});
const sections = document.querySelectorAll("section[id]");
function setActiveLink() {
  const scrollY = window.scrollY;
  let current = "home";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
  if (scrollY > 600) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
}
let scrollFramePending = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(() => {
      setActiveLink();
      scrollFramePending = false;
    });
  },
  { passive: true }
);
setActiveLink();
const typedElement = document.querySelector(".typing-text");
const typingWords = [
  "Machine Learning",
  "Deep Learning",
  "Federated Learning",
  "Explainable AI",
  "Agentic AI",
  "Software Development",
  "Cybersecurity"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeText() {
  const currentWord = typingWords[wordIndex];
  if (!isDeleting) {
    typedElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeText, 1400);
      return;
    }
  } else {
    typedElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
    }
  }
  setTimeout(typeText, isDeleting ? 45 : 85);
}
if (typedElement) {
  typeText();
}
const canvas = document.getElementById("particles-js");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: null, y: null, radius: 120 };
let particleFrame = 0;
let particlesActive = true;
let resizeFrame = 0;
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  initParticles();
}
window.addEventListener(
  "resize",
  () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(resizeCanvas);
  },
  { passive: true }
);
window.addEventListener("mousemove", (event) => {
  if (!particlesActive) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1.2;
    this.speedX = Math.random() * 0.7 - 0.35;
    this.speedY = Math.random() * 0.7 - 0.35;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.15;
        this.y -= Math.sin(angle) * force * 1.15;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(73, 216, 155, 0.44)";
    ctx.shadowColor = "rgba(53, 200, 135, 0.28)";
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
function initParticles() {
  particles = [];
  const count = window.innerWidth < 768 ? 45 : 95;
  for (let i = 0; i < count; i += 1) {
    particles.push(new Particle());
  }
}
function connectParticles() {
  for (let a = 0; a < particles.length; a += 1) {
    for (let b = a + 1; b < particles.length; b += 1) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 135) {
        ctx.strokeStyle = `rgba(73, 216, 155, ${0.42 - distance / 320})`;
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  if (!particlesActive || document.hidden) {
    particleFrame = 0;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  connectParticles();
  particleFrame = requestAnimationFrame(animateParticles);
}
function startParticles() {
  particlesActive = true;
  if (!particleFrame && !document.hidden) animateParticles();
}
function stopParticles() {
  particlesActive = false;
  if (particleFrame) cancelAnimationFrame(particleFrame);
  particleFrame = 0;
}
if (canvas) {
  resizeCanvas();
  startParticles();
  const homeSection = canvas.closest(".home");
  if (homeSection && "IntersectionObserver" in window) {
    const homeObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startParticles();
        else stopParticles();
      },
      { threshold: 0.01 }
    );
    homeObserver.observe(homeSection);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (particleFrame) cancelAnimationFrame(particleFrame);
      particleFrame = 0;
    } else if (particlesActive) {
      startParticles();
    }
  });
}
const contactForm = document.getElementById("contact-form");
const contactToast = document.getElementById("contact-toast");
let contactToastTimer;
function showContactToast(message, type) {
  if (!contactToast) return;
  window.clearTimeout(contactToastTimer);
  contactToast.textContent = message;
  contactToast.className = `contact-toast contact-toast--${type} contact-toast--visible`;
  contactToastTimer = window.setTimeout(() => {
    contactToast.classList.remove("contact-toast--visible");
  }, 3000);
}
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonHtml = submitButton ? submitButton.innerHTML : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method.toUpperCase(),
        body: new FormData(contactForm)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }
      showContactToast(result.message || "Message sent successfully!", "success");
      contactForm.reset();
    } catch (error) {
      showContactToast("Message could not be sent. Please try again.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
      }
    }
  });
}
;
(function () {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });
  ready(() => {
    const sectionIds = [
      "about",
      "skills",
      "education",
      "projects",
      "experience",
      "research",
      "certifications",
      "contact"
    ];
    const staggerSelectors = [
      ".about-grid",
      ".about-mini-grid",
      ".about-points",
      ".skills-grid",
      ".education-wrapper",
      ".projects-grid",
      ".experience-list",
      ".research-grid",
      ".certification-showcase",
      ".contact-layout"
    ];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const heading = section.querySelector(".section-heading");
      if (heading) heading.dataset.reveal = "up";
      staggerSelectors.forEach((selector) => {
        section.querySelectorAll(selector).forEach((element) => {
          element.dataset.stagger = "";
        });
      });
    });
    const revealTargets = document.querySelectorAll(
      "[data-reveal], [data-stagger], .skill-card"
    );
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
      );
      revealTargets.forEach((element) => revealObserver.observe(element));
    } else {
      revealTargets.forEach((element) => element.classList.add("in-view"));
    }
  });
})();
(function () {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });
  ready(() => {
    const modal = document.getElementById("projectModal");
    if (!modal) return;
    const image = document.getElementById("pmImage");
    const previous = document.getElementById("pmPrev");
    const next = document.getElementById("pmNext");
    const dots = document.getElementById("pmDots");
    const type = document.getElementById("pmType");
    const title = document.getElementById("pmTitle");
    const description = document.getElementById("pmDesc");
    const highlights = document.getElementById("pmHighlights");
    const technology = document.getElementById("pmTech");
    const github = document.getElementById("pmGithub");
    const closeButton = modal.querySelector(".project-modal__close");
    const fallbackImage = "/assets/images/projects/project-fallback.svg";
    const projects = {
      "student-excuse": {
        type: "Desktop Application",
        icon: "fa-solid fa-file-circle-check",
        title: "Student Excuse Generator",
        description: "A Java and JavaFX application that generates polished student excuse documents. Built with a clean OOP structure, it takes structured user input, processes it through templated logic, and outputs ready-to-submit formatted documents — including validation, reusable components, and file handling.",
        highlights: [
          "Java and JavaFX interface with a clear workflow",
          "Template-driven excuse generation engine",
          "Structured input validation and error handling",
          "File handling for export and reuse",
          "Modular OOP design for easy extension"
        ],
        technology: ["Java", "JavaFX", "OOP", "GUI", "File Handling"],
        github: "https://github.com/Safayet19/Student-Excuse-Generator",
        images: [
          "/assets/images/optimized/projects/student-excuse/01-login.webp",
          "/assets/images/optimized/projects/student-excuse/02-dashboard.webp",
          "/assets/images/optimized/projects/student-excuse/03-generate-excuse.webp"
        ]
      },
      hospital: {
        type: "Desktop Application",
        icon: "fa-solid fa-hospital",
        title: "Hospital Management System",
        description: "A Java and JavaFX based hospital management application for managing hospital records, patients, doctors, appointments, and administrative workflow. Built with an OOP-driven architecture and database-backed persistence for reliable day-to-day operations.",
        highlights: [
          "Patient, doctor, and staff record management",
          "Appointment scheduling and tracking",
          "Role-based dashboards and workflow screens",
          "Database-backed persistence with clean data models",
          "OOP architecture for maintainability and extension"
        ],
        technology: ["Java", "JavaFX", "OOP", "Database", "GUI"],
        github: "https://github.com/Safayet19/Hospital-Management-System-JavaFX-",
        images: [
          "/assets/images/optimized/projects/hospital/01-login.webp",
          "/assets/images/optimized/projects/hospital/02-admin-dashboard.webp",
          "/assets/images/optimized/projects/hospital/03-doctor-dashboard.webp",
          "/assets/images/optimized/projects/hospital/04-feedback.webp"
        ]
      },
      "plant-disease": {
        type: "Deep Learning",
        icon: "fa-solid fa-seedling",
        title: "Plant Disease Recognition",
        description: "A CNN-based plant disease recognition web app that classifies plant leaf conditions using deep learning image classification. Users upload a leaf image and the trained model predicts the disease class from a curated dataset.",
        highlights: [
          "Convolutional Neural Network trained on a plant leaf dataset",
          "Instant disease classification from uploaded images",
          "Clear upload interface with image preview",
          "Result panel with the detected disease label",
          "Lightweight interactive web application"
        ],
        technology: ["Python", "CNN", "Deep Learning", "TensorFlow", "Image Classification"],
        github: "https://github.com/Safayet19/Plant-Disease-Detection-CNN-model",
        images: [
          "/assets/images/optimized/projects/plant-disease/01-upload.webp",
          "/assets/images/optimized/projects/plant-disease/02-result.webp"
        ]
      }
    };
    let currentProject = null;
    let currentImage = 0;
    let returnFocus = null;
    function projectData() {
      return projects[currentProject];
    }
    function updateDots() {
      Array.from(dots.children).forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentImage);
        dot.setAttribute("aria-current", index === currentImage ? "true" : "false");
      });
    }
    function showImage(index) {
      const project = projectData();
      if (!project) return;
      currentImage = (index + project.images.length) % project.images.length;
      image.classList.add("swap");
      window.setTimeout(() => {
        image.src = project.images[currentImage];
        image.alt = `${project.title} screenshot ${currentImage + 1} of ${project.images.length}`;
        image.classList.remove("swap");
      }, 150);
      updateDots();
    }
    function buildDots() {
      const project = projectData();
      dots.replaceChildren();
      project.images.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
        dot.addEventListener("click", () => showImage(index));
        dots.appendChild(dot);
      });
      updateDots();
    }
    function openModal(key, trigger) {
      const project = projects[key];
      if (!project) return;
      currentProject = key;
      currentImage = 0;
      returnFocus = trigger;
      type.innerHTML = `<i class="${project.icon}"></i> ${project.type}`;
      title.textContent = project.title;
      description.textContent = project.description;
      highlights.replaceChildren(
        ...project.highlights.map((item) => {
          const listItem = document.createElement("li");
          listItem.textContent = item;
          return listItem;
        })
      );
      technology.replaceChildren(
        ...project.technology.map((item) => {
          const tag = document.createElement("span");
          tag.textContent = item;
          return tag;
        })
      );
      github.href = project.github;
      image.src = project.images[0];
      image.alt = `${project.title} screenshot 1 of ${project.images.length}`;
      buildDots();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
      closeButton.focus();
    }
    function closeModal() {
      if (!modal.classList.contains("is-open")) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      if (returnFocus) returnFocus.focus();
    }
    document.querySelectorAll("[data-project]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(trigger.dataset.project, trigger);
      });
    });
    modal.querySelectorAll("[data-close]").forEach((control) => {
      control.addEventListener("click", closeModal);
    });
    previous.addEventListener("click", () => showImage(currentImage - 1));
    next.addEventListener("click", () => showImage(currentImage + 1));
    image.addEventListener("error", () => {
      if (!image.src.endsWith("project-fallback.svg")) image.src = fallbackImage;
    });
    document.addEventListener("keydown", (event) => {
      if (!modal.classList.contains("is-open")) return;
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") showImage(currentImage - 1);
      if (event.key === "ArrowRight") showImage(currentImage + 1);
    });
  });
})();
