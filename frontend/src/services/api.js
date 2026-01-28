import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

// リクエストインターセプター: トークンの追加
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター: 401エラーの処理
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const token = localStorage.getItem('token');
            const isAuthEndpoint = error.config.url.includes('/login') || 
                                  error.config.url.includes('/register');
            
            if (token && !isAuthEndpoint) {
                localStorage.removeItem('token');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);


// ===== ユーザーについて =====
export const register = (username, password) => 
    api.post('/api/users/register', { username, password });

export const login = (username, password) => 
    api.post('/api/users/login', { username, password });

export const getCurrentUser = () => 
    api.get('/api/users/me');

export const updateUser = (username, password) => {
    const data = {};
    if (username) data.username = username;
    if (password) data.password = password;
    return api.put('/api/users/me', data);
};

// ===== Todoについて =====
export const getTodos = (sort, order = 'asc') => {
    const params = {};
    if (sort) params.sort = sort;
    if (order) params.order = order;
    return api.get('/api/todos', { params });
};

export const createTodo = (title, dueDate, priority) => 
    api.post('/api/todos', { title, due_date: dueDate, priority });

export const updateTodo = (id, title, dueDate, priority) => {
    const data = {};
    if (title) data.title = title;
    if (dueDate) data.due_date = dueDate;
    if (priority) data.priority = priority;
    return api.put(`/api/todos/${id}`, data);
};

export const toggleTodo = (id) => 
    api.patch(`/api/todos/${id}/toggle`);

export const deleteTodo = (id) => 
    api.delete(`/api/todos/${id}`);