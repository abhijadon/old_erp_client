import { Form, Select, Button, message, Input } from 'antd';
import { request } from '@/request';

const { Option } = Select;

const EditCourseInfo = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'info', id: selectedRecord._id, jsonData: values });
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
                label="Mode"
                name="mode_info"
                rules={[{ required: true, message: 'Please select a mode' }]}
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label="University"
                name="university"
                rules={[{ required: true, message: 'Please select menu options' }]}
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label="Course"
                name="course"
                rules={[{ required: true, message: 'Please select a course' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Electives"
                name="electives"
                rules={[{ required: true, message: 'Please select a Electives' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Course fees"
                name="fee"
                rules={[{ required: true, message: 'Please Enter a fee' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Discounted fees"
                name="ebd"
                rules={[{ required: true, message: 'Please Enter a EBD' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Reg fee"
                name="reg_fee"
                rules={[{ required: true, message: 'Please Enter a reg fee' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Examination fee"
                name="examinationFee"
                rules={[{ required: true, message: 'Please Enter a examinationFee' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Advantages"
                name="advantages"
                rules={[{ required: true, message: 'Please Enter a advantages' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Eligibility"
                name="eligibility"
                rules={[{ required: true, message: 'Please Enter a Eligibility' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Website_url"
                name="website_url"
                rules={[{ required: true, message: 'Please Enter a Website_url' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Utm Link"
                name="utm_link"
                rules={[{ required: true, message: 'Please Enter a utm_link' }]}
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

export default EditCourseInfo;