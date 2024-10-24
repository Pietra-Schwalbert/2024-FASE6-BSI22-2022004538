const mainForm = document.querySelector('form')

void async function () {

  VerifyCurrentUserLoginState()
  await UpdateUsersList()
}()

document.addEventListener('submit', async (event) => {
  event.preventDefault()
  const action = event.submitter.dataset.action ?? null
  const currentForm = event.target
  
  if (action === 'delete') {
    const id = currentForm.dataset.id
    const method = 'DELETE'
    const url = `/users/${id}`
    const response = await fetch(url, { method, headers: GetAuthHeaders() })
    if (!response.ok){
      console.error('Error:', response.statusText)
      location.reload()
      return
    }

    location.reload()
    return
  }
  
  if (action === 'update') {
    const id = currentForm.dataset.id
    const method = 'PUT'
    const url = `/users/${id}`
    const name = currentForm.name.value
    const email = currentForm.email.value
    const password = currentForm.password.value
    const repeatPsw = currentForm.repeatPassword.value

    if(password != repeatPsw){
      alert("As senhas não conferem")
      return
    }

    const body = JSON.stringify({ name, email, password })
    const response = await fetch(url, { method, headers: GetAuthHeaders(), body, })
    if (!response.ok){
      console.error('Error:', response.statusText)
      location.reload()
      return
    }

    location.reload()
    return
  }
  
  if (action === 'create') {
    const method = 'POST'
    const url = '/users'
    const name = currentForm.name.value
    const email = currentForm.email.value
    const password = currentForm.password.value
    const repeatPsw = currentForm.repeatPassword.value
  

    if(password != repeatPsw){
      alert("As senhas não conferem")
      return
    }

    const body = JSON.stringify({ name, email, password })
    const response = await fetch(url, { method, headers: GetAuthHeaders(), body })
    if (!response.ok){
      console.error('Error:', response.statusText)
      location.reload()
      return
    }
    const responseData = await response.json()
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = responseData.name
    newForm.email.value = responseData.email
    newForm.dataset.id = responseData.id
    mainForm.reset()
    mainForm.before(newForm)

    location.reload()
    return
  }

  location.reload()
})

async function UpdateUsersList(){

  const response = await fetch('/users', { headers: GetAuthHeaders() })
  const users = await response.json()
    users.forEach(user => {
      const newForm = mainForm.cloneNode(true)
      newForm.name.value = user.name
      newForm.email.value = user.email
      newForm.dataset.id = user.id
      mainForm.before(newForm)
    })
}

function VerifyCurrentUserLoginState(){

  var token = localStorage.getItem('token')
  if(token == null){
    location.href = '/NotAuthorized.html'
    return
  }

}

function GetAuthHeaders(){
  var token = localStorage.getItem('token')
  const headers = {'Content-Type': 'application/json', 'authorization': token }
  return headers;
}

function OnLogout(){
  localStorage.removeItem('token')
  location.href = '/'
}