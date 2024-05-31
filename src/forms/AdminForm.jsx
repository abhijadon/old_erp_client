import { Form, Input, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
import useLanguage from '@/locale/useLanguage';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function AdminForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  return (
    <>
      <div>
        <div>
          <label htmlFor="fullname" className='font-thin font-mono text-base capitalize'>Fullname</label><span className='text-red-500'>*</span>
          <Form.Item
            name="fullname"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your fullname' prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>

        <div>
          <label htmlFor="username" className='font-thin font-mono text-base capitalize'>username</label><span className='text-red-500'>*</span>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
              },
              {
                type: 'email'
              }
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your email' prefix={<MailOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>
        <div>
          <label htmlFor="phone" className='font-thin font-mono text-base capitalize'>phone</label><span className='text-red-500'>*</span>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your phone' prefix={<PhoneOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>
        <div>
          <label htmlFor="teamName" className='font-thin font-mono text-base capitalize'>teamName</label><span className='text-red-500'>*</span>
          <Form.Item
            name="teamName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your teamName' prefix={<PhoneOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>
        <div>
          <label htmlFor="university" className='font-thin font-mono text-base capitalize'>university</label><span className='text-red-500'>*</span>
          <Form.Item
            name="university"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your university' prefix={<PhoneOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>
        <div>
          <label htmlFor="institute" className='font-thin font-mono text-base capitalize'>institute</label><span className='text-red-500'>*</span>
          <Form.Item
            name="institute"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input autoComplete="off" placeholder='Enter your institute' prefix={<PhoneOutlined className="site-form-item-icon" />} />
          </Form.Item>
        </div>
        {!isUpdateForm && (
          <div>
            <label htmlFor="password" className='font-thin font-mono text-base capitalize'>password</label><span className='text-red-500'>*</span>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm_password"
                size="large"
              />
            </Form.Item>
          </div>
        )}
        <div>
          <label htmlFor="role" className='font-thin font-mono text-base capitalize'>role</label><span className='text-red-500'>*</span>
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="select your role">
              <Select.Option value="admin">{translate("admin_super_admin")}</Select.Option>
              <Select.Option value="subadmin">{translate("subadmin")}</Select.Option>
              <Select.Option value="manager">{translate("manager")}</Select.Option>
              <Select.Option value="teamleader">{translate("teamleader")}</Select.Option>
              <Select.Option value="supportiveassociate">{translate("supportive_associate")}</Select.Option>
              <Select.Option value="user">{translate("user")}</Select.Option>
            </Select>
          </Form.Item>
        </div>

      </div>
    </>
  );
}
