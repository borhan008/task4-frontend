import React from "react";
import { Form } from "react-bootstrap";

const Input = ({ type, name, label, controlId, onChange }) => {
  return (
    <Form.Group className="mb-3" controlId={`controlInput${controlId}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={label}
        name={name}
        onChange={onChange}
        required
      />
    </Form.Group>
  );
};

export default Input;
