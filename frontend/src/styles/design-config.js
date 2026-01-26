// 开发者设计配置 - 在这里修改所有样式
export const designConfig = {
  
  // 颜色
  colors: {
    primary: '#2196F3',           // 主按钮、链接
    primaryHover: '#1976D2',      // 主按钮悬停
    secondary: '#4CAF50',         // 次要按钮、成功
    secondaryHover: '#388E3C',    
    error: '#f44336',             // 错误、删除按钮
    errorLight: '#ffebee',        // 错误提示背景
    success: '#4caf50',
    successLight: '#e8f5e9',
    grey100: '#f5f5f5',           // 次要按钮背景
    grey300: '#e0e0e0',           // 边框
    textPrimary: '#212121',       // 主文字
    textSecondary: '#666666',     // 次要文字
    bgDefault: '#fafafa',         // 页面背景
  },
  
  // 按钮
  button: {
    primary: {
      bg: '#2196F3',
      hoverBg: '#1976D2',
      color: '#ffffff',
      padding: '12px 20px',
      fontSize: '16px',
      borderRadius: '4px'
    },
    secondary: {
      bg: '#4CAF50',
      hoverBg: '#388E3C',
      color: '#ffffff',
      padding: '12px 20px',
      fontSize: '16px',
      borderRadius: '4px'
    },
    small: {
      bg: '#f5f5f5',
      hoverBg: '#e0e0e0',
      color: '#212121',
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '4px'
    },
    danger: {
      bg: '#f44336',
      hoverBg: '#d32f2f',
      color: '#ffffff',
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '4px'
    }
  },
  
  // 输入框
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    borderColor: '#e0e0e0',
    borderRadius: '4px',
    focusBorderColor: '#2196F3'
  },
  
  // 对话框/容器
  container: {
    small: '400px',    // 登录、注册页
    medium: '600px',   
    large: '800px',    // Todo页
    padding: '50px'
  },
  
  // 消息提示框
  alert: {
    error: {
      bg: '#ffebee',
      border: '#f44336',
      color: '#c62828',
      borderRadius: '4px',
      padding: '10px'
    },
    success: {
      bg: '#e8f5e9',
      border: '#4caf50',
      color: '#2e7d32',
      borderRadius: '4px',
      padding: '10px'
    }
  },
  
  // Todo卡片
  todoCard: {
    padding: '15px',
    borderRadius: '8px',
    borderColor: '#ddd',
    borderLeftWidth: '4px',
    completedBg: '#f0f0f0',
    normalBg: '#ffffff' ,
    fontSize: '16px',              // ← 添加：Todo标题字体大小
    metaFontSize: '14px' ,           // ← 添加：期限/优先度字体大小
    addFormBg: '#f5f5f5'  // ← 添加表单背景色
  },
  
  // 优先度颜色
  priority: {
    1: '#88ccff',
    2: '#88dd88',
    3: '#ffbb44',
    4: '#ff8844',
    5: '#ff4444'
  },
  
  // 间距
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px'
  },
  
  // 图标（可选）
  icons: {
    edit: '✎',
    delete: '🗑',
    save: '✓',
    cancel: '✕',
    user: '👤',
    logout: '→'
  }
  // icons: {
  //   edit: '/icons/edit.png',
  //   delete: '/icons/delete.png',
  //   save: '/icons/save.png',
  //   cancel: '/icons/cancel.png',
  //   user: '/icons/user.png',
  //   logout: '/icons/logout.png'
  // }
};