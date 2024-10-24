import { Router } from 'express'
import u from '../middlewares/users'
import { verifyToken } from '../middlewares/auth'
const router = Router()

router.use(verifyToken) // Antes de cada requisição verifica o token do usuário

router.get('/', u.getManyUsers)
router.post('/', u.createUser)
router.put('/:id', u.updateUser)
router.delete('/:id', u.deleteUser)
export default router