import React, { useState } from 'react';
import { login } from '../services/api';
import { designConfig as ds } from '../styles/design-config';  


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
                if (error.response.status === 422) {
                    const detail = error.response.data?.detail;
                    if (Array.isArray(detail) && detail.length > 0) {
                        setMessage(detail[0].msg || '入力エラー');
                    } else if (typeof detail === 'string') {
                        setMessage(detail);
                    } else {
                        setMessage('入力形式が正しくありません');
                    }
                } else if (error.response.status === 401) {
                    setMessage('ユーザー名またはパスワードが間違っています');
                } else {
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
        <div style={{ 
            fontFamily: ds.fonts.base,
            padding: ds.container.padding, 
            maxWidth: ds.container.small, 
            margin: '0 auto' 
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: ds.spacing.xl 
            }}>
                <h1>ログイン</h1>
                <button 
                    onClick={onBack} 
                    style={{
                        padding: ds.button.small.padding,
                        fontSize: ds.button.small.fontSize,
                        backgroundColor: ds.button.small.bg,
                        color: ds.button.small.color,
                        border: 'none',
                        borderRadius: ds.button.small.borderRadius,
                        cursor: 'pointer'
                    }}
                >
                    戻る
                </button>
            </div>

            {message && (
                <div style={{
                    padding: ds.alert.error.padding,
                    marginBottom: ds.spacing.md,
                    backgroundColor: ds.alert.error.bg,
                    border: `1px solid ${ds.alert.error.border}`,
                    borderRadius: ds.alert.error.borderRadius,
                    color: ds.alert.error.color
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
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: ds.input.padding,
                        marginBottom: ds.spacing.sm,
                        fontSize: ds.input.fontSize,
                        border: `1px solid ${ds.input.borderColor}`,
                        borderRadius: ds.input.borderRadius
                    }}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: ds.input.padding,
                        marginBottom: ds.spacing.lg,
                        fontSize: ds.input.fontSize,
                        border: `1px solid ${ds.input.borderColor}`,
                        borderRadius: ds.input.borderRadius
                    }}
                />
                <button 
                    onClick={handleSubmit}
                    type="button" 
                    style={{
                        width: '100%',
                        padding: ds.button.primary.padding,
                        fontSize: ds.button.primary.fontSize,
                        backgroundColor: ds.button.primary.bg,
                        color: ds.button.primary.color,
                        border: 'none',
                        borderRadius: ds.button.primary.borderRadius,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ログイン
                </button>
            </div>

            <div style={{ marginTop: ds.spacing.lg, textAlign: 'center' }}>
                <p style={{ color: ds.colors.textSecondary, fontSize: '14px' }}>
                    アカウントをお持ちでない方
                </p>
                <button 
                    onClick={onNavigateRegister}
                    style={{
                        width: '100%',
                        padding: ds.spacing.sm,
                        backgroundColor: ds.colors.grey100,
                        color: ds.colors.textPrimary,
                        border: `1px solid ${ds.colors.grey300}`,
                        borderRadius: ds.input.borderRadius,
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    新規登録はこちら
                </button>
            </div>
        </div>
    );
}

export default LoginPage;