import React, { useEffect, useState } from 'react';
import { Select, Form, Spin, Button, message, Input } from 'antd';
import { request } from '@/request';
import axios from 'axios';
const { Option } = Select;

// Function to generate a unique subcourse code with 6 digits
const generateSubcourseCode = () => {
    const prefix = 'ERP-';
    let lastSequence = parseInt(localStorage.getItem('lastSubcourseSequence'), 10);

    // Initialize if the sequence doesn't exist or reset it after reaching 999999
    if (isNaN(lastSequence) || lastSequence >= 999999) {
        lastSequence = 100000;  // Start from 100000 to ensure 6 digits
    } else {
        lastSequence += 1;
    }

    localStorage.setItem('lastSubcourseSequence', lastSequence);
    return `${prefix}${lastSequence}`;
};

const SubcourseForm = ({ onClose, onFormSubmit }) => {
    const [courseList, setCourseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [subcourseCode, setSubcourseCode] = useState('');

    useEffect(() => {
        const newSubcourseCode = generateSubcourseCode();
        setSubcourseCode(newSubcourseCode);
    }, []);

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

    const onFinish = async (formValues) => {
        try {
            const formData = { ...formValues, subcourseCode };
            const response = await axios.post('/subcourse/create', formData);
            if (response.data) {
                message.success(response.data.message);
                if (onFormSubmit) onFormSubmit();
                if (onClose) onClose();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    if (isLoading) {
        return <div><Spin /></div>;
    }

    return (
        <Form onFinish={onFinish} layout='vertical'>
            <Form.Item
                hidden
                label="Subcourse Code"
                name="subcourseCode"
            >
                <Input value={subcourseCode} disabled />
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

export default SubcourseForm;
