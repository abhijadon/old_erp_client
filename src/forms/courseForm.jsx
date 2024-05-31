import React, { useState, useEffect } from 'react';
import { Form, Button, message, Input } from 'antd';
import axios from 'axios';

// Function to generate a unique course code with 6 digits
const generateCourseCode = () => {
    const prefix = 'ERP-';
    let lastSequence = parseInt(localStorage.getItem('lastCourseSequence'), 10);

    // Initialize if the sequence doesn't exist or reset it after reaching 999999
    if (isNaN(lastSequence) || lastSequence >= 999999) {
        lastSequence = 100000;  // Start from 100000 to ensure 6 digits
    } else {
        lastSequence += 1;
    }

    localStorage.setItem('lastCourseSequence', lastSequence);
    return `${prefix}${lastSequence}`;
};

export default function CourseForm({ onFormSubmit, onClose }) {
    const [courseCode, setCourseCode] = useState('');

    useEffect(() => {
        const newCourseCode = generateCourseCode();
        setCourseCode(newCourseCode);
    }, []);

    const onFinish = async (formValues) => {
        try {
            const formData = { ...formValues, courseCode };

            const response = await axios.post('/course/create', formData);
            if (response.data) {
                message.success(response.data.message);
                if (onFormSubmit) onFormSubmit(); // Trigger parent component's onFormSubmit function if it exists
                if (onClose) onClose(); // Close the form if onClose function exists
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item
                hidden
                label="Course Code"
                name="courseCode"
            >
                <Input value={courseCode} disabled />
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
}
