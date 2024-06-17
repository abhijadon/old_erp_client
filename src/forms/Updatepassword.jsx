import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const UpdatePasswordForm = ({ record, onClose, onFormSubmit }) => {
    const [form] = Form.useForm();

    const onFinish = async (formValues) => {
        try {
            const response = await axios.patch(`/admin/password-update/${record._id}`, formValues);
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
        <Form form={form} onFinish={onFinish} layout="vertical">
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
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdatePasswordForm;
