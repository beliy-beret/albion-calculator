import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import ResourceCalculator from './pages/ResourceCalculator.jsx';
import PotionCalculator from './pages/PotionCalculator.jsx';

const { Header, Content } = Layout;
const { Title } = Typography;

const BASE = '/albion-calculator';

const NAV_ITEMS = [
  { key: `${BASE}/`, label: '📦 Ресурсы', path: `${BASE}/` },
  { key: `${BASE}/potions`, label: '⚗️ Зелья', path: `${BASE}/potions` },
];

const AppLayout = () => {
  const location = useLocation();
  const activeKey = NAV_ITEMS.find((item) => item.path === location.pathname)?.key ?? NAV_ITEMS[0].key;

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(20, 10, 40, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          padding: '0 24px',
        }}
      >
        <Title
          level={4}
          style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap', letterSpacing: 1 }}
        >
          ⚔️ Albion Calculator
        </Title>

        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          style={{
            background: 'transparent',
            border: 'none',
            flex: 1,
          }}
          theme="dark"
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            label: (
              <NavLink to={item.path} style={{ color: 'inherit' }}>
                {item.label}
              </NavLink>
            ),
          }))}
        />
      </Header>

      <Content style={{ padding: '24px 16px' }}>
        <Routes>
          <Route path={`${BASE}/`} element={<ResourceCalculator />} />
          <Route path={`${BASE}/potions`} element={<PotionCalculator />} />
          <Route path="*" element={<ResourceCalculator />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;
