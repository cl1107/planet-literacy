import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('应用根节点 #root 缺失');

createRoot(root).render(
  <StrictMode>
    <Provider theme={defaultTheme} colorScheme="light" locale="zh-CN">
      <App />
    </Provider>
  </StrictMode>,
);
