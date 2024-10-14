import ManImage from '../../assets/man.jpg'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal, Form, Input, Button } from 'antd';

const Index = () => {
    const firstName = window.localStorage.getItem("first_name");
    const lastName = window.localStorage.getItem("last_name");
    const phoneNumber = window.localStorage.getItem("phone_number");
    const email = window.localStorage.getItem("email");
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const deleteAccount = () => {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("first_name");
        window.localStorage.removeItem("last_name");
        window.localStorage.removeItem("phone_number");
        window.localStorage.removeItem("email");
    }

    const handleUpdate = (values:any) => {
        window.localStorage.setItem("first_name", values.first_name);
        window.localStorage.setItem("last_name", values.last_name);
        window.localStorage.setItem("phone_number", values.phone_number);
        window.localStorage.setItem("email", values.email);
        setVisible(false);
    };

    const showUpdateModal = () => {
        form.setFieldsValue({
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: email
        });
        setVisible(true);
    };
  return (
    <>
    <div className='flex items-center gap-[100px]'>
            <img className='w-[250px]' src={ManImage} alt="" />
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "80px" }}>
                    <div className='flex flex-col gap-2'>
                        <h3>First name</h3>
                        <h1 className='text-[28px]'><b>{firstName || 'Not found'}</b></h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3>Last name</h3>
                        <h1 className='text-[28px]'><b>{lastName || 'Not found'}</b></h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3>Phone number</h3>
                        <h1 className='text-[28px]'><b>{phoneNumber || '+998(Not found)'}</b></h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3>Email address</h3>
                        <h1 className='text-[28px]'><b>{email || 'Not@found'}</b></h1>
                    </div>
                </div>
                <div className='mt-4 flex gap-3'>
                    <NavLink to='/sign-up' className='bg-green-600 p-2 rounded-lg text-white text-[16px]'>Create account</NavLink>
                    <NavLink onClick={showUpdateModal} className='bg-yellow-500 p-2 rounded-lg text-white text-[16px]'>Update account</NavLink>
                    <NavLink to='/sign-up' onClick={deleteAccount} className='bg-red-600 p-2 rounded-lg text-white text-[16px]'>Delete account</NavLink>
                </div>
            </div>

            <Modal
                title="Update Account"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setVisible(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>Save</Button>
                ]}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    </>
  )
}

export default Index