import { useLayoutEffect, useState } from 'react';
import { Layout } from 'antd';
import { useAppContext } from '@/context/appContext';
import Navigation from '@/apps/components/Navigation';
import HeaderContent from '@/apps/components/HeaderContent';
import { useDispatch } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import AppRouter from '@/router/AppRouter';
import useIsMobile from '@/hooks/useIsMobile';

export default function ErpCrmApp() {
  const { Content } = Layout;
  const [currentPath, setCurrentPath] = useState('');
  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const handlePathChange = (path) => {
    setCurrentPath(path);
  };

  return (
    <Layout hasSider>
      <Navigation onPathChange={handlePathChange} />

      {isMobile ? (
        <Layout style={{ marginLeft: 0 }}>
          <HeaderContent />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 25px',
              maxWidth: 'none',
            }}
          >
            <AppRouter />
          </Content>
        </Layout>
      ) : (
        <Layout style={{ marginLeft: isNavMenuClose ? 100 : 220 }}>
          <HeaderContent currentPath={currentPath} />
          <Content
            style={{
              margin: '30px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0px 10px 0px 0px',
              maxWidth: isNavMenuClose ? 1700 : 1600,
            }}
          >
            <AppRouter />
          </Content>
        </Layout>
      )}
    </Layout>
  );
}
