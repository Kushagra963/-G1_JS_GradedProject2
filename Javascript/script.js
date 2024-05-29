document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.getElementById('login-page');
    const resumePage = document.getElementById('resume-page');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const resumeContainer = document.getElementById('resume-container');
    const logoutButton = document.getElementById('logout');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-btn');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const noResultsMessage = document.getElementById('no-results');

    const storedUsername = 'user';
    const storedPassword = 'password';
    let applicants = []; // Array to store all applicants
    let filteredApplicants = []; // Array to store filtered applicants
    let currentIndex = 0;

    // Sample JSON data
    const resumes = [
        { name: "John Doe", email: "john@example.com", phone: "555-555-5555", experience: "5 years", job: "Developer" },
        { name: "Jane Smith", email: "jane@example.com", phone: "555-555-5556", experience: "3 years", job: "Designer" },
        { name: "Alice Johnson", email: "alice@example.com", phone: "555-555-5557", experience: "2 years", job: "Manager" }
    ];

    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if (username === storedUsername && password === storedPassword) {
            localStorage.setItem('loggedIn', 'true');
            showPage(resumePage);
            loadApplicants();
            displayApplicant();
            history.pushState(null, null, location.href); // To handle back button
        } else {
            errorMessage.textContent = 'Invalid username/password';
        }
    }

    function handleLogout() {
        localStorage.removeItem('loggedIn');
        showPage(loginPage);
    }

    function loadApplicants() {
        applicants = resumes;
        filteredApplicants = applicants;
        currentIndex = 0;
        updateNavigation();
    }

    function displayApplicant() {
        if (filteredApplicants.length === 0) {
            noResultsMessage.textContent = 'Invalid search or No applications for this job';
            resumeContainer.innerHTML = '';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            noResultsMessage.textContent = '';
            const applicant = filteredApplicants[currentIndex];
            resumeContainer.innerHTML = `
                <div class="resume">
                    <h3>${applicant.name}</h3>
                    <p>Email: ${applicant.email}</p>
                    <p>Phone: ${applicant.phone}</p>
                    <p>Experience: ${applicant.experience}</p>
                    <p>Job: ${applicant.job}</p>
                </div>
            `;
            updateNavigation();
        }
    }

    function updateNavigation() {
        prevButton.style.display = currentIndex > 0 ? 'inline-block' : 'none';
        nextButton.style.display = currentIndex < filteredApplicants.length - 1 ? 'inline-block' : 'none';
    }

    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            filteredApplicants = applicants.filter(applicant => applicant.job.toLowerCase().includes(searchTerm));
        } else {
            filteredApplicants = applicants;
        }
        currentIndex = 0;
        displayApplicant();
    }

    function showNextApplicant() {
        if (currentIndex < filteredApplicants.length - 1) {
            currentIndex++;
            displayApplicant();
        }
    }

    function showPrevApplicant() {
        if (currentIndex > 0) {
            currentIndex--;
            displayApplicant();
        }
    }

    function checkLogin() {
        if (localStorage.getItem('loggedIn') === 'true') {
            showPage(resumePage);
            loadApplicants();
            displayApplicant();
        } else {
            showPage(loginPage);
        }
    }

    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    searchButton.addEventListener('click', handleSearch);
    prevButton.addEventListener('click', showPrevApplicant);
    nextButton.addEventListener('click', showNextApplicant);

    window.addEventListener('popstate', () => {
        history.pushState(null, null, location.href);
    });

    checkLogin();
});
