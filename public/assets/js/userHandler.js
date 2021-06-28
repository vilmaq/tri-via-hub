const handleLogin = async (event) => {
  event.preventDefault();

  const loginToast = $("#loginToast");
  const showLoginToast = new bootstrap.Toast(loginToast);

  const usernameEmail = $("#usernameEmail").val();
  const password = $("#password").val();

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      usernameEmail,
      password,
    }),
  };

  const response = await fetch("/auth/login", options);

  if (response.status !== 200) {
    showLoginToast.show();
  } else {
    window.location.replace("/dashboard");
  }
};

const handleSignup = async (event) => {
  event.preventDefault();

  const signupToast = $("#signupToast");
  const showSignupToast = new bootstrap.Toast(signupToast);
  const passwordToast = $("#passwordToast");
  const showPasswordToast = new bootstrap.Toast(passwordToast);

  const first_name = $("#first_name").val();
  const last_name = $("#last_name").val();
  const username = $("#username").val();
  const email = $("#email").val();
  const password = $("#password").val();
  const confirmPassword = $("#confirmPassword").val();

  if (!first_name || !last_name || !username || !email || !password) {
    showSignupToast.show();
    return;
  }

  if (password === confirmPassword) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        first_name,
        last_name,
        username,
        email,
        password,
      }),
    };

    const response = await fetch("/auth/signup", options);

    if (response.status !== 201) {
      showSignupToast.show();
    } else {
      window.location.replace("/dashboard");
    }
  } else {
    showPasswordToast.show();
  }
};

const handleLogout = async (event) => {
  event.preventDefault();

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  const response = await fetch("/auth/logout", options);

  if (response.status !== 200) {
    console.log("FAILED TO LOG OUT");
  } else {
    window.location.replace("/login");
  }
};

$("#loginForm").submit(handleLogin);
$("#signupForm").submit(handleSignup);
$("#logout-btn").click(handleLogout);
