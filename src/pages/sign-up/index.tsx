import { Button, Form, Grid, Input, theme, Typography, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import auth from "../../service/auth";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

interface SignUpFormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const handleSubmit = async (values: SignUpFormValues) => {
    window.localStorage.setItem("first_name", values.first_name)
    window.localStorage.setItem("last_name", values.last_name)
    window.localStorage.setItem("phone_number", values.phone_number)
    window.localStorage.setItem("email", values.email)
    window.localStorage.setItem("password", values.password)
    try {
      const response = await auth.sign_up({ ...values });
      console.log(values, response);
      if (response.status === 201) {
        const access_token = response.data?.data?.tokens?.access_token;
        if (access_token) {
          localStorage.setItem("access_token", access_token);
          navigate("/admin/categories");
          console.log(access_token);
        }
      } else {
        notification.error({
          message: "Error",
          description: "Password or Name is incorrect.",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again.",
      });
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.paddingXL}px ${token.padding}px`,
      width: "380px",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center",
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Sign up</Title>
          <Text style={styles.text}>Join us! Create an account to get started.</Text>
        </div>
        <Form
          name="normal_signup"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Please input your Last name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last name" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            rules={[
              { required: true, message: "Please input your Phone number!" },
              { pattern: /^[0-9]{9}$/, message: "Please enter a valid phone number (9 digits)!" },
            ]}
          >
            <Input addonBefore="+998" maxLength={9} placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email address" />
          </Form.Item>
          <Form.Item
            name="password"
            extra="Password needs to be at least 8 characters."
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block style={{ backgroundColor: "#BC8E5B" }} className="text-white" htmlType="submit">
              Sign up
            </Button>
            <div style={styles.signup}>
              <Text style={styles.text}>Already have an account?</Text>{" "}
              <Link style={{ color: "#BC8E5B" }} href="/">
                Sign in
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
