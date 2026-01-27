import React from 'react';
import { designConfig as ds } from '../styles/design-config';

function TopPage({ onNavigateLogin, onNavigateRegister }) {
    return (
        <div style={{ 
            fontFamily: ds.fonts.base,
            padding: ds.container.padding, 
            maxWidth: ds.container.medium, 
            margin: '0 auto',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: ds.container.padding }}>
                <h1 style={{ 
                    fontSize: '48px', 
                    color: ds.colors.primary, 
                    marginBottom: ds.spacing.lg 
                }}>
                    Todoアプリ
                </h1>
                <p style={{ 
                    fontSize: '18px', 
                    color: ds.colors.textSecondary 
                }}>
                    タスクを効率的に管理しましょう
                </p>
            </div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: ds.spacing.md,
                maxWidth: '300px',
                margin: '0 auto'
            }}>
                <button 
                    onClick={onNavigateLogin}
                    style={{ 
                        padding: `${ds.spacing.md} ${ds.spacing.xl}`, 
                        fontSize: '18px',
                        backgroundColor: ds.button.primary.bg, 
                        color: ds.button.primary.color, 
                        border: 'none', 
                        borderRadius: ds.todoCard.borderRadius,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ログイン
                </button>
                
                <button 
                    onClick={onNavigateRegister}
                    style={{ 
                        padding: `${ds.spacing.md} ${ds.spacing.xl}`, 
                        fontSize: '18px',
                        backgroundColor: ds.button.secondary.bg, 
                        color: ds.button.secondary.color, 
                        border: 'none', 
                        borderRadius: ds.todoCard.borderRadius,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    新規登録
                </button>
            </div>

            <div style={{ 
                marginTop: ds.container.padding, 
                fontSize: '14px', 
                color: '#999' 
            }}>
                <p>タスクを追加、編集、削除できます</p>
                <p>期日と優先度で管理が可能です</p>
            </div>
        </div>
    );
}

export default TopPage;