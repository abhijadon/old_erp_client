import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DashboardOutlined,
  UserAddOutlined,
  CreditCardOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { PiMicrosoftTeamsLogoLight } from 'react-icons/pi';
import logoIcon from '@/style/images/sodelogo.png';
import logoText from '@/style/images/sodeicon.png';
import { FaUsersRays } from "react-icons/fa6";
import { CiUnread } from "react-icons/ci";
import { GrCircleInformation } from "react-icons/gr";
const { Sider } = Layout;

export default function Navigation() {
  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    async function fetchRoleAndMenuOptions() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}api/menu/list`);
        if (response.status === 200) {
          const { role, options } = response.data;
          setMenuOptions({ role, options });
        }
      } catch (error) {
        console.error('Error fetching menu options:', error);
      }
    }

    fetchRoleAndMenuOptions();
  }, []);

  return (
    <>
      <div className="sidebar-wraper">
        <Sidebar menuOptions={menuOptions} />
      </div>
      <MobileSidebar menuOptions={menuOptions} />
    </>
  );
}

function Sidebar({ menuOptions }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const generateMenuItems = () => {
    if (!menuOptions?.options) return []; // Return empty array if menuOptions not defined

    return menuOptions.options.map((option) => {
      let icon;
      let path;

      switch (option) {
        case 'Dashboard':
          icon = <DashboardOutlined />;
          path = '/'; // Change Dashboard path to "/"
          break;
        case 'Application':
          icon = <UserAddOutlined />;
          path = '/application';
          break;
        case 'Payment':
          icon = <CreditCardOutlined />;
          path = '/payment';
          break;
        case 'Teams':
          icon = <PiMicrosoftTeamsLogoLight className="text-[18px]" />;
          path = '/roles';
          break;
        case 'Users':
          icon = <FaUsersRays className="text-[18px]" />;
          path = '/permissions';
          break;
        case 'Permission':
          icon = <CiUnread className="text-[18px]" />;
          path = '/permission';
          break;
        case 'Courses & Fees':
          icon = <GrCircleInformation className="text-[18px]" />;
          path = '/courseInfo';
          break;
        default:
          icon = null;
          path = `/${option.toLowerCase()}`;
      }

      return {
        key: path, // Use the path as the key
        icon,
        label: <Link to={path}>{option}</Link>, // Adjusted to use the correct path
      };
    });
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme={'light'}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: '0',
        top: '0',
        bottom: '0',
        boxShadow: '0px 0px 20px 3px rgba(150, 190, 238, 0.15)',
      }}
    >
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logoIcon} alt="Logo" style={{ height: '35px' }} />
        {!collapsed && (
          <img
            src={logoText}
            alt="Logo"
            style={{ marginTop: '1px', marginLeft: '5px', height: '38px' }}
          />
        )}
      </div>
      <Menu
        mode="inline"
        items={generateMenuItems()}
        defaultSelectedKeys={[location.pathname]}
      />
    </Sider>
  );
}

function MobileSidebar({ menuOptions }) {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ marginLeft: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={200}
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} menuOptions={menuOptions} />
      </Drawer>
    </>
  );
}
