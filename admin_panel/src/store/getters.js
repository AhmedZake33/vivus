const getters = {
  userId: state => state.user.id,
  token: state => state.token,
  name: state => state.user.name,
  user: state => state.user,
  pathTitle: state => state.pathTitle,
  //users: state => state.users,
};
export default getters;
