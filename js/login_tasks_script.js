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
  updateCheckboxUI();

  // Click on the visual box toggles the checkbox
  checkboxWrap.addEventListener('click', function(e){
    checkbox.checked = !checkbox.checked;
    updateCheckboxUI();
  });

  // Submit handler: simple validation and fake network response
  form.addEventListener('submit', function(e){
    e.preventDefault();
    btn.disabled = true;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // minimal checks
    if(!email || !password){
      alert('Please fill in email and password.');
      btn.disabled = false;
      return;
    }
    if(!checkbox.checked){
      alert('You must agree to the terms of service to continue.');
      btn.disabled = false;
      return;
    }

    // fake "creating" state
    btn.textContent = 'Creating…';
    setTimeout(()=> {
      btn.textContent = 'Create Account';
      btn.disabled = false;
      alert('Account created (demo).');
      // for demo, clear password
      document.getElementById('password').value = '';
      window.location.href = "index.html?userid=xvein1";
    }, 900);
  });
})();