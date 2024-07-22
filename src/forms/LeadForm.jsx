import { useState, useEffect } from 'react';
import { Form, Select, Input, Checkbox, Radio, notification, Upload, message, InputNumber } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import formData from './formData';

const { Option } = Select;

/* require message show on notification */
const openNotification = (fieldName) => {
  const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  notification.error({
    message: 'Field Validation',
    description: `${capitalizedFieldName} is required.`,
    placement: 'topLeft',
  });
};
/* require message show on notification */
export default function LeadForm() {
  /* useState, useEffect uses condition */
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [selectedAdmissionType, setSelectedAdmissionType] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const handleAdmissionTypeChange = (value) => {
    setSelectedAdmissionType(value);
  };

  useEffect(() => {
    if (selectedInstitute && selectedUniversity) {
      setStudentId(generateUniqueId());
    } else {
      setStudentId('');
    }
  }, [selectedInstitute, selectedUniversity]);

  const generateUniqueId = () => {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min - 1)) + min);
  };
  /* student id generate automatica */

  /* handlechanges */
  const handleInstituteChange = (value) => {
    setSelectedInstitute(value);
    setSelectedUniversity(null);
  };

  const handleUniversityChange = (value) => {
    setSelectedUniversity(value);
    setSelectedCourse(null);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const handleSpecializationChange = (value) => {
    setSelectedSpecialization(value);
  };

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };
  /* handlechanges */

  const restrictNumericInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  /* generate fields dynamic by selectedUniversity */

  const generateFormItems = (fields) => {
    return fields.map((field) => {
      // Add a check to ensure that field.label is defined
      const capitalizedLabel = field.label ? field.label.charAt(0).toUpperCase() + field.label.slice(1) : '';
      switch (field.type) {
        case 'studentId':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              initialValue={generateUniqueId()}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        // If the value is not empty or the field is not required, resolve
                        resolve();
                      } else {
                        // If the value is empty and the field is required, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <Input
                placeholder="Generated automatically"
                value={studentId}
                disabled
              />
            </Form.Item>
          );

        case 'text':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        // If the value is not empty or the field is not required, resolve
                        resolve();
                      } else {
                        // If the value is empty and the field is required, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <Input placeholder={field.place} />
            </Form.Item>
          );
        case 'email':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              rules={[
                {
                  type: 'email',
                  message: 'Please enter a valid email address',
                  required: field.required === 'require',
                },
                {
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (!value && field.required === 'require') {
                        // If the field is required and value is empty, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      } else {
                        // Otherwise, resolve
                        resolve();
                      }
                    });
                  },
                },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input placeholder={field.place} />
            </Form.Item>
          );
        case 'tel':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        // If the value is not empty or the field is not required, resolve
                        resolve();
                      } else {
                        // If the value is empty and the field is required, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <InputNumber
                placeholder={field.place}
                style={{ width: '100%' }}
                min={0}
                onKeyPress={restrictNumericInput}
              />
            </Form.Item>
          );
        case 'select':
          return (
            <Form.Item
              key={field.id}
              label={field.label ? field.label.charAt(0).toUpperCase() + field.label.slice(1) : ''}
              name={field.name}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        resolve();
                      } else {
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={field.place}
              >
                {field.options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label ? option.label.charAt(0).toUpperCase() + option.label.slice(1) : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        case 'date':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        // If the value is not empty or the field is not required, resolve
                        resolve();
                      } else {
                        // If the value is empty and the field is required, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <Input
                type="date"
                placeholder={field.place}
                className='uppercase'
                max="9999-12-31" // Set the max date value to ensure only 4-digit years
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
            </Form.Item>
          );
        case 'textarea':
          return (
            <Form.Item
              key={field.id}
              label={capitalizedLabel}
              name={field.name}
              rules={[
                {
                  required: field.required === 'require',
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (value || field.required !== 'require') {
                        // If the value is not empty or the field is not required, resolve
                        resolve();
                      } else {
                        // If the value is empty and the field is required, reject and show notification
                        openNotification(field.label);
                        reject(`${field.label} is required.`);
                      }
                    });
                  },
                },
              ]}
            >
              <Input.TextArea rows={1} placeholder={field.place} />
            </Form.Item>
          );
        default:
          return null;
      }
    });
  };
  /* generate fields dynamic by selectedUniversity */
  return (
    <div>
      <form className='grid grid-cols-4 gap-3'>
        <Form.Item label="Select Institute" name={['customfields', 'institute_name']} >
          <Select
            showSearch
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleInstituteChange}
            placeholder="--Select Institute--"
          >
            {formData.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedInstitute && (
          <>
            <Form.Item label="Select University" name={['customfields', 'university_name']} >
              <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={handleUniversityChange}
                placeholder="--Select University--"
              >
                {formData
                  .find((item) => item.value === selectedInstitute)
                  .universities?.map((university) => (
                    <Option key={university.value} value={university.value}>
                      {university.label}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            {/* selectedcourse and then show specialization */}
            {selectedUniversity && (
              <>
                {formData
                  .find((item) => item.value === selectedInstitute)
                  .universities.find((university) => university.value === selectedUniversity)
                  .fields[0]?.courses ? (
                  <Form.Item label="Select Course" name={['education', 'course']}>
                    <Select
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={handleCourseChange}
                      placeholder="--Select Course--"
                    >
                      {formData
                        .find((item) => item.value === selectedInstitute)
                        .universities.find((university) => university.value === selectedUniversity)
                        .fields[0]?.courses?.map((course) => (
                          <Option key={course.value} value={course.value}>
                            {course.label}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                ) : null}
                {selectedCourse && (
                  <div>
                    <Form.Item label="Select Specialization" name={['customfields', 'enter_specialization']}>
                      <Select
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="--Select Specialization--"
                        onChange={handleSpecializationChange}
                      >
                        {formData
                          .find((item) => item.value === selectedInstitute)
                          .universities.find((university) => university.value === selectedUniversity)
                          .fields[0]?.courses
                          .find((course) => course.value === selectedCourse)
                          ?.specializations?.map((specialization) => (
                            <Option key={specialization.value} value={specialization.value}>
                              {specialization.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                )}
              </>
            )}
            {/* selectedcourse and then show specialization */}
          </>
        )}
      </form>
      {selectedUniversity && (
        <div>
          <form className='grid grid-cols-3 gap-3'>
            {generateFormItems(
              formData
                .find((item) => item.value === selectedInstitute)
                .universities.find((university) => university.value === selectedUniversity).fields
            )}
            {selectedUniversity && (
              <>
                <div>
                  {/* Render admission type select */}
                  {formData
                    .find((item) => item.value === selectedInstitute)
                    .universities.find((university) => university.value === selectedUniversity)
                    .fields[1]?.admission_type ? (
                    <Form.Item
                      label="Select admission status"
                      name={['customfields', 'admission_type']}
                      className='grid col-span-1'
                      rules={[
                        {
                          required: true,
                          message: "Please Select admission status",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleAdmissionTypeChange}
                        placeholder="--Select admission status--"
                      >
                        {formData
                          .find((item) => item.value === selectedInstitute)
                          .universities.find((university) => university.value === selectedUniversity)
                          .fields[1]?.admission_type?.map((admission) => (
                            <Option key={admission.value} value={admission.value}>
                              {admission.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  ) : null}

                  {/* Render payment select based on selected admission type */}
                  {selectedAdmissionType && (
                    <Form.Item
                      label="Select payment status"
                      name={['customfields', 'payment_type']}
                      className='grid col-span-1'
                      rules={[
                        {
                          required: true,
                          message: "Please Select admission status",
                        },
                      ]}
                    >
                      <Select
                        onChange={handlePaymentChange}
                        placeholder="--Select Payment--"
                      >
                        {/* Map over payment options based on selected admission type */}
                        {formData
                          .find((item) => item.value === selectedInstitute)
                          .universities.find((university) => university.value === selectedUniversity)
                          .fields[1]?.admission_type
                          .find((admission) => admission.value === selectedAdmissionType)
                          ?.payments.map((payment) => (
                            <Option key={payment.value} value={payment.value}>
                              {payment.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  )}

                  {/* Render payment types based on selected payment option */}
                  {selectedPayment && (
                    <div>
                      <Form.Item>
                        {(formData
                          .find((item) => item.value === selectedInstitute)
                          .universities.find((university) => university.value === selectedUniversity)
                          .fields[1]?.admission_type
                          .find((admission) => admission.value === selectedAdmissionType)
                          ?.payments.find((payment) => payment.value === selectedPayment)?.paymentType || []
                        ).map((pay) => (
                          <Form.Item
                            key={pay.label}
                            label={pay.label}
                            name={pay.name}  // Use pay.name as the name
                            rules={[
                              {
                                required: pay.required === 'require',
                                message: `Please input ${pay.label}!`,
                              },
                            ]}
                          >

                            <InputNumber
                              placeholder={pay.place} type={pay.type}
                              style={{ width: '100%' }}
                              min={0}
                              onKeyPress={restrictNumericInput}
                            />
                          </Form.Item>
                        ))}
                      </Form.Item>
                    </div>
                  )}
                </div>
              </>
            )}
            <Form.Item
              label="Fee Documents"
              name="feeDocument"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload.Dragger
                multiple={true} // Allow multiple file upload
                listType="picture"
                accept=".png,.jpeg,.jpg,.pdf"
                beforeUpload={(file) => {
                  const isJpgOrPngOrPdf =
                    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
                  if (!isJpgOrPngOrPdf) {
                    message.error('You can only upload JPG/PNG/PDF file!');
                    return Upload.LIST_IGNORE;
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error('File must be smaller than 2MB!');
                    return Upload.LIST_IGNORE;
                  }
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                <p className="ant-upload-hint">Support for multiple images and PDF files</p>
              </Upload.Dragger>
            </Form.Item>
          </form>
        </div>
      )}
    </div>
  );
}
