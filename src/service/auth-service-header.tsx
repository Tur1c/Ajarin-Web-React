export default function authHeader() {
  const user = JSON.parse(sessionStorage.getItem("token") || `{}`);

  if (user && user.accesToken) {
    return { "Authorization": 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}
