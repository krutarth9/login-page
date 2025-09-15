document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const pandaContainer = document.getElementById('panda-container');
    const contentPages = document.getElementById('content-pages');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const registerForm = document.getElementById('register-form');
    const userInfoLink = document.getElementById('user-info-link');
    const userDetailsContent = document.getElementById('user-details-content');
    const feedbackForm = document.getElementById('feedback-form');

    pandaContainer.addEventListener('click', () => {
        // Prevent clicking again while animating
        if (pandaContainer.classList.contains('animating')) return;

        pandaContainer.classList.add('animating');

        body.classList.toggle('dark');
        body.classList.toggle('light');
        
        const isLightOn = !body.classList.contains('dark');

        // The 'pulling' class will now be used to show the active (down) state
        if (isLightOn) {
            pandaContainer.classList.add('pulling');
            document.querySelector('.rope').style.height = '100px';
            contentPages.classList.remove('hidden');
            menuToggle.classList.remove('hidden');
        } else {
            pandaContainer.classList.remove('pulling');
            document.querySelector('.rope').style.height = '0px';
            contentPages.classList.add('hidden');
            menuToggle.classList.add('hidden');
            mainNav.classList.remove('open'); // Close nav if light is turned off
        }

        setTimeout(() => {
            pandaContainer.classList.remove('animating');
        }, 1000); // Match the longest transition time
    });

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = link.getAttribute('href').substring(1);

            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });

            // Show the target page
            document.getElementById(targetId).classList.add('active');

            // Close the nav menu
            mainNav.classList.remove('open');
        });
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        // Get form data
        const formData = new FormData(registerForm);
        const name = formData.get('name');
        const contact = formData.get('contact');
        const email = formData.get('email');
        const address = formData.get('address');

        const userId = document.getElementById('user-id').value;
        const formMode = document.getElementById('form-mode').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (formMode === 'update') {
            // Find and update the user
            users = users.map(user => {
                if (user.id == userId) {
                    return { id: user.id, name, contact, email, address };
                }
                return user;
            });
            alert('Update successful!');
            document.querySelector('.nav-link[href="#user-info"]').click();
        } else {
            // Add a new user with a unique ID
            const newUser = { id: Date.now(), name, contact, email, address };
            users.push(newUser);
            alert(`Registration successful for ${name}!`);
        }

        // Save the updated array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update the UI with the new or updated data
        displayUsers(users);

        // Reset the form fields
        registerForm.reset();

        // Always reset form back to register mode after submission
        document.getElementById('form-mode').value = 'register';
        document.getElementById('user-id').value = '';
        registerForm.querySelector('.form-button').textContent = 'Register';

    });

    // Event delegation for update and delete buttons
    userDetailsContent.addEventListener('click', (e) => {
        const target = e.target;
        const userId = target.getAttribute('data-id');
        if (!userId) return;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (target.classList.contains('update-btn')) {
            // Handle Update
            const userToUpdate = users.find(user => user.id == userId);
            if (userToUpdate) {
                // Populate the form with existing data
                document.getElementById('name').value = userToUpdate.name;
                document.getElementById('contact').value = userToUpdate.contact;
                document.getElementById('email').value = userToUpdate.email;
                document.getElementById('address').value = userToUpdate.address;
                document.getElementById('user-id').value = userToUpdate.id;

                // Change form to "update" mode
                document.getElementById('form-mode').value = 'update';
                registerForm.querySelector('.form-button').textContent = 'Update';

                // Navigate to the login page
                document.querySelector('.nav-link[href="#login"]').click();
            }
        }

        if (target.classList.contains('delete-btn')) {
            // Handle Delete
            if (confirm('Are you sure you want to delete this user\'s information?')) {
                users = users.filter(user => user.id != userId);
                localStorage.setItem('users', JSON.stringify(users));
                displayUsers(users);
            }
        }
    });

    // Function to display all users
    function displayUsers(users) {
        userDetailsContent.innerHTML = ''; // Clear current content

        if (users && users.length > 0) {
            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = `
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Contact:</strong> ${user.contact}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Address:</strong> ${user.address}</p>
                    <div class="actions">
                        <button class="form-button update-btn" data-id="${user.id}">Update</button>
                        <button class="form-button delete-btn" data-id="${user.id}">Delete</button>
                    </div>
                `;
                userDetailsContent.appendChild(userCard);
            });
            userInfoLink.classList.remove('hidden');
        } else {
            userDetailsContent.innerHTML = '<p>No user registered yet. Please fill out the form on the Login page.</p>';
            userInfoLink.classList.add('hidden');
        }
    }

    // Check for saved user data on page load
    function checkSavedData() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        displayUsers(users);
    }

    checkSavedData();

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from reloading the page

        // Show a success message
        alert('Thank you for your feedback!');

        // Reset the form fields
        feedbackForm.reset();
    });
});