import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import useLanguage from '@/locale/useLanguage';

export default function AdminForm({ isUpdateForm = false, initialValues = {}, onFormSubmit, onClose }) {
  const [form] = Form.useForm();
  const translate = useLanguage();

  useEffect(() => {
    if (isUpdateForm && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [isUpdateForm, initialValues, form]);

  const onFinish = async (formValues) => {
    try {
      const url = isUpdateForm ? `/admin/update/${initialValues._id}` : '/admin/create';
      const method = isUpdateForm ? 'patch' : 'post';
      const response = await axios[method](url, formValues);
      if (response.data) {
        message.success(response.data.message);
        if (onFormSubmit) onFormSubmit(); // Trigger parent component's onFormSubmit function if it exists
        if (onClose) onClose(); // Close the form if onClose function exists
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
      if (onFormSubmit) onFormSubmit(); // Ensure form submission handles both success and failure
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout='vertical'>
      <Form.Item
        name="fullname"
        label="Name"
        rules={[{ required: true, message: 'Please enter your fullname' }]}
      >
        <Input
          autoComplete="off"
          placeholder='Enter your fullname'
          prefix={<UserOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="username"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          autoComplete="off"
          placeholder='Enter your email'
          prefix={<MailOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please enter your phone' }]}
      >
        <Input
          autoComplete="off"
          placeholder='Enter your phone'
          prefix={<PhoneOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      {!isUpdateForm && (
        <>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
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
              placeholder="Confirm Password"
            />
          </Form.Item>
        </>
      )}

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Please select your role' }]}
      >
        <Select placeholder="Select your role">
          <Select.Option value="admin">{translate("admin_super_admin")}</Select.Option>
          <Select.Option value="subadmin">{translate("subadmin")}</Select.Option>
          <Select.Option value="manager">{translate("manager")}</Select.Option>
          <Select.Option value="teamleader">{translate("teamleader")}</Select.Option>
          <Select.Option value="supportiveassociate">{translate("supportive_associate")}</Select.Option>
          <Select.Option value="user">{translate("user")}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isUpdateForm ? 'Update' : 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
}
