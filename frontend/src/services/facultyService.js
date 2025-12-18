const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const facultyService = {
  getAllFaculties: async () => {
    try {
      const response = await fetch(`${API_URL}/faculties`);
      if (!response.ok) throw new Error('Failed to fetch faculties');
      return await response.json();
    } catch (error) {
      console.error('Error fetching faculties:', error);
      throw error;
    }
  },

  getFacultyBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_URL}/faculties/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch faculty');
      return await response.json();
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw error;
    }
  }
};
