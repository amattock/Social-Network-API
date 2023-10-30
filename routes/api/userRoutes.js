const router = require("express").Router();
const {
  getAlluser,
  getuserById,
  createuser,
  updateuser,
  deleteuser,
  addFriend,
  deleteFriend,
} = require("../../controllers/userController");

router.route("/").get(getAlluser).post(createuser);
router.route("/:id").get(getuserById).put(updateuser).delete(deleteuser);
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;
