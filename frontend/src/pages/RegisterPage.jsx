import React, { useState } from 'react';
import { register } from '../services/api';

function RegisterPage({ onRegisterSuccess, onNavigateLogin, onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setMessage('ユーザー名とパスワードを入力してください');
            return;
        }

        // 密码验证
        if (password.length < 8) {
            setMessage('パスワードは8文字以上である必要があります');
            return;
        }
        if (!/[a-zA-Z]/.test(password)) {
            setMessage('パスワードには英字を含めてください');
            return;
        }
        if (!/[0-9]/.test(password)) {
            setMessage('パスワードには数字を含めてください');
            return;
        }

        try {
            await register(username, password);
            setMessage('登録成功！ログインページに移動します...');
            setTimeout(() => {
                onRegisterSuccess();
            }, 1500);
        } catch (error) {
            console.error('Register error:', error);
            
            if (error.response) {
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
                } else if (error.response.status === 400) {
                    setMessage(error.response.data?.detail || 'ユーザー名がすでに存在します');
                } else {
                    setMessage(error.response.data?.detail || '登録に失敗しました');
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
                <h1>新規登録</h1>
                <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    戻る
                </button>
            </div>

            {message && (
                <div style={{ 
                    padding: '10px', 
                    marginBottom: '15px', 
                    backgroundColor: message.includes('成功') ? '#e8f5e9' : '#ffebee',
                    border: message.includes('成功') ? '1px solid #4caf50' : '1px solid #ef5350',
                    borderRadius: '4px',
                    color: message.includes('成功') ? '#2e7d32' : '#c62828'
                }}>
                    {message}
                </div>
            )}

            <div style={{ 
                padding: '10px', 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #add8e6',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px'
            }}>
                <strong>パスワード要件：</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>8文字以上</li>
                    <li>英字を含む</li>
                    <li>数字を含む</li>
                </ul>
            </div>
            
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
                    placeholder="パスワード（8文字以上、英数字を含む）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button 
                    onClick={handleSubmit}
                    type="button" 
                    style={{ padding: '12px 20px', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    登録
                </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    すでにアカウントをお持ちの方
                </p>
                <button 
                    onClick={onNavigateLogin}
                    style={{ padding: '10px', width: '100%', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                >
                    ログインはこちら
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;