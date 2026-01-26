import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '../services/api';
import { designConfig as ds } from '../styles/design-config';

function UserPage({ onBack }) {
    const [currentUsername, setCurrentUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const response = await getCurrentUser();
            setCurrentUsername(response.data.username);
            // setNewUsername(response.data.username);
        } catch (error) {
            console.error('加载失败:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');

        const usernameChanged = newUsername !== currentUsername;
        const passwordChanged = newPassword.trim().length > 0;
        
        if (!usernameChanged && !passwordChanged) {
            setMessage('没有修改任何信息');
            return;
        }        

        try {
            await updateUser(
                usernameChanged ? newUsername : null,
                passwordChanged ? newPassword : null
            );
            setMessage('更新成功！');
            setNewPassword('');
            loadUserInfo();
        } catch (error) {
            setMessage(error.response?.data?.detail || '更新失败');
        }
    };

    return (
        <div style={{ 
            padding: ds.container.padding, 
            maxWidth: '500px', 
            margin: '0 auto' 
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: ds.spacing.xl 
            }}>
                <h1>用户信息</h1>
                <button 
                    onClick={onBack} 
                    style={{ 
                        padding: ds.button.small.padding,
                        backgroundColor: ds.button.small.bg,
                        color: ds.button.small.color,
                        border: `1px solid ${ds.colors.grey300}`,
                        borderRadius: ds.button.small.borderRadius,
                        cursor: 'pointer',
                        fontSize: ds.button.small.fontSize
                    }}
                >
                    返回
                </button>
            </div>

            {message && (
                <p style={{ 
                    color: message.includes('成功') ? ds.alert.success.color : ds.alert.error.color,
                    backgroundColor: message.includes('成功') ? ds.alert.success.bg : ds.alert.error.bg,
                    border: `1px solid ${message.includes('成功') ? ds.alert.success.border : ds.alert.error.border}`,
                    padding: ds.alert.error.padding,
                    borderRadius: ds.alert.error.borderRadius,
                    marginBottom: ds.spacing.md 
                }}>
                    {message}
                </p>
            )}
            
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: ds.spacing.md }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: ds.spacing.xs,
                        color: ds.colors.textPrimary,
                        fontWeight: '500'
                    }}>
                        当前用户名
                    </label>
                    <input
                        type="text"
                        value={currentUsername}
                        disabled
                        style={{ 
                            width: '100%', 
                            padding: ds.input.padding, 
                            backgroundColor: ds.colors.grey100,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize,
                            color: ds.colors.textSecondary
                        }}
                    />
                </div>

                <div style={{ marginBottom: ds.spacing.md }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: ds.spacing.xs,
                        color: ds.colors.textPrimary,
                        fontWeight: '500'
                    }}>
                        新用户名
                    </label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: ds.input.padding,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize
                        }}
                    />
                </div>

                <div style={{ marginBottom: ds.spacing.md }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: ds.spacing.xs,
                        color: ds.colors.textPrimary,
                        fontWeight: '500'
                    }}>
                        新密码（留空则不修改）
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8位以上，含字母和数字"
                        style={{ 
                            width: '100%', 
                            padding: ds.input.padding,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize
                        }}
                    />
                </div>

                <button 
                    type="submit" 
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
                    更新信息
                </button>
            </form>
        </div>
    );
}

export default UserPage;