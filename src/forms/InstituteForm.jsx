import { Select, Form, Button, message, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function InstituteForm({ onFormSubmit, onClose }) {
    const onFinish = async (formValues) => {
        try {
            const response = await axios.post('/institute/create', formValues);
            if (response.data) {
                message.success(response.data.message);
                if (onFormSubmit) onFormSubmit(); // Trigger parent component's onFormSubmit function if it exists
                if (onClose) onClose(); // Close the form if onClose function exists
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
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
}
