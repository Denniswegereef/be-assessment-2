var password = document.getElementById('password')
var passwordAgain = document.getElementById('passwordAgain')
var text = document.getElementById('safetext')
var safebar = document.getElementById('safebar')

console.log(password)
console.log(passwordAgain)

if (password.value.length < 1) {
  text.innerHTML = ''
  safebar.style.width = "0%";
}

function checkPassword() {
  console.log(password.value)
  console.log(passwordAgain.value)

  var hasNumber = /\d/;
  hasNumber.test(password.value)

  if (password.value === passwordAgain.value) {
    text.innerHTML = ''
    if (password.value.length < 6) {
      safebar.style.width = "66%";
      safebar.style.backgroundColor = "orange";
      text.innerHTML = 'Wachtwoord moet minimaal 6 karakters hebben'
    } else {
      safebar.style.width = "100%";
      safebar.style.backgroundColor = "green";
      text.innerHTML = ''
    }
  } else {
    if (password.value.length > 1) {
      safebar.style.width = "33%";
      text.innerHTML = 'Wachtwoord komt niet overeen'
    }
  }
}


password.addEventListener('keyup', checkPassword);
passwordAgain.addEventListener('keyup', checkPassword);
