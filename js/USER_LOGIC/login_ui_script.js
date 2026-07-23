import * as userAuth from './user_auth.js';

// Basic JS to mimic the behavior: toggle checkbox UI and handle submit
(function(){
  const checkboxWrap = document.getElementById('checkboxWrap');
  const checkbox = document.getElementById('tos');
  const form = document.getElementById('signupForm');
  const btn = document.getElementById('createBtn');

  // Keep visual state synced with actual checkbox
  function updateCheckboxUI(){
    if(checkbox.checked) checkboxWrap.classList.add('checked');
    else checkboxWrap.classList.remove('checked');
  }

  if(window.location.href.includes("signup_page.html")) {
    updateCheckboxUI();

    // Click on the visual box toggles the checkbox
    checkboxWrap.addEventListener('click', function(e){
      checkbox.checked = !checkbox.checked;
      updateCheckboxUI();
    });

    // Submit handler: simple validation and fake network response
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // minimal checks
      if(!firstName || !lastName || !email || !password) {
        alert('Please fill in all form fields.');
        btn.disabled = false;
        return;
      }
      
      if(!checkbox.checked){
        alert('You must agree to the terms of service to continue.');
        btn.disabled = false;
        return;
      }

      const signupResponse = await userAuth.signup(firstName, lastName, email, password);
    });
  }
  else {
    // Submit handler: simple validation and fake network response
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // minimal checks
      if(!email || !password){
        alert('Please fill in email and password.');
        btn.disabled = false;
        return;
      }

      const loginResponse = await userAuth.login(email, password);
    });
  }
})();