import { Form, Select, Button, message } from 'antd';
import { request } from '@/request';

const { Option } = Select;

const EditPermission = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'menu', id: selectedRecord._id, jsonData: values });
            onFormSubmit(); // Trigger reload in parent component
            onClose(); // Close the form
        } catch (error) {
            message.error('Failed to update record');
        }
    };


    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={selectedRecord}
        >
            <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role' }]}
            >
                <Select placeholder="Select role">
                    <Option value="admin">Admin</Option>
                    <Option value="subadmin">Sub Admin</Option>
                    <Option value="manager">Manager</Option>
                    <Option value="supportiveassociate">Supportive Associate</Option>
                    <Option value="teamleader">Team Leader</Option>
                    <Option value="user">User</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Menu Options"
                name="options"
                rules={[{ required: true, message: 'Please select menu options' }]}
            >
                <Select mode="multiple" placeholder="Select options">
                    <Option value="Dashboard">Dashboard</Option>
                    <Option value="Application">Application</Option>
                    <Option value="Payment">Payment</Option>
                    <Option value="Teams">Teams</Option>
                    <Option value="Users">Users</Option>
                    <Option value="Permission">Permission</Option>
                    <Option value="Courses & Fees">Courses & Fees</Option>
                    <Option value="Settings">Settings</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditPermission;