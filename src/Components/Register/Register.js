import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Input from "../Common/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toSentenceCase from "../../Utils/SentenceCase";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Register | Task #4";

    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  const handleRegisterForm = (e) => {
    e.preventDefault();
    setDisabled(true);
    const user = {
      email,
      password,
      name,
      position,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/register`, user)
      .then((res) => {
        if (res?.data?.success) {
          toast.success("Registration Complete. Login Now!");
          navigate("/login", { replace: true });
        } else {
          toast.error("Somehing went wrong. Try again.");
          setDisabled(false);
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.error?.errors;
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
            <h2>Registration</h2>
            <p className="lead">Haven't register yet ? Register Now!</p>
          </div>
          <hr />
          <Form
            className="w-full text-start"
            onSubmit={handleRegisterForm}
            method="POST"
          >
            <Input
              controlId="1"
              type="text"
              name="name"
              label="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></Input>
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
            <Input
              controlId="4"
              type="test"
              name="position"
              label="Position"
              onChange={(e) => {
                setPosition(e.target.value);
              }}
            ></Input>

            <div className="mb-3 overflow-hidden">
              <Button
                variant="primary"
                type="submit"
                className="float-end"
                disabled={disabled}
              >
                Register
              </Button>
            </div>
          </Form>
          <div className="w-25 mx-auto mb-3 border"></div>
          <p className="lead">
            Already had an account ? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
