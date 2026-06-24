document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & BACK TO TOP
       ========================================================================== */
    const header = document.getElementById('main-header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky header transition
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Back to top click event
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       2. MOBILE HAMBURGER MENU
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });


    /* ==========================================================================
       3. ACTIVE NAV LINK HIGHLIGHTING (SCROLL SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpyOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);
    sections.forEach(section => observer.observe(section));


    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters view
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(element => revealObserver.observe(element));


    /* ==========================================================================
       5. TESTIMONIAL SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 seconds auto-rotate

    const showSlide = (index) => {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update index
        currentSlide = (index + slides.length) % slides.length;

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Auto rotate slide helper
    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, intervalTime);
    };

    const resetSlideShow = () => {
        clearInterval(slideInterval);
        startSlideShow();
    };

    // Event listeners for controls
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideShow();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideShow();
    });

    // Dot indicators navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideShow();
        });
    });

    // Initialize Auto Rotation
    startSlideShow();


    /* ==========================================================================
       6. INTERACTIVE PRODUCT CATEGORY FILTER/SEARCH
       ========================================================================== */
    const categorySearchInput = document.getElementById('category-search');
    const categoryCards = document.querySelectorAll('.category-card');
    const noMatchMessage = document.getElementById('no-category-match');

    categorySearchInput.addEventListener('input', () => {
        const query = categorySearchInput.value.toLowerCase().trim();
        let matchesCount = 0;

        categoryCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-body').textContent.toLowerCase();
            const tags = card.getAttribute('data-category').toLowerCase();

            if (title.includes(query) || desc.includes(query) || tags.includes(query)) {
                card.style.display = 'flex';
                matchesCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle no-match block
        if (matchesCount === 0) {
            noMatchMessage.classList.remove('hidden');
        } else {
            noMatchMessage.classList.add('hidden');
        }
    });


    /* ==========================================================================
       7. CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formName = document.getElementById('form-name');
    const formPhone = document.getElementById('form-phone');
    const formEmail = document.getElementById('form-email');
    const formRole = document.getElementById('form-role');
    const formMessage = document.getElementById('form-message');
    const successOverlay = document.getElementById('form-success-message');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const submitBtn = document.getElementById('submit-btn');
    const submitSpinner = submitBtn.querySelector('.spinner');
    const formWhatsapp = document.getElementById('form-whatsapp');

    const setError = (element, message) => {
        const group = element.closest('.form-group');
        group.classList.add('error');
        const errorText = group.querySelector('.error-message');
        if (errorText) errorText.textContent = message;
    };

    const clearErrors = () => {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Checks digits, dashes, brackets; at least 7 digits
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 7;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        // 1. Validate Name
        if (formName.value.trim() === '') {
            setError(formName, 'Full Name is required.');
            isValid = false;
        }

        // 2. Validate Phone
        if (formPhone.value.trim() === '') {
            setError(formPhone, 'Phone Number is required.');
            isValid = false;
        } else if (!validatePhone(formPhone.value)) {
            setError(formPhone, 'Please enter a valid phone number.');
            isValid = false;
        }

        // 3. Validate Email
        if (formEmail.value.trim() === '') {
            setError(formEmail, 'Email Address is required.');
            isValid = false;
        } else if (!validateEmail(formEmail.value)) {
            setError(formEmail, 'Please enter a valid email address.');
            isValid = false;
        }

        // 4. Validate Role Select
        if (formRole.value === '') {
            setError(formRole, 'Please select your role (Homeowner, Contractor, etc.).');
            isValid = false;
        }

        // 5. Validate Message
        if (formMessage.value.trim() === '') {
            setError(formMessage, 'Please fill in details about your project or material needs.');
            isValid = false;
        }

        // If form checks pass, simulate API request submission
        if (isValid) {
            // Disable button, show loading spinner
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            submitSpinner.classList.remove('hidden');

            setTimeout(() => {
                // Hide spinner and enable button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitSpinner.classList.add('hidden');

                // If WhatsApp checkbox is checked, redirect to WhatsApp in a new tab
                if (formWhatsapp && formWhatsapp.checked) {
                    const waText = `Hello ORear Hardware LLC,\n\nI'd like to request support/supplies:\n• Name: ${formName.value.trim()}\n• Phone: ${formPhone.value.trim()}\n• Email: ${formEmail.value.trim()}\n• Role: ${formRole.options[formRole.selectedIndex].text}\n• Details: ${formMessage.value.trim()}`;
                    const encodedText = encodeURIComponent(waText);
                    const whatsappUrl = `https://wa.me/12058414646?text=${encodedText}`;
                    window.open(whatsappUrl, '_blank');
                }

                // Show Success Overlay
                successOverlay.classList.remove('hidden');
            }, 1200); // 1.2s delay for realism
        }
    });

    // Close success alert overlays and reset form
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.add('hidden');
        contactForm.reset();
        clearErrors();
    });

});
