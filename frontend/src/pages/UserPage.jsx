import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '../services/api';

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
            setNewUsername(response.data.username);
        } catch (error) {
            console.error('加载失败:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');

        // 检查是否有实际修改
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
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>用户信息</h1>
                <button onClick={onBack} style={{ padding: '8px 16px' }}>
                    返回
                </button>
            </div>

            {message && <p style={{ color: message.includes('成功') ? 'green' : 'red', marginBottom: '15px' }}>{message}</p>}
            
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>当前用户名</label>
                    <input
                        type="text"
                        value={currentUsername}
                        disabled
                        style={{ width: '100%', padding: '10px', backgroundColor: '#f0f0f0' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>新用户名</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>新密码（留空则不修改）</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8位以上，含字母和数字"
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '12px 20px', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
                    更新信息
                </button>
            </form>
        </div>
    );
}

export default UserPage;