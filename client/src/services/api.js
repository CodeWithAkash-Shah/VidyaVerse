import { store } from '../app/store'; // Import your Redux store

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Utility function to handle API requests
const fetchRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get the token from Redux store
  const state = store.getState();
  const token = state.auth.token;

  // Set headers, including Authorization if token exists
  const headers = options.body instanceof FormData
    ? { ...options.headers, ...(token && { Authorization: `Bearer ${token}` }) }
    : {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error ${response.status}` };
      }
      throw new Error(errorData.error || 'An error occurred while fetching data');
    }

    // Handle empty responses (e.g., 204 No Content)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {};
    }

    return response.json();
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error.message);
    throw error;
  }
};

const apiService = {
  doubts: {
    ask: (payload) => fetchRequest('/doubts/ask', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    getAllDoubts: (classId) => fetchRequest(`/doubts/all/${classId}`, {
      method: 'GET',
    }),
    getStudentDoubts: (studentId) => fetchRequest(`/doubts/${studentId}`, {
      method: 'GET',
    }),
    addAnswer: (doubtId, payload) => fetchRequest(`/doubts/${doubtId}/answer`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
  notes: {
    getByUserId: (userId) => fetchRequest(`/notes/${userId}`, {
      method: 'GET',
    }),
    toggleBookmark: (noteId) => fetchRequest(`/notes/bookmarked/${noteId}`, {
      method: 'PUT',
    }),
    upload: (formData) => fetchRequest('/notes/upload', {
      method: 'POST',
      body: formData,
    }),
  },
  feedback: {
    submit: (payload) => fetchRequest('/student/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    summarizeClass: (className, payload) => fetchRequest(`/teacher/summarize/${className}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
  gemini: {
    askBasic: (input) => fetchRequest('/gemini/basic', {
      method: 'POST',
      body: JSON.stringify({ input })
    }),
    ask: (payload) => fetchRequest('/gemini/ask', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    summarizeClass: (className, payload) => fetchRequest(`/gemini/summarize/${className}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    getPlatformInfo: () => fetchRequest("/gemini/platform-info", {
      method: "GET",
    }),
    askTeacher: (payload) => fetchRequest('/gemini/teacher/ask', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
  teacher: {
    getStudentsNeedingAttention: () => fetchRequest('/teacher/students-needing-attention', {
      method: 'GET',
    })
  },
  search: {
    getEvents: (query) => fetchRequest(`/events/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
    }),
  },
};

export default apiService;