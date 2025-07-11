import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/authenticate', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyResetCode: async (email, code) => {
        const response = await api.post('/auth/verify-reset-code', { email, code });
        return response.data;
    },

    resetPassword: async (email, code, newPassword) => {
        const response = await api.post('/auth/reset-password', { email, code, newPassword });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }
};

export const login = async (username, password) => {
    const credentials = { username, password };
    const response = await api.post('/auth/authenticate', credentials);
    return response.data;
};

export const analyticsAPI = {
    generateAiResponse: async (notes, department, jobTitle) => {
        const response = await api.get('/analytics/ai/generate-response', {
            params: {
                notes,
                department,
                jobTitle
            }
        });
        return response.data;
    }
};

export const hrAPI = {
    submitApplication: async (applicationData) => {
        const response = await api.post('/hr/submit-application', applicationData);
        return response.data;
    },

    getMyApplications: async () => {
        const response = await api.get('/hr/my-applications');
        return response.data;
    },

    getPendingApplications: async () => {
        const response = await api.get('/hr/admin/pending-applications');
        return response.data;
    },

    getAllApplications: async () => {
        const response = await api.get('/hr/admin/all-applications');
        return response.data;
    },

    reviewApplication: async (reviewData) => {
        const response = await api.post('/hr/admin/review-application', reviewData);
        return response.data;
    },

};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

export const setAuthData = (token, userInfo) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export default api;
