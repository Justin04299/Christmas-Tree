
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const RootApp = () => {
  useEffect(() => {
    // 当组件挂载时，移除 HTML 中的 loading 动画
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    }
  }, []);

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
