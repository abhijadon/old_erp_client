import React, { useEffect, useState } from 'react';
import { Select, Form, Spin, Button, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Index = ({ onClose, onFormSubmit }) => {
    const [universityList, setUniversityList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [electiveList, setElectiveList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formSection, setFormSection] = useState('brochure'); // Default section
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCourseAndElectiveList = async () => {
            try {
                const response = await axios.get('/info/list');
                if (response.data.success) {
                    const data = response.data.result;
                    // Extract unique values from data
                    const universities = [...new Set(data.map(item => item.university))];
                    const courses = [...new Set(data.map(item => item.course))];
                    const electives = [...new Set(data.map(item => item.electives))];
                    setUniversityList(universities);
                    setCourseList(courses);
                    setElectiveList(electives);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching course and elective list:', error);
            }
        };

        fetchCourseAndElectiveList();
    }, []);

    const onFinish = async (values) => {
        console.log('Form values:', values);
        const formData = new FormData();
        formData.append('university', values.university);
        formData.append('course', values.course || ''); // Handle undefined values by setting empty string
        formData.append('electives', values.elective || ''); // Handle undefined values by setting empty string

        if (values.brochure) {
            values.brochure.forEach(file => {
                formData.append('brochure', file.originFileObj, file.originFileObj.name);
            });
        }
        if (values.sampleMarksheet) {
            values.sampleMarksheet.forEach(file => {
                formData.append('sampleMarksheet', file.originFileObj, file.originFileObj.name);
            });
        }
        if (values.sampleDegree) {
            values.sampleDegree.forEach(file => {
                formData.append('sampleDegree', file.originFileObj, file.originFileObj.name);
            });
        }

        try {
            const response = await axios.post('/brochures/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data) {
                message.success(response.data.message);
                if (onFormSubmit) onFormSubmit();
                if (onClose) onClose();
                form.resetFields();
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Upload failed');
        }
    };

    if (isLoading) {
        return <div><Spin /></div>;
    }

    return (
        <div>
            <div className="button-group flex items-center justify-center space-x-3 mb-6">
                <Button className='text-blue-700 bg-blue-400 hover:text-blue-800 hover:bg-blue-500' type={formSection === 'brochure' ? 'primary' : 'default'} onClick={() => setFormSection('brochure')}>Brochure</Button>
                <Button className='text-orange-700 bg-[#FFE98F] hover:text-orange-800 hover:bg-[#FFE98F] border-orange-500 hover:border-orange-500' type={formSection === 'marksheet' ? 'primary' : 'default'} onClick={() => setFormSection('marksheet')}>Sample Marksheet</Button>
                <Button className='text-green-700 bg-green-400 hover:text-green-800 hover:bg-green-500 border-green-500 hover:border-green-500' type={formSection === 'degree' ? 'primary' : 'default'} onClick={() => setFormSection('degree')}>Sample Degree</Button>
            </div>

            <Form form={form} onFinish={onFinish} layout='vertical'>
                <Form.Item label="University" name="university">
                    <Select
                        className="capitalize"
                        placeholder='Select university name'
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {universityList.map(uni => (
                            <Option className="capitalize" key={uni} value={uni}>{uni}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {formSection === 'brochure' && (
                    <>
                        <Form.Item label="Course" name="course">
                            <Select
                                placeholder='Select course'
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {courseList.map(course => (
                                    <Option key={course} value={course}>{course}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Elective" name="elective">
                            <Select
                                placeholder='Select elective'
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {electiveList.map(elective => (
                                    <Option key={elective} value={elective}>{elective}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Brochure"
                            name="brochure"
                            valuePropName="fileList"
                            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                        >
                            <Upload.Dragger
                                multiple={true}
                                listType="picture"
                                accept="image/png, image/jpeg, image/svg+xml, application/pdf"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                                <p className="ant-upload-hint">Support for multiple images and PDF files</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </>
                )}

                {formSection === 'marksheet' && (
                    <Form.Item
                        label="Sample Marksheet"
                        name="sampleMarksheet"
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    >
                        <Upload.Dragger
                            multiple={true}
                            listType="picture"
                            accept="image/png, image/jpeg, image/svg+xml, application/pdf"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to this area to upload</p>
                            <p className="ant-upload-hint">Support for multiple images and PDF files</p>
                        </Upload.Dragger>
                    </Form.Item>
                )}

                {formSection === 'degree' && (
                    <Form.Item
                        label="Sample Degree"
                        name="sampleDegree"
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    >
                        <Upload.Dragger
                            multiple={true}
                            listType="picture"
                            accept="image/png, image/jpeg, image/svg+xml, application/pdf"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to this area to upload</p>
                            <p className="ant-upload-hint">Support for multiple images and PDF files</p>
                        </Upload.Dragger>
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Index;
