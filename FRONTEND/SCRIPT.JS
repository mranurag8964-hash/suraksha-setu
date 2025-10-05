

document.addEventListener('DOMContentLoaded', () => {
    let map = null;
    let dashboardMap = null;
    let pendingRegistrationData = null;
    // --- Modal Elements --- // <-- ADD THIS SECTION
    const authorityLoginBtn = document.getElementById('authority-login-btn');
    const authorityLoginModal = document.getElementById('authority-login-modal');
    const closeAuthorityModalBtn = document.getElementById('close-authority-modal');
    const showAuthorityLoginBtn = document.getElementById('show-authority-login-btn');
    const showAuthorityRegisterBtn = document.getElementById('show-authority-register-btn');
    const authorityLoginForm = document.getElementById('authority-login-form');
    const authorityRegisterForm = document.getElementById('authority-register-form');
    const citizenLoginBtn = document.getElementById('citizen-login-btn');
    const citizenModal = document.getElementById('citizen-modal');
    const closeCitizenModalBtn = document.getElementById('close-citizen-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLoginFormLink = document.getElementById('show-login-form-link');
    const showRegisterFormLink = document.getElementById('show-register-form-link');
    const openChatBtn = document.getElementById('open-chat-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatBtn = document.getElementById('close-chat-btn');
    // const joinVolunteerBtn = document.getElementById('join-volunteer-btn');
    const contactForm = document.getElementById('contact-form');
    // const volunteerForm = document.getElementById('volunteer-form');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const greetingText = document.getElementById('greeting-text');
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutBtn = document.getElementById('logout-btn');
    const sosBtn = document.getElementById('sos-btn');
    const otpForm = document.getElementById('otp-form');
    const otpDestination = document.getElementById('otp-destination');
    const otpInput = document.getElementById('otp-input');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const goBackToRegisterLink = document.getElementById('go-back-to-register-link');
    const authorityOtpForm = document.getElementById('authority-otp-form');
    const authorityOtpDestination = document.getElementById('authority-otp-destination');
    const authorityOtpInput = document.getElementById('authority-otp-input');
    const authorityVerifyOtpBtn = document.getElementById('authority-verify-otp-btn');
    const authorityGoBackLink = document.getElementById('authority-go-back-link');
    const openBtn = document.getElementById("open-chat-btn");
    const closeBtn = document.getElementById("close-chat-btn");
    const chatContainer = document.getElementById("chat-container");
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const promptBtns = document.querySelectorAll('.prompt-btn');
    const publicSiteWrapper = document.getElementById('public-site-wrapper');
    const authorityDashboard = document.getElementById('authority-dashboard');
    const dashboardLogoutBtn = document.getElementById('dashboard-logout-btn');

    // --- Navigation Links ---
    const navLinks = {
        home: document.getElementById('nav-home'),
        features: document.getElementById('nav-features'),
        map: document.getElementById('nav-map'),
        reports: document.getElementById('nav-reports'),
        contact: document.getElementById('nav-contact')
    };

    const sections = {
        home: document.getElementById('hero-section'),
        features: document.getElementById('features-section'),
        map: document.getElementById('map-section'),
        reports: document.getElementById('reports-section'),
        contact: document.getElementById('contact-section')
    };

    const dashboardLinks = {
        overview: document.getElementById('link-overview'),
        autoDetection: document.getElementById('link-auto-detection'),
        citizenReports: document.getElementById('link-citizen-reports'),
        hotspotMap: document.getElementById('link-hotspot-map')
    };
    const dashboardViews = {
        overview: document.getElementById('view-overview'),
        autoDetection: document.getElementById('view-auto-detection'),
        citizenReports: document.getElementById('view-citizen-reports'),
        hotspotMap: document.getElementById('view-hotspot-map')
    };

    // --- Master function to switch between sections ---
    function showSection(sectionKey) {
        // Hide all sections
        for (const key in sections) {
            sections[key].classList.add('hidden');
        }
        // Deactivate all nav links
        for (const key in navLinks) {
            navLinks[key].classList.remove('active');
        }
        // Show the one section and activate the one link we want
        sections[sectionKey].classList.remove('hidden');
        navLinks[sectionKey].classList.add('active');

        // **IMPORTANT MAP FIX**: If we are showing the map, we need to refresh its size.
        if (sectionKey === 'map' && map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 10); // A small delay ensures the container is visible before resizing
        }
    }
    // --- Initialize the Interactive Map ---
    function initializeMap() {
        if (document.getElementById('map-container') && !map) {
            // Set coordinates for Indore, Madhya Pradesh
            const indoreCoords = [22.7196, 75.8577];
            map = L.map('map-container').setView(indoreCoords, 12);

            // Add the map background from OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // --- SIMULATE GETTING DATA FROM AN API ---
            // In a real app, you would use fetch() here to get live data.
            // This is example data for hotspots around Indore.
            const hotspotData = [
                { lat: 22.7196, lng: 75.8577, risk: 'high', name: 'Rajwada Palace Area' },
                { lat: 22.7533, lng: 75.8937, risk: 'high', name: 'Vijay Nagar' },
                { lat: 22.7202, lng: 75.8812, risk: 'medium', name: 'AB Road' },
                { lat: 22.6844, lng: 75.8422, risk: 'medium', name: 'Annapurna' },
                { lat: 22.7276, lng: 75.8197, risk: 'safe', name: 'Sukhliya' },
                { lat: 22.6936, lng: 75.9228, risk: 'safe', name: 'Bicholi Mardana' }
            ];

            // Define colors for our legend
            const riskColors = {
                high: 'red',
                medium: 'yellow',
                safe: 'green'
            };

            // Add circles to the map based on the API data
            hotspotData.forEach(spot => {
                L.circle([spot.lat, spot.lng], {
                    color: riskColors[spot.risk],
                    fillColor: riskColors[spot.risk],
                    fillOpacity: 0.4,
                    radius: 800 // Radius in meters
                }).addTo(map).bindPopup(`<b>${spot.name}</b><br>Risk Level: ${spot.risk}`);
            });
        }
    }
    // --- NEW: Function to initialize the DASHBOARD map ---
    function initializeDashboardMap() {
        // This guard prevents the map from being created more than once
        if (document.getElementById('dashboard-map-container') && !dashboardMap) {
            const indoreCoords = [22.7196, 75.8577];
            dashboardMap = L.map('dashboard-map-container').setView(indoreCoords, 13);

            // Add a dark-themed map background
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(dashboardMap);

            // You can add a fetch call here later to get live data. For now, we use example data.
            const hotspotData = [
                { lat: 22.7196, lng: 75.8577, color: 'red' },
                { lat: 22.7533, lng: 75.8937, color: 'blue' },
                { lat: 22.7202, lng: 75.8812, color: 'orange' },
                { lat: 22.6844, lng: 75.8422, color: 'orange' },
                { lat: 22.7276, lng: 75.8197, color: 'green' }
            ];
            hotspotData.forEach(spot => {
                L.circle([spot.lat, spot.lng], { color: spot.color, fillColor: spot.color, fillOpacity: 0.6, radius: 400 }).addTo(dashboardMap);
            });
        }
    }
    // --- Function to update UI based on login state ---
    function updateLoginUI() {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (token && userString) {
            const user = JSON.parse(userString);

            if (user.userType === 'Authority') {
                // If user is an Authority, show the dashboard and hide the public site
                if (publicSiteWrapper) publicSiteWrapper.classList.add('hidden');
                if (authorityDashboard) authorityDashboard.classList.remove('hidden');
                showDashboardView('overview'); // Show the overview page by default
            } else {
                // If user is a Citizen, just update the public navbar
                if (publicSiteWrapper) publicSiteWrapper.classList.remove('hidden');
                if (authorityDashboard) authorityDashboard.classList.add('hidden');

                const currentHour = new Date().getHours();
                let greeting = (currentHour < 12) ? 'Good morning' : (currentHour < 18) ? 'Good afternoon' : 'Good evening';
                if (greetingText) greetingText.textContent = greeting;
                if (userNameDisplay) userNameDisplay.textContent = user.name;

                if (loggedInView) loggedInView.classList.remove('hidden');
                if (loggedInView) loggedInView.classList.add('flex');
                if (loggedOutView) loggedOutView.classList.add('hidden');
            }
        } else {
            // User is logged out, show public site and login buttons
            if (authorityDashboard) authorityDashboard.classList.add('hidden');
            if (publicSiteWrapper) publicSiteWrapper.classList.remove('hidden');

            if (loggedInView) loggedInView.classList.add('hidden');
            if (loggedInView) loggedInView.classList.remove('flex');
            if (loggedOutView) loggedOutView.classList.remove('hidden');
        }
    }

    // --- Logout functionality ---
    // --- Reusable Logout Function ---
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('You have been logged out.');

        // Hide dashboard and show public site
        if (authorityDashboard) authorityDashboard.classList.add('hidden');
        if (publicSiteWrapper) publicSiteWrapper.classList.remove('hidden');

        updateLoginUI(); // Update the navbar to show login buttons
        showSection('home'); // Go back to the home page
    }

    // --- Add listeners to BOTH logout buttons ---
    logoutBtn.addEventListener('click', logout);
    dashboardLogoutBtn.addEventListener('click', logout);

    // --- Add click listeners to the navbar ---
    navLinks.home.addEventListener('click', () => showSection('home'));
    navLinks.features.addEventListener('click', () => showSection('features'));
    // navLinks.volunteer.addEventListener('click', () => showSection('volunteer'));
    navLinks.map.addEventListener('click', () => showSection('map'), initializeMap());
    navLinks.reports.addEventListener('click', () => showSection('reports'));
    navLinks.contact.addEventListener('click', () => showSection('contact'));

    // --- Initial setup on page load ---
    showSection('home'); // Show home section by default
    initializeMap(); // Create the map in the background
    updateLoginUI();// <-- ADD THIS LINE
    // --- NEW: Master function to switch between DASHBOARD views ---
    function showDashboardView(viewKey) {
        // Hide all dashboard views
        for (const key in dashboardViews) {
            if (dashboardViews[key]) dashboardViews[key].classList.add('hidden');
        }
        // Deactivate all dashboard sidebar links
        for (const key in dashboardLinks) {
            if (dashboardLinks[key]) {
                dashboardLinks[key].classList.remove('bg-blue-600', 'text-white');
                dashboardLinks[key].classList.add('text-gray-400', 'hover:bg-gray-700');
            }
        }

        // Show the one view we want
        if (dashboardViews[viewKey]) {
            dashboardViews[viewKey].classList.remove('hidden');
        }
        // Activate the one link we want
        if (dashboardLinks[viewKey]) {
            dashboardLinks[viewKey].classList.add('bg-blue-600', 'text-white');
            dashboardLinks[viewKey].classList.remove('text-gray-400', 'hover:bg-gray-700');
        }
        if (viewKey === 'hotspotMap') {
            initializeDashboardMap(); // Initialize map on first click
            if (dashboardMap) {
                setTimeout(() => { dashboardMap.invalidateSize() }, 10); // Refresh map size
            }
        }
    }

    // --- NEW: Add click listeners to the dashboard sidebar ---
    if (dashboardLinks.overview) dashboardLinks.overview.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('overview'); });
    if (dashboardLinks.autoDetection) dashboardLinks.autoDetection.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('autoDetection'); });
    if (dashboardLinks.citizenReports) dashboardLinks.citizenReports.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('citizenReports'); });
    if(dashboardLinks.hotspotMap) dashboardLinks.hotspotMap.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('hotspotMap'); });
    // --- Modal Event Listeners --- // <-- ADD THIS SECTION
    authorityLoginBtn.addEventListener('click', () => {
        // Reset to the login form every time the modal is opened
        authorityLoginForm.classList.remove('hidden');
        authorityRegisterForm.classList.add('hidden');
        showAuthorityLoginBtn.classList.add('text-blue-600', 'border-blue-600');
        showAuthorityLoginBtn.classList.remove('text-gray-500');
        showAuthorityRegisterBtn.classList.add('text-gray-500');
        showAuthorityRegisterBtn.classList.remove('text-blue-600', 'border-blue-600');

        authorityLoginModal.classList.remove('hidden');
    });
    closeAuthorityModalBtn.addEventListener('click', () => {
        authorityLoginModal.classList.add('hidden');
    });

    // Close modal if user clicks outside of it
    authorityLoginModal.addEventListener('click', (e) => {
        if (e.target === authorityLoginModal) {
            authorityLoginModal.classList.add('hidden');
        }
    });

    // ADD THIS NEW BLOCK FOR AUTHORITY TAB SWITCHING
    showAuthorityLoginBtn.addEventListener('click', () => {
        authorityLoginForm.classList.remove('hidden');
        authorityRegisterForm.classList.add('hidden');
        // Style the tabs
        showAuthorityLoginBtn.classList.add('text-blue-600', 'border-blue-600');
        showAuthorityLoginBtn.classList.remove('text-gray-500');
        showAuthorityRegisterBtn.classList.add('text-gray-500');
        showAuthorityRegisterBtn.classList.remove('text-blue-600', 'border-blue-600');
    });

    showAuthorityRegisterBtn.addEventListener('click', () => {
        authorityLoginForm.classList.add('hidden');
        authorityRegisterForm.classList.remove('hidden');
        // Style the tabs
        showAuthorityRegisterBtn.classList.add('text-blue-600', 'border-blue-600');
        showAuthorityRegisterBtn.classList.remove('text-gray-500');
        showAuthorityLoginBtn.classList.add('text-gray-500');
        showAuthorityLoginBtn.classList.remove('text-blue-600', 'border-blue-600');
    });
    // (Your existing Authority Modal listeners are here)
    // ...
    authorityGoBackLink.addEventListener('click', (e) => {
        e.preventDefault();
        authorityOtpForm.classList.add('hidden');
        authorityRegisterForm.classList.remove('hidden');
    });
    // --- CITIZEN MODAL LISTENERS ---
    citizenLoginBtn.addEventListener('click', () => {
        // Reset to login form every time it opens
        otpForm.classList.add('hidden'); // <-- Add this line
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        citizenModal.classList.remove('hidden');
    });
    closeCitizenModalBtn.addEventListener('click', () => {
        citizenModal.classList.add('hidden');
    });

    citizenModal.addEventListener('click', (e) => {
        if (e.target === citizenModal) {
            citizenModal.classList.add('hidden');
        }
    });

    // Event listener for switching to the Register form
    showRegisterFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        otpForm.classList.add('hidden'); // <-- Add this line
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    // Event listener for switching back to the Login form
    showLoginFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        otpForm.classList.add('hidden'); // <-- Add this line
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });


    // --- CHATBOT MODAL LISTENERS ---
    openBtn.addEventListener("click", () => {
        chatContainer.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
        chatContainer.classList.add("hidden");
    });

    // Optional: Close the chatbot if the user presses the 'Escape' key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !chatbotModal.classList.contains('hidden')) {
            chatbotModal.classList.add('hidden');
        }
    });
    // Listener for the "Join as Volunteer" button on the hero page
    // joinVolunteerBtn.addEventListener('click', () => {
    //     // We simply call our master function to switch to the 'volunteer' view
    //     showSection('volunteer');
    // });
    // (Your existing modal event listeners are here...)
    // ...

    // --- CONNECTING FORMS TO BACKEND ---

    // !!! IMPORTANT: Replace these with your actual backend URLs and Port !!!
    const AUTH_API_URL = 'http://localhost:5000/api/auth'; // Example for auth routes
    const CONTACT_API_URL = 'http://localhost:5000/api/contact'; // Example for contact route
    // const VOLUNTEER_API_URL = 'http://localhost:5000/api/volunteer/join';
    const SOS_API_URL = 'http://localhost:5000/api/emergency/sos';
    const SEND_OTP_API_URL = 'http://localhost:5000/api/auth/send-otp';
    const ASSISTANT_API_URL = 'http://localhost:5000/api/assistant';
    // 1. Connect Citizen Registration Form
    // 1. Connect Citizen Registration Form (Step 1: Send OTP)
    // 1. Citizen Registration (Step 1: Call /register to send OTP)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        pendingRegistrationData = {
            name: document.getElementById('register-name').value,
            password: document.getElementById('register-password').value,
            userType: 'Citizen'
        };
        const emailOrPhone = document.getElementById('register-email').value;
        if (emailOrPhone.includes('@')) { pendingRegistrationData.email = emailOrPhone; } else { pendingRegistrationData.phone = emailOrPhone; }

        fetch(`${AUTH_API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pendingRegistrationData) })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.message); });
                return res.json();
            }).then(data => {
                if (data.success) {
                    alert('A verification code has been sent.');
                    loginForm.classList.add('hidden');
                    registerForm.classList.add('hidden');
                    otpForm.classList.remove('hidden');
                    otpDestination.textContent = emailOrPhone;
                }
            }).catch(error => { alert(`Error: ${error.message}`); });
    });

    // Citizen Verification (Step 2: Call /verify)
    verifyOtpBtn.addEventListener('click', () => {
        const otp = otpInput.value;
        if (!otp) return alert('Please enter the OTP.');

        // Use the email/phone from the data we saved
        const verificationData = { otp, email: pendingRegistrationData.email, phone: pendingRegistrationData.phone };

        fetch(`${AUTH_API_URL}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(verificationData) })
            .then(res => res.json()).then(data => {
                if (data.token) {
                    alert(data.message);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateLoginUI();
                    citizenModal.classList.add('hidden');
                } else { throw new Error(data.message || 'Verification failed.'); }
            }).catch(error => { alert(`Error: ${error.message}`); });
    });

    // NEW: Handle the "Go Back" link on the OTP form
    goBackToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        otpForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });


    // 2. Connect Citizen Login Form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginData = { password: document.getElementById('login-password').value };
        const emailOrPhone = document.getElementById('login-email').value;
        if (emailOrPhone.includes('@')) {
            loginData.email = emailOrPhone;
        } else {
            loginData.phone = emailOrPhone;
        }

        fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => { throw new Error(errData.message || 'Login failed.'); });
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    alert(`Welcome back, ${data.user.name}!`);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateLoginUI();
                    citizenModal.classList.add('hidden');
                }
            })
            .catch(error => {
                alert(`Login Failed: ${error.message}`);
            });
    });

    // 3. Connect Authority Registration Form (Step 1: Send OTP)
    authorityRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        pendingRegistrationData = {
            name: document.getElementById('register-auth-name').value,
            badgeId: document.getElementById('register-badge-id').value,
            email: document.getElementById('register-auth-email').value,
            station: document.getElementById('station').value,
            password: document.getElementById('register-auth-password').value,
            userType: 'Authority'
        };

        fetch(`${AUTH_API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pendingRegistrationData) })
            .then(res => res.json()).then(data => {
                if (data.success) {
                    alert('A verification code has been sent to the official email.');
                    authorityLoginForm.classList.add('hidden');
                    authorityRegisterForm.classList.add('hidden');
                    authorityOtpForm.classList.remove('hidden');
                    authorityOtpDestination.textContent = pendingRegistrationData.email;
                } else { throw new Error(data.message); }
            }).catch(error => { alert(`Error: ${error.message}`); });
    });

    // NEW: Authority Verification (Step 2: Call /verify)
    authorityVerifyOtpBtn.addEventListener('click', () => {
        const otp = authorityOtpInput.value;
        if (!otp) return alert('Please enter the OTP.');

        const verificationData = { otp, email: pendingRegistrationData.email };

        fetch(`${AUTH_API_URL}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(verificationData) })
            .then(res => res.json()).then(data => {
                if (data.token) {
                    alert(data.message);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateLoginUI();
                    authorityLoginModal.classList.add('hidden');
                } else { throw new Error(data.message || 'Verification failed.'); }
            }).catch(error => { alert(`Error: ${error.message}`); });
    });

    // 4. Connect Authority Login Form
    authorityLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginData = {
            badgeId: document.getElementById('badge-id').value,
            password: document.getElementById('authority-login-password').value
        };

        fetch(`${AUTH_API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginData) })
            .then(res => res.json()).then(data => {
                if (data.token) {
                    alert(`Welcome back, ${data.user.name}!`);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateLoginUI();
                    authorityLoginModal.classList.add('hidden');
                } else { throw new Error(data.message || 'Login failed.'); }
            }).catch(error => { alert(error.message); });
    });

    // 5. Connect the Contact Us Form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contactData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };
        fetch(CONTACT_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactData) })
            .then(res => { if (!res.ok) throw new Error('Message could not be sent.'); return res.json(); })
            .then(data => { alert('Message sent successfully!'); contactForm.reset(); })
            .catch(error => { alert(error.message); });
    });
    // 6. Connect the "Join as Volunteer" Form
    // volunteerForm.addEventListener('submit', (e) => {
    //     // This is the most important line - it STOPS the page from reloading
    //     e.preventDefault();

    // const volunteerData = {
    //         name: document.getElementById('full-name').value,
    //         contact: document.getElementById('contact-number').value,
    //         email: document.getElementById('email').value,
    //         skills: document.getElementById('skills').value,
    //         location: document.getElementById('location').value
    //     };

    //     fetch(VOLUNTEER_API_URL, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(volunteerData)
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw new Error('Application could not be submitted. Please try again.');
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             console.log('Volunteer Application Success:', data);
    //             alert('Thank you for your application! We will be in touch soon.');
    //             volunteerForm.reset(); // This will clear the form after successful submission
    //         })
    //         .catch(error => {
    //             console.error('Volunteer Application Error:', error);
    //             alert(error.message);
    //         });
    // });

    // =======================================================
    // --- SOS BUTTON LOGIC ---
    // =======================================================
    sosBtn.addEventListener('click', () => {
        // First, check if the user is logged in
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            alert('You must be logged in to send an SOS alert.');
            // Optional: open the login modal
            citizenLoginBtn.click();
            return;
        }

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        // Disable the button to prevent multiple clicks
        sosBtn.disabled = true;
        sosBtn.textContent = 'SENDING SOS...';

        // Get the user's current position
        navigator.geolocation.getCurrentPosition(
            // Success Callback
            (position) => {
                const user = JSON.parse(userString);

                const payload = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    userId: user.id // Get user ID from localStorage
                };

                // Send the location to the backend
                fetch(SOS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Send authentication token
                    },
                    body: JSON.stringify(payload)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert('SOS sent successfully! Help is being notified.');
                        } else {
                            throw new Error(data.message || 'Failed to send SOS.');
                        }
                    })
                    .catch(error => {
                        console.error('SOS Error:', error);
                        alert(`Error sending SOS: ${error.message}`);
                    })
                    .finally(() => {
                        // Re-enable the button whether it succeeded or failed
                        sosBtn.disabled = false;
                        sosBtn.textContent = 'EMERGENCY SOS';
                    });
            },
            // Error Callback
            (error) => {
                alert(`Location Error: ${error.message}`);
                sosBtn.disabled = false;
                sosBtn.textContent = 'EMERGENCY SOS';
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000 // Stop trying after 10 seconds
            }
        );
    });


    // =======================================================
    // --- CHATBOT INTERACTIVE LOGIC ---
    // =======================================================

    // Helper function to add a message to the chat window
    function addMessageToChat(sender, text) {
        const messageWrapper = document.createElement('div');
        const messageBubble = document.createElement('div');

        messageBubble.classList.add('p-4', 'rounded-lg', 'inline-block', 'max-w-xl');
        messageWrapper.classList.add('mb-4');

        if (sender === 'user') {
            messageWrapper.classList.add('text-right');
            messageBubble.classList.add('bg-blue-600', 'text-white');
        } else {
            messageWrapper.classList.add('text-left');
            messageBubble.classList.add('bg-gray-800', 'text-white');
        }

        messageBubble.textContent = text;
        messageWrapper.appendChild(messageBubble);
        chatLog.querySelector('.max-w-3xl').appendChild(messageWrapper);

        // Scroll to the bottom
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Function to handle sending a message to the backend
    async function handleSendMessage(messageText) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to use the assistant.');
            return;
        }

        addMessageToChat('user', messageText);
        addMessageToChat('bot', 'Typing...'); // Show typing indicator

        try {
            const response = await fetch(ASSISTANT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageText })
            });

            // Remove the "Typing..." bubble
            const typingBubble = chatLog.querySelector('.max-w-3xl').lastChild;
            typingBubble.remove();

            if (!response.ok) {
                throw new Error('The AI assistant is not available right now.');
            }

            const data = await response.json();
            addMessageToChat('bot', data.reply);

        } catch (error) {
            addMessageToChat('bot', `Sorry, an error occurred: ${error.message}`);
        }
    }

    // Listen for form submission (when user types and clicks send)
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            handleSendMessage(userMessage);
            chatInput.value = '';
        }
    });

    // Listen for clicks on the prompt buttons
    promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const messageText = btn.querySelector('p').textContent;
            handleSendMessage(messageText);
        });
    });
}); // Keep this closing bracket for DOMContentLoaded 