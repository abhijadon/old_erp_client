import { Form, Select, Button, message, Input } from 'antd';
import { request } from '@/request';

const UpdateCourse = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'course', id: selectedRecord._id, jsonData: values });
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
                label="Course Code"
                name="courseCode"
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label="Course name"
                name="name"
                rules={[{ required: true, message: 'Please enter the course name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Course Duration"
                name="courseDuration"
                rules={[{ required: true, message: 'Please enter the course duration' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Course Type"
                name="courseType"
                rules={[{ required: true, message: 'Please enter the course type' }]}
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

export default UpdateCourse;