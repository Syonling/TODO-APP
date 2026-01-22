import React, { useState, useEffect } from 'react';
import TopPage from './pages/TopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoPage from './pages/TodoPage';
import UserPage from './pages/UserPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('top');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setCurrentPage('todo');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentPage('top');
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setCurrentPage('todo');
    };

    // 未登录状态的页面路由
    if (!isLoggedIn) {
        if (currentPage === 'login') {
            return (
                <LoginPage 
                    onLoginSuccess={handleLoginSuccess}
                    onNavigateRegister={() => setCurrentPage('register')}
                    onBack={() => setCurrentPage('top')}
                />
            );
        }

        if (currentPage === 'register') {
            return (
                <RegisterPage 
                    onRegisterSuccess={() => setCurrentPage('login')}
                    onNavigateLogin={() => setCurrentPage('login')}
                    onBack={() => setCurrentPage('top')}
                />
            );
        }

        // 默认显示Top页面
        return (
            <TopPage 
                onNavigateLogin={() => setCurrentPage('login')}
                onNavigateRegister={() => setCurrentPage('register')}
            />
        );
    }

    // 已登录状态的页面路由
    if (currentPage === 'user') {
        return <UserPage onBack={() => setCurrentPage('todo')} />;
    }

    return (
        <TodoPage 
            onLogout={handleLogout} 
            onNavigateUser={() => setCurrentPage('user')} 
        />
    );
}

export default App;