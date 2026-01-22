import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from '../services/api';

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

    useEffect(() => {       //页面加载时调用 loadTodos()
        loadTodos();
    }, [sortBy]);

    const loadTodos = async () => {
        try {
            let sort = '';
            let order = 'asc';
            
            if (sortBy === 'priority') {
                sort = 'priority';
                order = 'desc';// 高优先度在前
            } else if (sortBy) {
                sort = sortBy;
                order = 'asc';
            }
            
            const response = await getTodos(sort, order);
            
            // 前端排序：未完成的在前，已完成的在后
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

    const getPriorityColor = (priority) => {
        const colors = {
            5: '#ff4444',
            4: '#ff8844',
            3: '#ffbb44',
            2: '#88dd88',
            1: '#88ccff'
        };
        return colors[priority] || '#ccc';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Todo List</h1>
                <div>
                    <button onClick={onNavigateUser} style={{ marginRight: '10px' }}>
                        用户信息
                    </button>
                    <button onClick={onLogout}>登出</button>
                </div>
            </div>

            {/* 排序选择 */}
            <div style={{ marginBottom: '15px' }}>
                <label>排序方式：</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '5px', marginLeft: '10px' }}>
                    <option value="">默认</option>
                    <option value="date">按期限</option>
                    <option value="priority">按优先度（高到低）</option>
                </select>
            </div>
            
            {/* 添加表单 */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>添加新任务</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="任务标题..."
                        style={{ padding: '8px' }}
                    />
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={{ padding: '8px' }}>
                        <option value="5">优先度：5（最高）</option>
                        <option value="4">优先度：4</option>
                        <option value="3">优先度：3</option>
                        <option value="2">优先度：2</option>
                        <option value="1">优先度：1（最低）</option>
                    </select>
                </div>
                <button onClick={handleAdd} style={{ padding: '10px 20px', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    添加任务
                </button>
            </div>

            {/* Todo列表 */}
            <div>
                {todos.map(todo => (
                    <div key={todo.id} style={{
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: todo.completed ? '#f0f0f0' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${getPriorityColor(todo.priority)}`
                    }}>
                        {editingId === todo.id ? (
                            // 编辑模式
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        style={{ padding: '8px' }}
                                    />
                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        style={{ padding: '8px' }}
                                    />
                                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} style={{ padding: '8px' }}>
                                        <option value="5">优先度：5</option>
                                        <option value="4">优先度：4</option>
                                        <option value="3">优先度：3</option>
                                        <option value="2">优先度：2</option>
                                        <option value="1">优先度：1</option>
                                    </select>
                                </div>
                                <button onClick={() => handleSave(todo.id)} style={{ marginRight: '10px', padding: '5px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                                    保存
                                </button>
                                <button onClick={() => setEditingId(null)} style={{ padding: '5px 15px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px' }}>
                                    取消
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
                                        style={{ marginRight: '10px' }}
                                    />
                                    <span style={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        color: todo.completed ? '#888' : '#000',
                                        fontSize: '16px'
                                    }}>
                                        {todo.title}
                                    </span>
                                    <div style={{ marginLeft: '30px', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                        期限: {todo.due_date} | 优先度: {todo.priority}
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => handleEdit(todo)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
                                        编辑
                                    </button>
                                    <button onClick={() => handleDelete(todo.id)} style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>
                                        删除
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