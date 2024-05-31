import { Form, Select, Button, message, Input } from 'antd';
import { request } from '@/request';

const updateInstitute = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'institute', id: selectedRecord._id, jsonData: values });
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
                label="Institute name"
                name="name"
                rules={[{ required: true, message: 'Institute name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Institute location"
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

export default updateInstitute;