import { Form, Button, message, Input } from 'antd';
import { request } from '@/request';

const updateUniversity = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'university', id: selectedRecord._id, jsonData: values });
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
                label="university name"
                name="name"
                rules={[{ required: true, message: 'university name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="university location"
                name="location"
                rules={[{ required: true, message: 'Location' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default updateUniversity;