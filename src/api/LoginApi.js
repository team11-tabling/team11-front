import axios from 'axios';
export const LoginApi = async (username, password) => {
  const result = await axios.post('https://load.p-hako.com/api/users/login', {username, password});
  return result.data.data;
}
