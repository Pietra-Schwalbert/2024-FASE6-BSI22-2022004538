import { connect } from '../database'
import { RequestHandler } from "express"

const getManyUsers: RequestHandler = async (req, res) => {
  const db = await connect()
  const users = await db.all('SELECT id, name, email FROM users')
  res.json(users)
}

const createUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email, password, currentUser } = req.body

  const result = await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])
  res.json(user)
}

const updateUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email, currentUser } = req.body

  if(currentUser == null){
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { id } = req.params

  if(currentUser.id != id){
    return res.status(403).json({ message: 'Acesso proibido' });
  }

  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  res.json(user)
}

const deleteUser: RequestHandler = async (req, res) => {
  const db = await connect()

  const currentUser = req.body.currentUser;

  if(currentUser == null){
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { id } = req.params


  if(currentUser.id != id){
    return res.status(403).json({ message: 'Acesso proibido' });
  }

  await db.run('DELETE FROM users WHERE id = ?', [id])
  res.json({ message: 'User deleted' })
}

export default { 
  getManyUsers, 
  createUser, 
  updateUser, 
  deleteUser 
}