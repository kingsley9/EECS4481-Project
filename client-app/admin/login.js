const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);

  axios.post('/login', {
    username: formData.get('username'),
    password: formData.get('password'),
  })
    .then((response) => {
      alert(response.data);
    })
    .catch((error) => {
      alert(error.response.data);
    });
});
