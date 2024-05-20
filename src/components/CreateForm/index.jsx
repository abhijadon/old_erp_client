import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectCreatedItem } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { Button, Form, Drawer } from 'antd';
import Loading from '@/components/Loading';

export default function CreateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const translate = useLanguage();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [formData, setFormData] = useState(null); // State to hold form data
  const [dueAmount, setDueAmount] = useState(0); // State to hold due amount
  const [logoUrl, setLogoUrl] = useState('https://highereducationschool.com/wp-content/uploads/2022/09/3.png'); // Default logo URL

  const onSubmit = (fieldsValue) => {
    const universityName = fieldsValue.customfields ? fieldsValue.customfields.university_name : '';
    const session = fieldsValue.customfields ? fieldsValue.customfields.session : '';

    // Check if the entity is 'lead' and the university name is one of the specified values and not "MANGALAYATAN ONLINE"
    if (entity === 'lead' && (['SPU', 'BOSSE', 'MANGALAYATAN DISTANCE'].includes(universityName) || (universityName === 'MANGALAYATAN ONLINE' && ['JULY 23', 'JAN 24'].includes(session)))) {
      // Open the drawer if the conditions are met
      setIsDrawerVisible(true);
      // Save form data to display in drawer
      setFormData(fieldsValue);
    } else {
      // If the conditions are not met, directly submit the form
      dispatchFormSubmission(fieldsValue);
    }
  };

  const handleConfirm = () => {
    // Dispatch the form submission action
    dispatchFormSubmission(form.getFieldsValue());
    // Close the drawer
    setIsDrawerVisible(false);
  };

  const handleCancel = () => {
    // Close the drawer
    setIsDrawerVisible(false);
  };

  const dispatchFormSubmission = (fieldsValue) => {
    const formData = new FormData();
    console.log('felval', fieldsValue)
    if (fieldsValue && entity !== 'lead') {
      console.log('fiewldvalue', fieldsValue)
      dispatch(crud.create({ entity, jsonData: fieldsValue, withUpload: true }));

      return; // Exit the function
    }

    // Get form values using form.getFieldsValue()
    fieldsValue = form.getFieldsValue();

    formData.append('full_name', fieldsValue.full_name);
    formData.append('lead_id', fieldsValue.lead_id);
    formData.append('contact.email', fieldsValue.contact.email);
    formData.append('contact.phone', fieldsValue.contact.phone);
    formData.append('contact.alternate_phone', fieldsValue.contact.alternate_phone);
    formData.append('education.course', fieldsValue.education.course);
    formData.append('customfields.institute_name', fieldsValue.customfields.institute_name);
    formData.append('customfields.university_name', fieldsValue.customfields.university_name);
    formData.append('customfields.father_name', fieldsValue.customfields.father_name);
    formData.append('customfields.mother_name', fieldsValue.customfields.mother_name);
    formData.append('customfields.session', fieldsValue.customfields.session);
    formData.append('customfields.admission_type', fieldsValue.customfields.admission_type);
    formData.append('customfields.enter_specialization', fieldsValue.customfields.enter_specialization);
    formData.append('customfields.dob', fieldsValue.customfields.dob);
    formData.append('customfields.remark', fieldsValue.customfields.remark);
    formData.append('customfields.gender', fieldsValue.customfields.gender);
    formData.append('customfields.installment_type', fieldsValue.customfields.installment_type);
    formData.append('customfields.payment_mode', fieldsValue.customfields.payment_mode);
    formData.append('customfields.payment_type', fieldsValue.customfields.payment_type);
    formData.append('customfields.total_course_fee', fieldsValue.customfields.total_course_fee);
    formData.append('customfields.total_paid_amount', fieldsValue.customfields.total_paid_amount);
    formData.append('customfields.paid_amount', fieldsValue.customfields.paid_amount);
    formData.append('customfields.status', fieldsValue.customfields.status);
    // Append other form fields as needed


    // Append file data to FormData object
    if (fieldsValue.feeDocument && Array.isArray(fieldsValue.feeDocument)) {
      fieldsValue.feeDocument.forEach((file) => {
        formData.append('feeDocument', file.originFileObj);
      });
    }
    if (fieldsValue.studentDocument && Array.isArray(fieldsValue.studentDocument)) {
      fieldsValue.studentDocument.forEach((file) => {
        formData.append('studentDocument', file.originFileObj);
      });
    }

    // Dispatch the form submission action with the modified form data
    dispatch(crud.create({ entity, jsonData: formData, withUpload: true }));
  };



  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setIsFormVisible(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (formData) {
      // Calculate due amount based on total course fee and total paid amount
      const totalCourseFee = parseFloat(formData.customfields.total_course_fee);
      const totalPaidAmount = parseFloat(formData.customfields.paid_amount);
      const calculatedDueAmount = totalCourseFee - totalPaidAmount;
      setDueAmount(calculatedDueAmount);

      // Determine the logo URL based on the type of institute
      if (formData.customfields.institute_name === 'HES') {
        setLogoUrl('https://highereducationschool.com/wp-content/uploads/2022/09/3.png');
      } else if (formData.customfields.institute_name === 'DES') {
        setLogoUrl('https://distanceeducationschool.com/wp-content/uploads/2022/10/des-colour-logo-300px.png');
      }
    }
  }, [formData]);

  return (
    <>
      <Loading isLoading={isLoading}>
        {isFormVisible && (
          <Form form={form} layout="vertical" onFinish={onSubmit} encType='multipart/form-data'>
            {formElements}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {translate('Submit')}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Loading>
      {entity === "lead" && (
        <Drawer
          width={700}
          title={
            <div>
              <h3><span className='bg-yellow-500 pl-2 pr-2 '>Note:</span> <span className='font-thin ml-3 text-[#003333]'>You are sending Fees receipt to the student, kindly cross-check once & give confirmation</span></h3>
            </div>
          }
          placement="right"
          closable={false}
          onClose={handleCancel}
          visible={isDrawerVisible}
          footer={
            <div style={{ textAlign: 'left', padding: '20px' }}>
              <Button className='bg-green-700 text-white h-10 w-36 mr-2' onClick={handleConfirm}>
                Confirm
              </Button>
              <Button className='bg-transparent text-gray-500 border border-gray-400 hover:text-gray-600 font-thin h-9 w-36' onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          }
        >
          {formData && (
            <div>
              <div>
                <img width={200} src={logoUrl} alt="Logo" />
              </div>
              <div className='mt-10'>
                <h3 className='font-bold text-xl'>Student Details: </h3>
                <div className='mt-3'>
                  <ul className='list-disc'>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066]'>Fullname</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.full_name}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066]'>Course</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.education.course}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20 '>
                      <span className='text-base font-thin text-[#000066]'>Father's Name</span>
                      <span className='text-sm font-thin text-left text-gray-500'>{formData.customfields.father_name}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066]'>Date of Birth</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.customfields.dob}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066] capitalize'>Mobile Number</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.contact.phone}</span>
                    </li>
                    <li className='grid grid-cols-2 gap-20 border-b p-1'>
                      <span className='text-base font-thin text-[#000066]'>Email Address</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.contact.email}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='mt-10'>
                <h3 className='font-bold text-xl'>Payment Details: </h3>
                <div className='mt-3'>
                  <ul className='list-disc'>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066]'>Total Course Fee</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.customfields.total_course_fee}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20 '>
                      <span className='text-base font-thin text-[#000066]'>Total Paid Amount</span>
                      <span className='text-sm font-thin text-left text-gray-500'>{formData.customfields.paid_amount}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066]'>Paid Amount</span>
                      <span className='text-sm font-thin text-gray-500'>{formData.customfields.paid_amount}</span>
                    </li>
                    <li className=' border-b p-1 grid grid-cols-2 gap-20'>
                      <span className='text-base font-thin text-[#000066] capitalize'>Due Amount</span>
                      <span className='text-sm font-thin text-gray-500'>{dueAmount}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
