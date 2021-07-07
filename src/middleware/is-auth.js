const jwt = require('jsonwebtoken')
import { User } from '../model/models'

export const getUserByToken = token => {
    
    const decryptedToken = jwt.verify(token, 'supersecretkey')

    const user = User.findOne({email:decryptedToken.email});

    return user
}
   