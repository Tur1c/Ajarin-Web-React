export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("token") || `{}`);

  if (user && user.accesToken) {
    return { "Authorization": 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}
