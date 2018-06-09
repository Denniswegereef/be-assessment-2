var remove = document.getElementById('js-remove')

if (remove) {
  remove.addEventListener('click', onremove)
}


function remove(req, res) {
  var id = req.params.id

  data = data.filter(function (value) {
    return value.id !== id
  })

  res.json({status: 'ok'})
}

function onremove(ev) {
  console.log('click')
  var node = ev.target
  var id = node.dataset.id

  var res = new XMLHttpRequest()

  res.open('DELETE', '/' + id)
  res.onload = onload
  res.send()

  function onload() {
    if (res.status !== 200) {
      throw new Error('Could not delete!')
    }

    //window.location = '/'
  }

  fetch('/' + id, {method: 'delete'})
    .then(onresponse)
    .then(onload, onfail)

  function onresponse(res) {
    //return res.json()
  }

  function onload() {
    console.log('fucked')
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not delete!')
  }

}
