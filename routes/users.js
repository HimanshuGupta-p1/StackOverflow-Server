import express  from 'express'
import {login, signup} from '../controllers/auth.js'
import {getAllUsers, updateProfile, updateUser} from '../controllers/users.js'
import auth from '../middleware/auth.js'
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
  } from "../controllers/users.js";
  // import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/getAllUsers',getAllUsers)
router.patch('/update/:id',auth, updateProfile)
router.patch('/updateUser/:id', updateUser)
/* READ */
router.get("/:id", getUser);
router.get("/:_id/friends",  getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

export default router 