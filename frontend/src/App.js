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

        // デフォルトではトップページが表示
        return (
            <TopPage 
                onNavigateLogin={() => setCurrentPage('login')}
                onNavigateRegister={() => setCurrentPage('register')}
            />
        );
    }

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