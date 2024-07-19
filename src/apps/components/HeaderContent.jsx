import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { checkImage } from '@/request';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';
import SelectLanguage from '@/components/SelectLanguage';
import { BsMoonStars } from 'react-icons/bs';
import { GrSun } from 'react-icons/gr'
import { MdOutlineComputer } from 'react-icons/md'
const { Header } = Layout;
import '@/style/tailwind.css'
export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const translate = useLanguage();
  const [hasPhotoprofile, setHasPhotoprofile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = currentAdmin?.role === 'admin';
  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await checkImage(BASE_URL + currentAdmin?.photo);
        setHasPhotoprofile(result);
      } catch (error) {
        console.error('Error checking image:', error);
      }
    }

    fetchData();
  }, [currentAdmin]);

  const srcImgProfile = hasPhotoprofile ? BASE_URL + currentAdmin?.photo : null;

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={srcImgProfile}
          style={{ color: '#f56a00', backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc' }}
        >
          {currentAdmin?.fullname && currentAdmin?.fullname.charAt(0).toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p className='capitalize font-thin text-sm text-blue-600'>
            {currentAdmin?.fullname}
          </p>
          <p className='font-mono text-[11px] text-sm text-red-600 font-thin'>{currentAdmin?.username}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = isAdmin
    ? [
      {
        label: <ProfileDropdown className="headerDropDownMenu" />,
        key: 'ProfileDropdown',
      },
      {
        type: 'divider',
      },
      {
        icon: <SettingOutlined />,
        key: 'settingProfile',
        label: (
          <Link to={'/profile'}>
            <DropdownMenu text={translate('profile_settings')} />
          </Link>
        ),
      },
      {
        icon: <SettingOutlined />,
        key: 'settingApp',
        label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
      },
      {
        type: 'divider',
      },
      {
        icon: <LogoutOutlined />,
        key: 'logout',
        label: <Link to={'/logout'}>{translate('logout')}</Link>,
      }
    ]
    : [
      {
        icon: <SettingOutlined />,
        key: 'settingProfile',
        label: (
          <Link to={'/profile'}>
            <DropdownMenu text={translate('update_password')} />
          </Link>
        ),
      },
      {
        icon: <LogoutOutlined />,
        key: 'logout',
        label: <Link to={'/logout'}>{translate('logout')}</Link>,
      }
    ];


  {/*dark mode function */ }
  function toggleTheme() {
    document.documentElement.classList.toggle('dark')
  }

  const handleItemClick = (key) => {
    setActiveKey(key);
    // Add additional logic if needed
  };
  const darkModeIcons = [
    {
      icon: <BsMoonStars />,
      key: 'dark',
      label: 'Dark',
      onClick: () => setDarkMode(!darkMode),
    },
    {
      icon: <GrSun />,
      key: 'light',
      label: 'Light',
      onClick: () => setDarkMode(!darkMode),
    },
    {
      icon: <MdOutlineComputer />,
      key: 'system',
      label: 'System',
      onClick: () => setDarkMode(!darkMode),
    },
  ];

  const darkModeDropdown = (
    <Menu className='w-36' selectedKeys={[activeKey]}>
      {darkModeIcons.map((item) => (
        <Menu.Item
          key={item.key}
          onClick={() => handleItemClick(item.key)}
          style={{ display: 'flex', alignItems: 'center' }}
        ><div className='flex items-center gap-2.5' onClick={toggleTheme}>
            {item.icon} <span>{item.label}</span>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  {/*dark mode function */ }


  return (
    <Header
      className={`sticky top-0 z-50 ${isScrolled ? 'scrolled' : 'bg-white w-[100%] scroll-smooth'}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div className='text-[15px] font-thin'>
        <span className='text-black uppercase'>Dashboard</span>
      </div>
      <div className='flex flex-row-reverse text-white gap-3 items-center'>
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          placement="bottomRight"
          style={{ width: '280px', float: 'right' }}
        >
          <Avatar
            className="last"
            src={srcImgProfile}
            style={{
              color: '#f56a00',
              backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc',
              float: 'right',
            }}
            size="large"
          >
            {currentAdmin?.fullname && currentAdmin?.fullname.charAt(0).toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
}
