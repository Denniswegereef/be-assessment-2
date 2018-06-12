var searchItem = document.getElementById('searchItem')
var users = document.getElementsByClassName('user-card')

function findUsers() {
  for (var i = 0; i < users.length; i++) {
    users[i].id.includes(searchItem.value.toLowerCase()) ? users[i].style.display = 'block' : users[i].style.display = 'none';
  }
}

searchItem.addEventListener('keyup', findUsers);
