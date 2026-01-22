import React from 'react';

function TopPage({ onNavigateLogin, onNavigateRegister }) {
    return (
        <div style={{ 
            padding: '50px', 
            maxWidth: '600px', 
            margin: '0 auto',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '50px' }}>
                <h1 style={{ fontSize: '48px', color: '#2196F3', marginBottom: '20px' }}>
                    Todoアプリ
                </h1>
                <p style={{ fontSize: '18px', color: '#666' }}>
                    タスクを効率的に管理しましょう
                </p>
            </div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px',
                maxWidth: '300px',
                margin: '0 auto'
            }}>
                <button 
                    onClick={onNavigateLogin}
                    style={{ 
                        padding: '15px 30px', 
                        fontSize: '18px',
                        backgroundColor: '#2196F3', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ログイン
                </button>
                
                <button 
                    onClick={onNavigateRegister}
                    style={{ 
                        padding: '15px 30px', 
                        fontSize: '18px',
                        backgroundColor: '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    新規登録
                </button>
            </div>

            <div style={{ marginTop: '50px', fontSize: '14px', color: '#999' }}>
                <p>タスクを追加、編集、削除できます</p>
                <p>期日と優先度で管理が可能です</p>
            </div>
        </div>
    );
}

export default TopPage;