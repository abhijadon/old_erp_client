import { Tabs, Row, Col } from 'antd';

const SettingsLayout = ({ children }) => {
  return (
    <div className="gutter-row mt-8" order={1}>
      <div className="whiteBox shadow">
        <div className='mt-2 ml-5'>{children}</div>
      </div>
    </div>
  );
};

const RightMenu = ({ children, pageTitle }) => {
  return (
    <div
      className="gutter-row"
      order={0}
    >
      <div className="whiteBox shadow">
        <div className="p-2 border-b-2" style={{ textAlign: 'center', justifyContent: 'start' }}>
          <h2 style={{ color: '#22075e', marginBottom: 0, marginTop: 0 }}>{pageTitle}</h2>
        </div>
        <div className="p-0 ml-4" style={{ width: '100%', paddingBottom: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function TabsContent({ content, pageTitle }) {
  const items = content.map((item, index) => {
    return {
      key: item.key ? item.key : index + '_' + item.label.replace(/ /g, '_'),
      label: (
        <>
          <div className='flex items-center gap-1'>
            <span>{item.icon}</span> <span style={{ paddingRight: 30 }}>{item.label}</span>
          </div>
        </>
      ),
      children: <SettingsLayout>{item.children}</SettingsLayout>,
    };
  });

  const renderTabBar = (props, DefaultTabBar) => (
    <RightMenu pageTitle={pageTitle}>
      <DefaultTabBar {...props} />
    </RightMenu>
  );

  return (
    <div className="tabContent">
      <Tabs tabPosition="bottom" hideAdd={true} items={items} renderTabBar={renderTabBar} />
    </div>
  );
}
