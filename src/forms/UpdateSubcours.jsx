import { Form, Select, Button, message, Input, Spin } from 'antd';
import { request } from '@/request';
import { useEffect, useState } from 'react';

const UpdateSubcourse = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [form] = Form.useForm();
    const [courseList, setCourseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourseList = async () => {
            try {
                const response = await request.list({ entity: 'course' });
                setCourseList(response.result);
            } catch (error) {
                console.error('Error fetching course list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseList.length === 0) {
            fetchCourseList();
        }
    }, [courseList]);

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'subcourse', id: selectedRecord._id, jsonData: values });
            onFormSubmit(); // Trigger reload in parent component
            onClose(); // Close the form
        } catch (error) {
            message.error('Failed to update record');
        }
    };

    if (isLoading) {
        return <div><Spin /></div>;
    }


    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={selectedRecord}
        >
            <Form.Item
                hidden
                label="Subcourse Code"
                name="subcourseCode"
            >
                <Input disabled />
            </Form.Item>
            <Form.Item label="Course Name" name="coursename">
                <Select
                    className="capitalize"
                    placeholder='Select course name'
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {courseList.map(course => (
                        <Option className="capitalize" key={course._id} value={course._id}>{course.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Subcourse"
                name="subcourse"
                rules={[{ required: true, message: 'Please enter the subcourse name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Subcourse Shortname"
                name="shortname"
                rules={[{ required: true, message: 'Please enter the shortname' }]}
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

export default UpdateSubcourse;