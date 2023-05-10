import { useContext } from "react";
import "./App.css";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { Form, Input, Button } from "antd";
import "./Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    login({ email: values.email, password: values.password });
    navigate("/");
  };

  const onFinishFailed = (error: any) => {
    console.log("Failed:", error);
  };

  return !!user ? (
    <Navigate to="/" />
  ) : (
    <div className="Login">
      <div className="CenterContent">
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter a valid email" }]}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password disabled={loading} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
