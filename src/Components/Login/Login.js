import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Input from "../Common/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toSentenceCase from "../../Utils/SentenceCase";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login | Task #4";
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  const handleLoginForm = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password })
      .then((res) => {
        if (res?.data?.success) {
          localStorage.setItem("token", res.data.data);
          toast.success("Login Complete. ");
          navigate("/", { replace: true });
        } else {
          toast.error("Somehing went wrong. Try again.");
          setDisabled(false);
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.error?.errors;
        console.log(msg);
        if (!msg) {
          toast.error("Somehing went wrong. Try again.");
        } else if (msg?.message) {
          toast.error(toSentenceCase(msg?.message || "Something went wrong."));
        } else {
          msg.forEach((single) => {
            toast.error(
              toSentenceCase(
                single?.error || single?.message || "Something went wrong."
              )
            );
          });
        }
        setDisabled(false);
      });
  };
  return (
    <div className="container my-5 py-md-5">
      <div className="row">
        <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 mx-auto border p-4">
          <div className="text-center">
            <h2>Login</h2>
            <p className="lead">Haven't login yet ? Login Now!</p>
          </div>
          <hr />
          <Form
            className="w-full text-start"
            onSubmit={handleLoginForm}
            method="POST"
          >
            <Input
              controlId="2"
              type="email"
              name="email"
              label="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
            <Input
              controlId="3"
              type="Password"
              name="pasword"
              label="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Input>
            <div className="mb-3 overflow-hidden">
              <Button
                variant="primary"
                type="submit"
                className="float-end"
                disabled={disabled}
              >
                Login
              </Button>
            </div>
          </Form>
          <div className="w-25 mx-auto mb-3 border"></div>
          <p className="lead">
            Don't have an account ? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
