import React, { useState } from 'react';
import { login } from '../services/api';

function LoginPage({ onLoginSuccess, onNavigateRegister, onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setMessage('ユーザー名とパスワードを入力してください');
            return;
        }

        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.data.access_token);
            onLoginSuccess();
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                // 处理不同类型的错误响应
                if (error.response.status === 422) {
                    // Pydantic验证错误
                    const detail = error.response.data?.detail;
                    if (Array.isArray(detail) && detail.length > 0) {
                        setMessage(detail[0].msg || '入力エラー');
                    } else if (typeof detail === 'string') {
                        setMessage(detail);
                    } else {
                        setMessage('入力形式が正しくありません');
                    }
                } else if (error.response.status === 401) {
                    // 认证失败
                    setMessage('ユーザー名またはパスワードが間違っています');
                } else {
                    // 其他错误
                    setMessage(error.response.data?.detail || 'ログインに失敗しました');
                }
            } else if (error.request) {
                setMessage('サーバーに接続できません');
            } else {
                setMessage('エラーが発生しました');
            }
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>ログイン</h1>
                <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    戻る
                </button>
            </div>

            {message && (
                <div style={{ 
                    padding: '10px', 
                    marginBottom: '15px', 
                    backgroundColor: '#ffebee',
                    border: '1px solid #ef5350',
                    borderRadius: '4px',
                    color: '#c62828'
                }}>
                    {message}
                </div>
            )}
            
            <div>
                <input
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button 
                    onClick={handleSubmit}
                    type="button" 
                    style={{ padding: '12px 20px', width: '100%', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ログイン
                </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    アカウントをお持ちでない方
                </p>
                <button 
                    onClick={onNavigateRegister}
                    style={{ padding: '10px', width: '100%', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                >
                    新規登録はこちら
                </button>
            </div>
        </div>
    );
}

export default LoginPage;