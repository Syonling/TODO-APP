import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from '../services/api';
import { designConfig as ds } from '../styles/design-config';

function TodoPage({ onLogout, onNavigateUser }) {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState(2);  // デフォルトは中優先度
    const [sortBy, setSortBy] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [editPriority, setEditPriority] = useState(2);  // デフォルトは中優先度
    
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        loadTodos();
    }, [sortBy]);

    const loadTodos = async () => {
        try {
            let sort = '';
            let order = 'asc';
            
            if (sortBy === 'priority') {
                sort = 'priority';
                order = 'desc';
            } else if (sortBy) {
                sort = sortBy;
                order = 'asc';
            }
            
            const response = await getTodos(sort, order);
            
            // フロントエンドのソート: 未完了の項目を先頭に、完了した項目を最後尾に表示
            let sortedTodos = response.data.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            
            
            if (sortBy === 'priority') {
                // 優先順位で並べ替え
                sortedTodos = sortedTodos.sort((a, b) => {
                    // 完了ステータスで並べ替え
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // 高から低の順に優先順位
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority;
                    }
                    // 優先度が同じ場合は、日付順
                    return new Date(a.due_date) - new Date(b.due_date);
                });
            } else if (sortBy === 'date') {
                // 日付で並べ替える場合
                sortedTodos = sortedTodos.sort((a, b) => {
                    // 完了ステータスで並べ替え
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // 日付順
                    const dateA = new Date(a.due_date);
                    const dateB = new Date(b.due_date);
                    if (dateA.getTime() !== dateB.getTime()) {
                        return dateA - dateB;
                    }
                    // 日付が同じ場合は、高から低の順に優先順位を付けます
                    return b.priority - a.priority;
                });
            }
            
            setTodos(sortedTodos);
        } catch (error) {
            console.error('読み込みに失敗しました:', error);
        }
    };

    const handleAdd = async () => {
        if (!newTitle.trim() || !newDueDate) {
            alert('タイトルと締め切りをご記入ください');
            return;
        }
        try {
            await createTodo(newTitle, newDueDate, parseInt(newPriority));
            setNewTitle('');
            setNewDueDate('');
            setNewPriority(2);
            loadTodos();
        } catch (error) {
            alert(error.response?.data?.detail || '追加に失敗しました');
        }
    };

    const handleEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDueDate(todo.due_date);
        setEditPriority(todo.priority);
    };

    const handleSave = async (id) => {
        try {
            await updateTodo(id, editTitle, editDueDate, parseInt(editPriority));
            setEditingId(null);
            loadTodos();
        } catch (error) {
            alert(error.response?.data?.detail || '更新に失敗しました');
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleTodo(id);
            loadTodos();
        } catch (error) {
            console.error('切り替えに失敗しました:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('本当に削除しますか?')) return;
        try {
            await deleteTodo(id);
            loadTodos();
        } catch (error) {
            console.error('削除に失敗しました:', error);
        }
    };

    const handleLogoutClick = () => {
        setShowDropdown(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        onLogout();
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const getPriorityText = (priority) => {
        const texts = { 3: '高', 2: '中', 1: '低' };
        return texts[priority] || priority;
    };

    return (
        <div style={{ 
            fontFamily: ds.fonts.base,
            padding: ds.spacing.lg, 
            maxWidth: ds.container.large, 
            margin: '0 auto' 
        }}>
            <div style={{ 
                // fontFamily: ds.fonts.heading,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: ds.spacing.lg 
            }}>
                <h1>ToDo アプリ</h1>
                
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ 
                            padding: ds.button.user.padding,
                            backgroundColor: ds.button.user.bg,
                            color: ds.button.user.color,
                            border: `1px solid ${ds.colors.grey300}`,
                            borderRadius: ds.button.user.borderRadius,
                            cursor: 'pointer',
                            fontSize: ds.button.user.fontSize,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <ds.icons.user size={20} />
                    </button>
                    
                    {showDropdown && (
                        <>
                            <div 
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 999
                                }}
                                onClick={() => setShowDropdown(false)}
                            />
                            
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                backgroundColor: ds.dropdown.bg,
                                border: `1px solid ${ds.dropdown.border}`,
                                borderRadius: ds.dropdown.borderRadius,
                                boxShadow: ds.dropdown.shadow,
                                minWidth: ds.dropdown.minWidth,
                                zIndex: 1000
                            }}>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        onNavigateUser();
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: ds.dropdown.itemPadding,
                                        fontSize: ds.dropdown.fontSize,
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: ds.colors.textPrimary,
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = ds.dropdown.itemHoverBg}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    情報編集
                                </button>
                                
                                <div style={{
                                    height: '1px',
                                    backgroundColor: ds.dropdown.border,
                                    margin: '4px 0'
                                }} />
                                
                                <button
                                    onClick={handleLogoutClick}
                                    style={{
                                        width: '100%',
                                        padding: ds.dropdown.itemPadding,
                                        fontSize: ds.dropdown.fontSize,
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: ds.colors.error,
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = ds.dropdown.itemHoverBg}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    ログアウト
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: ds.spacing.md
                }}
            >
                <div>
                    <label>並び替え：</label>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        style={{ 
                            padding: ds.spacing.xs, 
                            marginLeft: ds.spacing.sm,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: '14px'
                        }}
                    >
                        <option value="">デフォルト</option>
                        <option value="date">期日順</option>
                        <option value="priority">優先度順（降順）</option>
                    </select>
                </div>

                <div
                    style={{
                        textAlign: 'right',
                        color: ds.stats.textColor,
                        fontSize: ds.stats.fontSize,
                        fontWeight: '500'
                    }}
                >
                    <span style={{ marginRight: ds.spacing.md }}>
                        未完了：{todos.length - todos.filter(t => t.completed).length} 件 | 完了：{todos.filter(t => t.completed).length} 件
                    </span>
                </div>
            </div>

            <div style={{ 
                marginBottom: ds.spacing.lg, 
                padding: ds.spacing.md, 
                backgroundColor: ds.colors.grey100, 
                borderRadius: ds.todoCard.borderRadius,
                border: `1px solid ${ds.todoCard.borderColor}`
            }}>
                <h3 style={{ marginBottom: ds.spacing.md }}>新しいタスクを追加</h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr 1fr', 
                    gap: ds.spacing.sm, 
                    marginBottom: ds.spacing.sm 
                }}>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="タスクタイトル..."
                        style={{ 
                            padding: ds.input.padding,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize
                        }}
                    />
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        style={{ 
                            padding: ds.input.padding,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize
                        }}
                    />
                    <select 
                        value={newPriority} 
                        onChange={(e) => setNewPriority(e.target.value)} 
                        style={{ 
                            padding: ds.input.padding,
                            border: `1px solid ${ds.input.borderColor}`,
                            borderRadius: ds.input.borderRadius,
                            fontSize: ds.input.fontSize
                        }}
                    >
                        <option value="3">高優先度</option>
                        <option value="2">中優先度</option>
                        <option value="1">低優先度</option>
                    </select>
                </div>
                <button 
                    onClick={handleAdd} 
                    style={{ 
                        padding: ds.button.secondary.padding, 
                        width: '100%', 
                        backgroundColor: ds.button.secondary.bg, 
                        color: ds.button.secondary.color, 
                        border: 'none', 
                        borderRadius: ds.button.secondary.borderRadius, 
                        cursor: 'pointer',
                        fontSize: ds.button.secondary.fontSize,
                        fontWeight: 'bold'
                    }}
                >
                    追加
                </button>
            </div>
            
            <div>
                {todos.map(todo => (
                    <div key={todo.id} style={{
                        padding: ds.todoCard.padding,
                        marginBottom: ds.spacing.sm,
                        backgroundColor: todo.completed ? ds.todoCard.completedBg : ds.todoCard.normalBg,
                        border: `1px solid ${ds.todoCard.borderColor}`,
                        borderRadius: ds.todoCard.borderRadius,
                        borderLeft: `${ds.todoCard.borderLeftWidth} solid ${ds.priority[todo.priority]}`
                    }}>
                        {editingId === todo.id ? (
                            <div>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '2fr 1fr 1fr', 
                                    gap: ds.spacing.sm, 
                                    marginBottom: ds.spacing.sm 
                                }}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        style={{ 
                                            padding: ds.input.padding,
                                            border: `1px solid ${ds.input.borderColor}`,
                                            borderRadius: ds.input.borderRadius ,
                                            fontSize: ds.input.editFontSize
                                        }}
                                    />
                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        style={{ 
                                            padding: ds.input.padding,
                                            border: `1px solid ${ds.input.borderColor}`,
                                            borderRadius: ds.input.borderRadius ,
                                            fontSize: ds.input.editFontSize
                                        }}
                                    />
                                    <select 
                                        value={editPriority} 
                                        onChange={(e) => setEditPriority(e.target.value)} 
                                        style={{ 
                                            padding: ds.input.padding,
                                            border: `1px solid ${ds.input.borderColor}`,
                                            borderRadius: ds.input.borderRadius ,
                                            fontSize: ds.input.editFontSize
                                        }}
                                    >
                                        <option value="3">高優先度</option>
                                        <option value="2">中優先度</option>
                                        <option value="1">低優先度</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => handleSave(todo.id)} 
                                    style={{ 
                                        marginRight: ds.spacing.sm, 
                                        padding: ds.button.secondary.padding, 
                                        backgroundColor: ds.button.secondary.bg, 
                                        color: ds.button.secondary.color, 
                                        border: 'none', 
                                        borderRadius: ds.button.secondary.borderRadius,
                                        cursor: 'pointer',
                                        fontSize: ds.button.secondary.fontSize
                                    }}
                                >
                                    <ds.icons.save size={16} /> 保存
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)} 
                                    style={{ 
                                        padding: ds.button.secondary.padding, 
                                        backgroundColor: '#999', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: ds.button.secondary.borderRadius,
                                        cursor: 'pointer',
                                        fontSize: ds.button.secondary.fontSize
                                    }}
                                >
                                    <ds.icons.cancel size={16} /> キャンセル
                                </button>
                            </div>
                        ) : (
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggle(todo.id)}
                                        style={{ marginRight: ds.spacing.sm, transform: 'scale(1.5)', cursor: 'pointer'}}
                                    />
                                    <span style={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        color: todo.completed ? '#888' : ds.colors.textPrimary,
                                        fontSize: ds.todoCard.fontSize
                                    }}>
                                        {todo.title}
                                    </span>
                                    <div style={{ 
                                        marginLeft: ds.spacing.xl, 
                                        fontSize: ds.todoCard.metaFontSize ,
                                        color: ds.colors.textSecondary, 
                                        marginTop: ds.spacing.xs 
                                    }}>
                                        期日: {todo.due_date} | 優先度: {getPriorityText(todo.priority)}
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => handleEdit(todo)} 
                                        style={{ 
                                            marginRight: ds.spacing.xs, 
                                            padding: ds.button.primary.padding, 
                                            backgroundColor: ds.button.primary.bg, 
                                            color: ds.button.primary.color, 
                                            border: 'none', 
                                            borderRadius: ds.button.primary.borderRadius,
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <ds.icons.edit size={16} style={{ verticalAlign: 'middle' }} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(todo.id)} 
                                        style={{ 
                                            padding: ds.button.danger.padding, 
                                            backgroundColor: ds.button.danger.bg, 
                                            color: ds.button.danger.color, 
                                            border: 'none', 
                                            borderRadius: ds.button.danger.borderRadius,
                                            cursor: 'pointer',
                                            fontSize: ds.button.danger.fontSize
                                        }}
                                    >
                                        <ds.icons.delete size={16} style={{ verticalAlign: 'middle' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {showLogoutModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: ds.modal.overlayBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: ds.modal.bg,
                        borderRadius: ds.modal.borderRadius,
                        padding: ds.modal.padding,
                        boxShadow: ds.modal.shadow,
                        maxWidth: ds.modal.maxWidth,
                        width: '90%'
                    }}>
                        <h3 style={{
                            fontSize: ds.modal.titleSize,
                            marginBottom: ds.spacing.md,
                            color: ds.colors.textPrimary
                        }}>
                            ログアウトの確認
                        </h3>
                        <p style={{
                            fontSize: ds.modal.contentSize,
                            marginBottom: ds.spacing.lg,
                            color: ds.colors.textSecondary
                        }}>
                            ログアウトしてもよろしいですか？
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: ds.spacing.sm,
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={cancelLogout}
                                style={{
                                    padding: ds.button.small.padding,
                                    fontSize: ds.button.small.fontSize,
                                    backgroundColor: ds.button.small.bg,
                                    color: ds.button.small.color,
                                    border: `1px solid ${ds.colors.grey300}`,
                                    borderRadius: ds.button.small.borderRadius,
                                    cursor: 'pointer'
                                }}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={confirmLogout}
                                style={{
                                    padding: ds.button.danger.padding,
                                    fontSize: ds.button.danger.fontSize,
                                    backgroundColor: ds.button.danger.bg,
                                    color: ds.button.danger.color,
                                    border: 'none',
                                    borderRadius: ds.button.danger.borderRadius,
                                    cursor: 'pointer'
                                }}
                            >
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoPage;