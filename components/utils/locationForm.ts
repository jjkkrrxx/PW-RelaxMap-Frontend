import axios from 'axios';

export const fetchCategories = async () => {
  const { data } = await axios.get(
    'https://pw-relaxmap-backend.onrender.com/api/categories'
  );
  return data;
};
