import React, { useState } from 'react';
import { Select, Form, Button, message, Input } from 'antd';
import axios from 'axios';
import courseInfo from './courseInfo';

const { Option } = Select;

const CourseInform = ({ onClose, onFormSubmit }) => {
    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleModeChange = (value) => {
        setSelectedMode(value);
        setSelectedUniversity(null);
        setSelectedCourse(null);
    };

    const handleUniversityChange = (value) => {
        setSelectedUniversity(value);
        setSelectedCourse(null);
    };

    const handleCourseChange = (value) => {
        setSelectedCourse(value);
    };

    const onFinish = async (formValues) => {
        try {
            const response = await axios.post('/info/create', formValues);
            if (response.status === 200) {
                message.success('Course created successfully');
                onFormSubmit(); // Trigger parent component's onFormSubmit function
                onClose(); // Close the form
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    const getUniversityOptions = () => {
        if (!selectedMode) return [];
        return courseInfo.find(mode => mode.value === selectedMode)?.universities || [];
    };

    const getCourseOptions = () => {
        if (!selectedUniversity) return [];
        const universities = getUniversityOptions();
        return universities.find(university => university.value === selectedUniversity)?.courses || [];
    };

    const getCourseFields = () => {
        if (!selectedCourse) return [];
        const courses = getCourseOptions();
        return courses.find(course => course.value === selectedCourse)?.fields || [];
    };

    return (
        <Form onFinish={onFinish} layout="vertical" className='grid grid-cols-4 space-x-3'>
            <Form.Item
                label="Mode"
                name="mode_info"
                rules={[{ required: true, message: 'Please select a mode' }]}
            >
                <Select placeholder="Select mode" onChange={handleModeChange}>
                    {courseInfo.map(mode => (
                        <Option key={mode.value} value={mode.value}>
                            {mode.label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            {selectedMode && (
                <Form.Item
                    label="University"
                    name="university"
                    rules={[{ required: true, message: 'Please select a university' }]}
                >
                    <Select placeholder="Select university" onChange={handleUniversityChange}>
                        {getUniversityOptions().map(university => (
                            <Option key={university.value} value={university.value}>
                                {university.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            {selectedUniversity && (
                <Form.Item
                    label="Course"
                    name="course"
                    rules={[{ required: true, message: 'Please select a course' }]}
                >
                    <Select placeholder="Select course" onChange={handleCourseChange}>
                        {getCourseOptions().map(course => (
                            <Option key={course.value} value={course.value}>
                                {course.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            {selectedCourse && getCourseFields().map(field => (
                <Form.Item
                    key={field.id}
                    label={field.label}
                    name={field.name}
                    rules={field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }] : []}
                >
                    {field.type === 'select' ? (
                        <Select placeholder={field.place}>
                            {field.options.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            type={field.type}
                            placeholder={field.place}
                            id={field.id}
                        />
                    )}
                </Form.Item>
            ))}
            <Form.Item className='mt-7'>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CourseInform;
