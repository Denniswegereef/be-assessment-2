var searchItem = document.getElementById('searchItem')
var users = document.getElementsByClassName('user-card')

function findUsers() {
  for (var i = 0; i < users.length; i++) {
    if (users[i].id.includes(searchItem.value.toLowerCase())) {
      users[i].style.display = 'block'
    } else {
      users[i].style.display = 'none'
    }
  }
}

searchItem.addEventListener('keyup', findUsers);
