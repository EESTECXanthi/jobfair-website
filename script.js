document.addEventListener("DOMContentLoaded", function() {
    /* ----------------- Carousel ----------------- */

    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;
    const intervalTime = 3000;
    let autoSlideInterval;

    // Safely query buttons
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });
    }

    function moveSlide(direction) {
        slideIndex += direction;
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        showSlide(slideIndex);
        resetAutoSlide();
    }
    window.moveSlide = moveSlide;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveSlide(1);
        }, intervalTime);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => moveSlide(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => moveSlide(1));
    }

    if (slides.length > 0) {
        showSlide(slideIndex);
        startAutoSlide();
    }

    /* ----------------- Modal for Cards ----------------- */
    const modalOverlay = document.getElementById("modalOverlay");
    const modalText = document.getElementById("modalText");
    const modalImg = document.getElementById("modalImg");

    function toggleCardDetails(card) {
        const cardDetails = card.querySelector(".card-details");

        if (!cardDetails) return;

        const titleEl = card.querySelector(".card-title");
        const detailsEl = card.querySelector(".card-details p");
        const imgEl = card.querySelector("img");

        // Safely read the text and image source
        const title = titleEl ? titleEl.textContent : "No Title";
        const details = detailsEl ? detailsEl.textContent : "No details.";
        const imgSrc = imgEl ? imgEl.getAttribute("src") : "";

        // Update modal
        modalText.innerHTML = `<h2>${title}</h2><p>${details}</p>`;
        modalImg.innerHTML = imgSrc ? `<img src="${imgSrc}" alt="Modal Image"/>` : "";

        // Show modal
        if (modalOverlay) {
            modalOverlay.style.display = "flex";
        }
    }
    window.toggleCardDetails = toggleCardDetails; // ensure global availability

    function closeModal(event) {
        if (event && event.target !== modalOverlay) return;
        if (modalOverlay) {
            modalOverlay.style.display = "none";
        }
    }
    window.closeModal = closeModal; // ensure global availability

    /* modal for job offers */

    function openJobModal(company, title, requirements, description, logoPath, pdfLink, jobsitelink, siteLink) {
        const modal = document.getElementById("jobModal");
        const logoImg = document.getElementById('jobModalLogo');
        document.getElementById("jobModalLogo").src = logoPath;
        document.getElementById("jobModalLogo").alt = company;
        document.getElementById("jobModalTitle").textContent = title;

        // Populate requirements as a list
        const requirementsList = document.getElementById("jobModalReq");
        requirementsList.innerHTML = ""; // Clear previous content
        requirements.split("/-").forEach(req => {
            const li = document.createElement("li");
            li.textContent = req.trim();
            requirementsList.appendChild(li);
        });

        document.getElementById("jobModalDesc").textContent = description;

        const pdfElement = document.getElementById("jobModalPdf");
        if (pdfLink) {
            pdfElement.href = pdfLink;
            pdfElement.style.display = "inline-block";
            pdfElement.textContent = "Download PDF";
            pdfElement.setAttribute("download", ""); // Enable download
            pdfElement.removeAttribute("target"); // Remove target for download
            pdfElement.removeAttribute("rel"); // Remove rel for download
        } else if (jobsitelink) {
            pdfElement.href = jobsitelink;
            pdfElement.style.display = "inline-block";
            pdfElement.textContent = "Job Offer's Link";
            pdfElement.removeAttribute("download"); // Disable download
            pdfElement.setAttribute("target", "_blank"); // Open in new tab
            pdfElement.setAttribute("rel", "noopener noreferrer"); // Security for new tab
        } else {
            pdfElement.style.display = "none";
        }

        const siteElement = document.getElementById("jobModalSite");
        siteElement.href = siteLink;

        modal.style.display = "flex";
    }

    function closeJobModal() {
        document.getElementById("jobModal").style.display = "none";
    }

    window.openJobModal = openJobModal;
    window.closeJobModal = closeJobModal;

    // Add an outside click event for the job modal
    const jobModal = document.getElementById("jobModal");
    if (jobModal) {
        jobModal.addEventListener("click", (event) => {
            // If the click is on the overlay (not on the modal content), close the modal
            if (event.target === jobModal) {
                closeJobModal();
            }
        });
    }

    /* ----------------- Inertia Drag Scrolling ----------------- */
    const jobScroll = document.querySelector(".job-scroll");
    let isDown = false, startX, scrollLeft, velocity, animationFrameId;
    let lastX, lastTime;

    function endDrag() {
        if (!isDown) return;
        isDown = false;
        jobScroll.classList.remove("grabbing");
        // Inertia effect
        (function inertia() {
            jobScroll.scrollLeft -= velocity;
            velocity *= 0.8;
            if (Math.abs(velocity) > 0.5) {
                animationFrameId = requestAnimationFrame(inertia);
            }
        })();
    }

    if (jobScroll) {
        jobScroll.addEventListener("mousedown", (e) => {
            isDown = true;
            jobScroll.classList.add("grabbing");
            startX = e.pageX - jobScroll.offsetLeft;
            scrollLeft = jobScroll.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            cancelAnimationFrame(animationFrameId);
        });

        jobScroll.addEventListener("mouseleave", () => endDrag());
        jobScroll.addEventListener("mouseup", () => endDrag());

        jobScroll.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            jobScroll.scrollLeft = scrollLeft - walk;

            // Calculate velocity for inertia
            const now = Date.now();
            const deltaTime = now - lastTime;
            const deltaX = x - lastX;
            velocity = (deltaX / deltaTime) * 20;
            lastX = x;
            lastTime = now;
        });
    }

    /* ----------------- For Job Cards (Optional) ----------------- */
    function toggleJobDetails(button) {
        const jobCard = button.closest(".job-card");
        if (!jobCard) return;
        const jobDetails = jobCard.querySelector(".job-details");
        if (jobDetails) {
            jobDetails.style.display = (jobDetails.style.display === "block") 
                ? "none" 
                : "block";
        }
    }
    window.toggleJobDetails = toggleJobDetails; // ensure global

    function toggleJobOfferDetails(button) {
        const jobCard = button.closest(".job-card");
        if (!jobCard) return;

        // Grab job title, job text, image, etc. from the card
        const titleEl = jobCard.querySelector("h3");
        const roleEl = jobCard.querySelector("h4");
        const detailsEl = jobCard.querySelector(".job-details p");
        const imgEl = jobCard.querySelector("img");

        // Safely read values
        const title = titleEl ? titleEl.textContent : "No Company";
        const role = roleEl ? roleEl.textContent : "No Role";
        const details = detailsEl ? detailsEl.textContent : "No details available.";
        const imgSrc = imgEl ? imgEl.getAttribute("src") : "";

        // Populate existing modal
        const modalOverlay = document.getElementById("modalOverlay");
        const modalText = document.getElementById("modalText");
        const modalImg = document.getElementById("modalImg");

        modalText.innerHTML = `
            <h2>${title}</h2>
            <h3>${role}</h3>
            <p>${details}</p>
        `;
        modalImg.innerHTML = imgSrc ? `<img src="${imgSrc}" alt="Modal Image"/>` : "";

        // Show modal
        if (modalOverlay) {
            modalOverlay.style.display = "flex";
        }
    }
    window.toggleJobOfferDetails = toggleJobOfferDetails; // ensure global

    /* ----------------- Filter Job Cards by Company ----------------- */
    const filterLogos = document.querySelectorAll('.company-filter-logo');
    const jobCards = document.querySelectorAll('.job-card');

    filterLogos.forEach(logo => {
        logo.addEventListener('click', function() {
            // Remove active class from all
            filterLogos.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const company = this.getAttribute('data-company');
            jobCards.forEach(card => {
                if (company === 'all' || card.getAttribute('data-company') === company) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });

            // Reset horizontal scroll when "Show All" is clicked
            if (company === 'all') {
                const jobScroll = document.querySelector('.job-scroll');
                if (jobScroll) jobScroll.scrollLeft = 0;
            }

            // Call updateArrows after filtering
            if (typeof updateArrows === "function") updateArrows();

            // Call stackJobCards after filtering
            stackJobCards();
        });
    });

    // Optionally, activate "all" by default
    const allLogo = document.querySelector('.company-filter-logo[data-company="all"]');
    if (allLogo) allLogo.click();
});

window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  
  const scrollY = window.pageYOffset;
  if (scrollY < 30) {
    // Fully transparent
    navbar.style.background = "rgba(255, 255, 255, 0)";
    navbar.style.backdropFilter = "none";
  } else if (scrollY >= 30 && scrollY < 150) {
    // Gradually increase opacity from 0 to (e.g.) 0.2
    const ratio = (scrollY - 30) / (150 - 30);
    const currentOpacity = ratio * 0.2; 
    navbar.style.background = `rgba(255, 255, 255, ${currentOpacity})`;
    navbar.style.backdropFilter = `blur(${ratio * 10}px)`; 
  } else {
    // Full glass effect
    navbar.style.background = "rgba(255, 255, 255, 0.2)";
    navbar.style.backdropFilter = "blur(10px)";
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const carousel = document.querySelector('.sponsor-logos-carousel');
  const originalTrack = document.querySelector('.sponsor-logos-track');
  if (!carousel || !originalTrack) return;

  // Create a wrapper that will hold the original track and its clone side-by-side.
  const trackWrapper = document.createElement('div');
  trackWrapper.classList.add('sponsor-logos-track-wrapper');
  // Ensure the wrapper is displayed inline (horizontally)
  trackWrapper.style.display = 'flex';
  trackWrapper.style.flexWrap = 'nowrap';

  // Move the original track into the wrapper
  carousel.innerHTML = '';
  trackWrapper.appendChild(originalTrack);
  
  // Clone the entire track and append it to the wrapper
  const trackClone = originalTrack.cloneNode(true);
  trackWrapper.appendChild(trackClone);
  
  // Append the wrapper to the carousel
  carousel.appendChild(trackWrapper);
  
  // Set some necessary styles on the carousel
  carousel.style.overflow = 'hidden';
  carousel.style.position = 'relative';

  // Variables for auto-scroll and drag
  let currentTransform = 0;
  let autoScrollInterval;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let dragDistance = 0;
  const clickThreshold = 10; // pixels allowed for a "click" (small drag)

  // Prevent default drag behavior on all images and attach click handlers
  carousel.querySelectorAll('img').forEach((img) => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
    img.addEventListener('click', (e) => {
      if (dragDistance > clickThreshold) {
        e.preventDefault();
        return;
      }
      openModal(img);
    });
  });

  // Auto-scroll function
  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      if (!isDragging) {
        currentTransform -= 1; // adjust speed as needed
        const trackWidth = originalTrack.scrollWidth; // full width of one track
        if (Math.abs(currentTransform) >= trackWidth) {
          // Reset seamlessly because the two tracks are identical
          currentTransform = 0;
        }
        trackWrapper.style.transform = `translateX(${currentTransform}px)`;
      }
    }, 16); // ~60fps
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Hover events to stop/resume auto-scroll
  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);

  // Drag events
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = currentTransform;
    dragDistance = 0;
    stopAutoScroll();
    // Disable transitions while dragging
    trackWrapper.style.transition = 'none';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    dragDistance = Math.abs(delta);
    currentTransform = scrollStart + delta;
    trackWrapper.style.transform = `translateX(${currentTransform}px)`;
  });

  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    trackWrapper.style.transition = 'transform 0.3s ease';
    startAutoScroll();
  });

  // In case the mouse leaves while dragging, end the drag
  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      trackWrapper.style.transition = 'transform 0.3s ease';
      startAutoScroll();
    }
  });

  // Example modal opening function
  function openModal(logo) {
    console.log('Opening modal for:', logo.alt);
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContent = document.getElementById("modalContent");
    if (modalOverlay && modalContent) {
      modalContent.innerHTML = `<img src="${logo.src}" alt="${logo.alt}"><p>${logo.alt}</p>`;
      modalOverlay.style.display = "flex";
    }
  }

  // Start the auto-scroll
  startAutoScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  // Target only the job offers section
  const wrapper = document.querySelector('#jobs .content-wrapper');
  if (!wrapper) return;
  const scrollContainer = wrapper.querySelector('.job-scroll');
  const leftBtn = wrapper.querySelector('.job-scroll-arrow.left');
  const rightBtn = wrapper.querySelector('.job-scroll-arrow.right');
  if (!scrollContainer || !leftBtn || !rightBtn) return;

  function updateArrows() {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (maxScroll > 5) { // threshold for floating point errors
      leftBtn.classList.add('active');
      rightBtn.classList.add('active');
      leftBtn.classList.toggle('disabled', scrollContainer.scrollLeft <= 0);
      rightBtn.classList.toggle('disabled', scrollContainer.scrollLeft >= maxScroll - 2);
    } else {
      leftBtn.classList.remove('active');
      rightBtn.classList.remove('active');
    }
  }

  function getScrollAmount() {
  const card = scrollContainer.querySelector('.job-card');
  if (!card) return 200;
  // Get the gap from the parent flex container
  const scrollStyles = getComputedStyle(scrollContainer);
  let gap = parseInt(scrollStyles.gap || scrollStyles.columnGap || 0, 10);
  if (isNaN(gap)) gap = 0;
  const cardWidth = card.offsetWidth;
  return window.innerWidth <= 768 ? (cardWidth + gap) + 5 : (cardWidth + gap) * 2;
}

  leftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  scrollContainer.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);

  // Optional: update on content changes
  const observer = new MutationObserver(updateArrows);
  observer.observe(scrollContainer, { childList: true, subtree: true });

  // Initial check
  updateArrows();
  window.updateArrows = updateArrows;
});

function stackJobCards() {
  const showAllActive = document.querySelector('.company-filter-logo[data-company="all"].active');
  const jobScroll = document.querySelector('.job-scroll');
  if (!jobScroll) return;

  // Get all cards in original order
  const allCards = Array.from(jobScroll.querySelectorAll('.job-card'));
  // Remove all stacks and cards
  document.querySelectorAll('.job-card-stack').forEach(stack => stack.remove());
  allCards.forEach(card => card.remove());

  if (!showAllActive) {
    // Restore all cards in original order
    allCards.forEach(card => jobScroll.appendChild(card));
    return;
  }

  // Group cards by company
  const groups = {};
  allCards.forEach(card => {
    const company = card.getAttribute('data-company');
    if (!groups[company]) groups[company] = [];
    groups[company].push(card);
  });

  // Re-insert in original order, stacking where needed
  let i = 0;
  while (i < allCards.length) {
    const card = allCards[i];
    const company = card.getAttribute('data-company');
    const group = groups[company];
    if (group && group.length > 1 && group[0] === card) {
      // Stack all cards for this company
      const stack = document.createElement('div');
      stack.className = 'job-card-stack';
      stack.setAttribute('data-company', company);
      group.forEach(c => stack.appendChild(c));
      jobScroll.appendChild(stack);

      // Click to filter when stack is clicked
      stack.addEventListener('click', function(e) {
        // Find the filter logo for this company and trigger click
        const logo = document.querySelector(`.company-filter-logo[data-company="${company}"]`);
        if (logo) logo.click();
        e.stopPropagation();
      });

      i += group.length;
    } else if (!group || group.length === 1) {
      jobScroll.appendChild(card);
      i++;
    } else {
      i++;
    }
  }
}
