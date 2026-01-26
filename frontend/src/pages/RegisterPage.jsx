import React, { useState } from 'react';
import { register } from '../services/api';
import { designConfig as ds } from '../styles/design-config';


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
        <div style={{ 
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
                <h1>新規登録</h1>
                <button 
                    onClick={onBack} 
                    style={{ 
                        padding: ds.button.small.padding, 
                        backgroundColor: ds.button.small.bg, 
                        border: 'none', 
                        borderRadius: ds.button.small.borderRadius, 
                        cursor: 'pointer',
                        fontSize: ds.button.small.fontSize,
                        color: ds.button.small.color
                    }}
                >
                    戻る
                </button>
            </div>

            {message && (
                <div style={{ 
                    padding: message.includes('成功') ? ds.alert.success.padding : ds.alert.error.padding,
                    marginBottom: ds.spacing.md, 
                    backgroundColor: message.includes('成功') ? ds.alert.success.bg : ds.alert.error.bg,
                    border: `1px solid ${message.includes('成功') ? ds.alert.success.border : ds.alert.error.border}`,
                    borderRadius: message.includes('成功') ? ds.alert.success.borderRadius : ds.alert.error.borderRadius,
                    color: message.includes('成功') ? ds.alert.success.color : ds.alert.error.color
                }}>
                    {message}
                </div>
            )}

            <div style={{ 
                padding: ds.spacing.sm, 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #add8e6',
                borderRadius: ds.input.borderRadius,
                marginBottom: ds.spacing.lg,
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
                    placeholder="パスワード（8文字以上、英数字を含む）"
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
                        padding: ds.button.secondary.padding, 
                        width: '100%', 
                        backgroundColor: ds.button.secondary.bg, 
                        color: ds.button.secondary.color, 
                        border: 'none', 
                        borderRadius: ds.button.secondary.borderRadius, 
                        fontSize: ds.button.secondary.fontSize, 
                        cursor: 'pointer', 
                        fontWeight: 'bold' 
                    }}
                >
                    登録
                </button>
            </div>

            <div style={{ marginTop: ds.spacing.lg, textAlign: 'center' }}>
                <p style={{ color: ds.colors.textSecondary, fontSize: '14px' }}>
                    すでにアカウントをお持ちの方
                </p>
                <button 
                    onClick={onNavigateLogin}
                    style={{ 
                        padding: ds.spacing.sm, 
                        width: '100%', 
                        background: ds.colors.grey100, 
                        border: `1px solid ${ds.colors.grey300}`, 
                        borderRadius: ds.input.borderRadius, 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        color: ds.colors.textPrimary
                    }}
                >
                    ログインはこちら
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;