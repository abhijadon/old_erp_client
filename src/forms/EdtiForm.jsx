import { Form, Input, Select, Radio } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { useState } from 'react';


const { TextArea } = Input;
export default function EditForm() {
    const translate = useLanguage();
    const [status, setStatus] = useState('');

    return (
        <>
            <div className='grid grid-cols-4 gap-3'>
                <Form.Item
                    label={translate('studentid')}
                    name={['lead_id']}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label={translate('student name')}
                    name={['full_name']}
                >
                    <Input type='text' autoComplete='on' />
                </Form.Item>

                <Form.Item
                    label={translate('email')}
                    name={['contact', 'email']}
                    rules={[
                        { required: true, message: 'Email is required' }
                    ]}
                >
                    <Input type='email' autoComplete='
                on'/>
                </Form.Item>

                <Form.Item
                    label={translate('phone')}
                    name={['contact', 'phone']}
                    rules={[
                        { required: true, message: 'Phone is required' }
                    ]}
                >
                    <Input type='tel' autoComplete='on' />
                </Form.Item>

                <Form.Item
                    label={translate('Alternate number')}
                    name={['contact', 'alternate_phone']}

                >
                    <Input type='tel' autoComplete='on' />
                </Form.Item>


                <Form.Item
                    label={translate('course')}
                    name={['education', 'course']}
                >
                    <Input type="text" />
                </Form.Item>

                <Form.Item
                    label={translate('Specialization')}
                    name={['customfields', 'enter_specialization']}
                >
                    <Input type='text' autoComplete='on' />
                </Form.Item>
                <Form.Item
                    label={translate('session')}
                    name={['customfields', 'session']}
                >
                    <Select
                        showSearch
                        placeholder='select session' options={[
                            { value: 'JAN 20', label: 'JAN 20' },
                            { value: 'JULY 20', label: 'JULY 20' },
                            { value: 'JAN 21', label: 'JAN 21' },
                            { value: 'JULY 21', label: 'JULY 21' },
                            { value: 'JAN 22', label: 'JAN 22' },
                            { value: 'JULY 22', label: 'JULY 22' },
                            { value: 'JAN 23', label: 'JAN 23' },
                            { value: 'JULY 23', label: 'JULY 23' },
                            { value: 'JAN 24', label: 'JAN 24' },
                            { value: 'JULY 24', label: 'JULY 24' },
                            { value: 'JAN 25', label: 'JAN 25' },
                            { value: 'JULY 25', label: 'JULY 25' },
                            { value: 'MAR 23', label: 'MAR 23' },
                            { value: 'MAR 25', label: 'MAR 25' },
                            { value: 'APR 23', label: 'APR 23' },
                            { value: 'OCT 23', label: 'OCT 23' },
                            { value: 'OCT 24', label: 'OCT 24' },
                            { value: 'NOV 23', label: 'NOV 23' },
                        ]}>

                    </Select>
                </Form.Item>
                <Form.Item
                    label={translate('admission type')}
                    name={['customfields', 'admission_type']}
                >
                    <Select
                        showSearch
                        placeholder='select admission type'
                        options={[
                            { value: 'FRESH', label: 'FRESH' },
                            { value: 'Credit Transfer', label: 'Credit Transfer' },
                            { value: 'LATERAL ENTRY', label: 'LATERAL ENTRY' }
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={translate('Institute name')}
                    name={['customfields', 'institute_name']}
                >
                    <Select
                        showSearch
                        optionFilterProp='children'
                        options={[
                            { value: 'HES', label: 'HES' },
                            { value: 'DES', label: 'DES' },
                        ]}
                    ></Select>
                </Form.Item>

                <Form.Item
                    label={translate('university name')}
                    name={['customfields', 'university_name']}
                >
                    <Select
                        showSearch
                        optionFilterProp='children'
                        options={[
                            { value: 'SGVU', label: 'SGVU' },
                            { value: 'CU', label: 'CU' },
                            { value: 'AMRITA', label: 'AMRITA' },
                            { value: 'AMITY', label: 'AMITY' },
                            { value: 'SPU', label: 'SPU' },
                            { value: 'LPU', label: 'LPU' },
                            { value: 'DPU', label: 'DPU' },
                            { value: 'JAIN', label: 'JAIN' },
                            { value: 'SVSU', label: 'SVSU' },
                            { value: 'VIGNAN', label: 'VIGNAN' },
                            { value: 'VGU', label: 'VGU' },
                            { value: 'SHOOLINI', label: 'SHOOLINI' },
                            { value: 'SHARDA', label: 'SHARDA' },
                            { value: 'MANIPAL', label: 'MANIPAL' },
                            { value: 'SMU', label: 'SMU' },
                            { value: 'HU', label: 'HU' },
                            { value: 'BOSSE', label: 'BOSSE' },
                            { value: 'UU', label: 'UU' },
                            { value: 'UPES', label: 'UPES' },
                            { value: 'MANGALAYATAN DISTANCE', label: 'MANGALAYATAN DISTANCE' },
                            { value: 'MANGALAYATAN ONLINE', label: 'MANGALAYATAN ONLINE' },
                        ]}
                    ></Select>
                </Form.Item>

                <Form.Item
                    label={translate('father name')}
                    name={['customfields', 'father_name']}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate('mother name')}
                    name={['customfields', 'mother_name']}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate('date of birth')}
                    name={['customfields', 'dob']}
                >
                    <Input type='date' className='uppercase' />
                </Form.Item>

                <Form.Item
                    label={translate('gender')}
                    name={['customfields', 'gender']}
                >
                    <Select
                        showSearch
                        options={[
                            { value: 'Male', label: translate('Male') },
                            { value: 'Female', label: translate('Female') },
                            { value: 'Other', label: translate('Other') },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={translate('Installment Type')}
                    name={['customfields', 'installment_type']}
                    rules={[
                        { required: true, message: 'Installment is required' }
                    ]}
                >
                    <Select
                        showSearch
                        options={[
                            { value: '1st Installment', label: '1st Installment' },
                            { value: '2nd Installment', label: '2nd Installment' },
                            { value: '3rd Installment', label: '3rd Installment' },
                            { value: '4th Installment', label: '4th Installment' },
                            { value: '5th Installment', label: '5th Installment' },
                            { value: '6th Installment', label: '6th Installment' },
                            { value: '7th Installment', label: '7th Installment' },
                            { value: '8th Installment', label: '8th Installment' },
                            { value: '9th Installment', label: '9th Installment' },
                            { value: '10th Installment', label: '10th Installment' },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={translate('Payment Mode')}
                    name={['customfields', 'payment_mode']}
                >
                    <Select
                        showSearch
                        options={[
                            { value: 'DES Bank Account/UPI', label: 'DES Bank Account/UPI' },
                            { value: 'University Website', label: 'University Website' },
                            { value: 'HES Bank Account/UPI', label: 'HES Bank Account/UPI' },
                            { value: 'University Bank Account', label: 'University Bank Account' },
                            { value: 'Cash/DD', label: 'Cash/DD' }

                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={translate('payment type')}
                    name={['customfields', 'payment_type']}
                >
                    <Select
                        showSearch
                        options={[
                            { value: 'Semester', label: translate('semester') },
                            { value: 'Yearly', label: translate('Yearly') },
                            { value: 'Fullfees', label: translate('Fullfees') },
                        ]}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label={translate('Total Course Fee')}
                    name={['customfields', 'total_course_fee']}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate('Total Paid Amount')}
                    name={['customfields', 'total_paid_amount']}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate('Paid Amount')}
                    name={['customfields', 'paid_amount']}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={translate('status')}
                    name={['customfields', 'status']}
                    rules={[{ required: true, message: 'Status is required' }]}
                >
                    <Select
                        showSearch
                        options={[
                            { value: 'New', label: translate('New') },
                            { value: 'Approved', label: translate('Approved') },
                            { value: 'Processed', label: translate('Processed') },
                            { value: 'Enrolled', label: translate('Enrolled') },
                            { value: 'Correction', label: translate('Correction') },
                            { value: 'Cancel', label: translate('Cancel') },
                            { value: 'Refunded', label: translate('Refunded') },
                            { value: 'Alumni', label: translate('Alumni') },
                        ]}
                        onChange={(value) => setStatus(value)} // Update status state
                    />
                </Form.Item>

                {status === 'Enrolled' && ( // Conditionally render if status is 'Enrolled'
                    <Form.Item
                        label={translate('Enrollment Number')}
                        name={['customfields', 'enrollment']}
                        rules={[
                            { required: status === 'Enrolled', message: 'Enrollment number is required for enrolled status' },
                        ]}
                    >
                        <Input placeholder='Enter enrollment number' />
                    </Form.Item>

                )}
                <Form.Item
                    label={translate('paymentStatus')}
                    name={['customfields', 'paymentStatus']}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label={translate('Remark')}
                    name={['customfields', 'remark']}
                >
                    <TextArea rows={1} />
                </Form.Item>

            </div>
        </>
    );
}