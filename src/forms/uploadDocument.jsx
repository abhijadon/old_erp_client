import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import axios from 'axios';
import useLanguage from '@/locale/useLanguage';
import { InboxOutlined } from '@ant-design/icons';

const UploadDocument = ({ entity, id, recordDetails, onCloseModal }) => {
    const [loading, setLoading] = useState(false);
    const translate = useLanguage();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const validateFileSize = (file) => {
        const isLessThan20MB = file.size / 1024 / 1024 < 20;
        if (!isLessThan20MB) {
            message.error(`${file.name} is larger than 20MB!`);
        }
        return isLessThan20MB;
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            if (recordDetails) {
                if (recordDetails.feeDocument) {
                    recordDetails.feeDocument.forEach((file) => {
                        formData.append('feeDocument', file);
                    });
                }
                if (recordDetails.studentDocument) {
                    recordDetails.studentDocument.forEach((file) => {
                        formData.append('studentDocument', file);
                    });
                }
            }

            if (values.feeDocuments) {
                values.feeDocuments.forEach((file) => {
                    formData.append('feeDocument', file.originFileObj);
                });
            }

            if (values.studentDocuments) {
                values.studentDocuments.forEach((file) => {
                    formData.append('studentDocument', file.originFileObj);
                });
            }

            const response = await axios.put(`/${entity}/uploadDocument/${id}`, formData);

            if (response?.data?.success) {
                setSuccess(true);
                if (onCloseModal) {
                    onCloseModal();
                }
                message.success(response.data.message);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            message.error('Failed to upload documents. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish} initialValues={recordDetails || null}>
            <Form.Item name="full_name" label="Fullname" rules={[{ required: true, message: 'Please enter fullname' }]}>
                <Input disabled />
            </Form.Item>

            <Form.Item label={translate('email')} name={['contact', 'email']}>
                <Input type='email' autoComplete='on' disabled />
            </Form.Item>

            <Form.Item label={translate('phone')} name={['contact', 'phone']}>
                <Input type='tel' autoComplete='on' disabled />
            </Form.Item>

            <Form.Item
                label="Upload Fee Documents"
                name="feeDocuments"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
            >
                <Upload.Dragger
                    multiple
                    listType="picture"
                    accept="image/*,application/pdf"
                    beforeUpload={validateFileSize}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p>Click or drag files to upload fee documents.</p>
                </Upload.Dragger>
            </Form.Item>

            <Form.Item
                label="Upload Student Documents"
                name="studentDocuments"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
            >
                <Upload.Dragger
                    multiple
                    listType="picture"
                    accept="image/*,application/pdf"
                    beforeUpload={validateFileSize}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p>Click or drag files to upload student documents.</p>
                </Upload.Dragger>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Upload Documents
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UploadDocument;
