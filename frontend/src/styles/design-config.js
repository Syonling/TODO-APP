// CSSスタイル

import { 
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiSettings
} from 'react-icons/fi';

export const designConfig = {
  
  colors: {
    primary: '#2196F3',           
    primaryHover: '#1976D2',      
    secondary: '#4CAF50',         
    secondaryHover: '#388E3C',    
    error: '#f44336',             
    errorLight: '#ffebee',        
    success: '#4caf50',
    successLight: '#e8f5e9',
    grey100: '#f5f5f5',           
    grey300: '#e0e0e0',           
    textPrimary: '#212121',       
    textSecondary: '#666666',     
    bgDefault: '#fafafa',         
  },
  
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
      padding: '12px 20px',
      fontSize: '14px',
      borderRadius: '4px'
    },
    user: {
      bg: '#f5f5f5',
      hoverBg: '#e0e0e0',
      color: '#212121',
      padding: '10px 16px',
      fontSize: '14px',
      borderRadius: '4px'
    },
  },
  
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    editFontSize: '16px',
    borderColor: '#e0e0e0',
    borderRadius: '4px',
    focusBorderColor: '#2196F3'
  },
  
  container: {
    small: '400px',    
    medium: '600px',   
    large: '800px',    
    padding: '50px'
  },
  
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
  
  todoCard: {
    padding: '15px',
    borderRadius: '8px',
    borderColor: '#ddd',
    borderLeftWidth: '4px',
    completedBg: '#f0f0f0',
    normalBg: '#ffffff',
    fontSize: '18px',
    metaFontSize: '14px',
    addFormBg: '#f5f5f5'
  },


  stats: {
    bg: '#e3f2fd',
    border: '#2196F3',
    textColor: '#1565c0',
    fontSize: '14px',
    padding: '10px 16px',
    borderRadius: '6px',
  },
  
  dropdown: {
    bg: '#ffffff',
    border: '#e0e0e0',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    itemPadding: '10px 16px',
    itemHoverBg: '#f5f5f5',
    fontSize: '14px',
    minWidth: '150px'
  },
  
  modal: {
    overlayBg: 'rgba(0, 0, 0, 0.5)',
    bg: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    titleSize: '18px',
    contentSize: '15px',
    maxWidth: '400px'
  },
  
  priority: {
    1: '#efeec6',
    2: '#ecaeb9',
    3: '#d85b72',
    // 4: '#ff8844',
    // 5: '#ff4444'
  },
  
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px'
  },
  
  icons: {
    edit: FiEdit2,
    delete: FiTrash2,
    save: FiCheck,
    cancel: FiX,
    user: FiUser,
    logout: FiLogOut,
    dropdown: FiChevronDown,
    settings: FiSettings
  },

  fonts: {
    base: '"Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif'
  }
};