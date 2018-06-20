const searchEmail = document.getElementById('searchEmail')
const errorEmailText = document.getElementById('errorEmailText')

// DEBOUNCE https://gist.github.com/nmsdvid/8807205
const debounceEvent = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
};

// REGEX https://www.w3resource.com/javascript/form/email-validation.php
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


function findUser (el){
  checkUser(searchEmail.value);
}

function checkUser(value) {
  errorEmailText.innerHTML = ''
  errorEmailText.style.color = 'black'
  if (value.match(mailformat)) {
    var res = new XMLHttpRequest()

    res.open('POST', '/' + value)
    res.onload = onload
    res.send(value)

    function onload(el) {
      if (res.status !== 200) {
        throw new Error('Could not delete!')
      } else {
        //console.log(el)
      }
    }

    fetch('/' + value, {method: 'POST'})
       .then(response => response.json())
       .then(response => {
         if (response.message === 'found') {
           errorEmailText.innerHTML = 'Email niet beschikbaar'
           errorEmailText.style.color = 'red'
         } else {
           errorEmailText.innerHTML = 'Email is beschikbaar'
           errorEmailText.style.color = 'green'
         }
       })
  }
}

searchEmail.addEventListener('keyup', debounceEvent(findUser, 200));
