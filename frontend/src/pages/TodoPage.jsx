import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from '../services/api';
import { designConfig as ds } from '../styles/design-config';

function TodoPage({ onLogout, onNavigateUser }) {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState(3);
    const [sortBy, setSortBy] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [editPriority, setEditPriority] = useState(3);

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
            
            const sortedTodos = response.data.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            
            setTodos(sortedTodos);
        } catch (error) {
            console.error('加载失败:', error);
        }
    };

    const handleAdd = async () => {
        if (!newTitle.trim() || !newDueDate) {
            alert('请填写标题和期限');
            return;
        }
        try {
            await createTodo(newTitle, newDueDate, parseInt(newPriority));
            setNewTitle('');
            setNewDueDate('');
            setNewPriority(3);
            loadTodos();
        } catch (error) {
            alert(error.response?.data?.detail || '添加失败');
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
            alert(error.response?.data?.detail || '更新失败');
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleTodo(id);
            loadTodos();
        } catch (error) {
            console.error('切换失败:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('确定要删除吗？')) return;
        try {
            await deleteTodo(id);
            loadTodos();
        } catch (error) {
            console.error('删除失败:', error);
        }
    };

    return (
        <div style={{ 
            padding: ds.spacing.lg, 
            maxWidth: ds.container.large, 
            margin: '0 auto' 
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: ds.spacing.lg 
            }}>
                <h1>Todo List</h1>
                <div>
                    <button 
                        onClick={onNavigateUser} 
                        style={{ 
                            marginRight: ds.spacing.sm,
                            padding: ds.button.small.padding,
                            backgroundColor: ds.button.small.bg,
                            color: ds.button.small.color,
                            border: `1px solid ${ds.colors.grey300}`,
                            borderRadius: ds.button.small.borderRadius,
                            cursor: 'pointer',
                            fontSize: ds.button.small.fontSize
                        }}
                    >
                        {ds.icons.user} 用户信息
                    </button>
                    <button 
                        onClick={onLogout}
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
                        {ds.icons.logout} 登出
                    </button>
                </div>
            </div>

            {/* 排序选择 */}
            <div style={{ marginBottom: ds.spacing.md }}>
                <label>排序方式：</label>
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
                    <option value="">默认</option>
                    <option value="date">按期限</option>
                    <option value="priority">按优先度（高到低）</option>
                </select>
            </div>
            
            {/* 添加表单 */}
            <div style={{ 
                marginBottom: ds.spacing.lg, 
                padding: ds.spacing.md, 
                backgroundColor: ds.colors.grey100, 
                borderRadius: ds.todoCard.borderRadius 
            }}>
                <h3 style={{ marginBottom: ds.spacing.md }}>添加新任务</h3>
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
                        placeholder="任务标题..."
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
                        <option value="5">优先度：5（最高）</option>
                        <option value="4">优先度：4</option>
                        <option value="3">优先度：3</option>
                        <option value="2">优先度：2</option>
                        <option value="1">优先度：1（最低）</option>
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
                    添加任务
                </button>
            </div>

            {/* Todo列表 */}
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
                            // 编辑模式
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
                                            borderRadius: ds.input.borderRadius
                                        }}
                                    />
                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        style={{ 
                                            padding: ds.input.padding,
                                            border: `1px solid ${ds.input.borderColor}`,
                                            borderRadius: ds.input.borderRadius
                                        }}
                                    />
                                    <select 
                                        value={editPriority} 
                                        onChange={(e) => setEditPriority(e.target.value)} 
                                        style={{ 
                                            padding: ds.input.padding,
                                            border: `1px solid ${ds.input.borderColor}`,
                                            borderRadius: ds.input.borderRadius
                                        }}
                                    >
                                        <option value="5">优先度：5</option>
                                        <option value="4">优先度：4</option>
                                        <option value="3">优先度：3</option>
                                        <option value="2">优先度：2</option>
                                        <option value="1">优先度：1</option>
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
                                    {ds.icons.save} 保存
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)} 
                                    style={{ 
                                        padding: ds.button.small.padding, 
                                        backgroundColor: '#999', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: ds.button.small.borderRadius,
                                        cursor: 'pointer',
                                        fontSize: ds.button.small.fontSize
                                    }}
                                >
                                    {ds.icons.cancel} 取消
                                </button>
                            </div>
                        ) : (
                            // 显示模式
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggle(todo.id)}
                                        style={{ marginRight: ds.spacing.sm }}
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
                                        fontSize: ds.todoCard.fontSize ,
                                        color: ds.colors.textSecondary, 
                                        marginTop: ds.spacing.xs 
                                    }}>
                                        期限: {todo.due_date} | 优先度: {todo.priority}
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
                                        {ds.icons.edit}
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
                                        {ds.icons.delete}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoPage;