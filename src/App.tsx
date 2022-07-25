import React, { useState } from "react";
import styles from "./App.module.scss";
import "antd/dist/antd.min.css";
import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import CustomSelect from "./components/custom-select";
import { CountryType } from "./components/country-type.interface";

function App() {
  const [form] = Form.useForm();
  const [textAreaError, setTextAreaError] = useState(false);
  const onFinish = (values: {
    input: string;
    one: CountryType;
    textarea: string;
    two: CountryType[];
  }) => {
    console.log("Success:", values);
  };
  const onFinishF = () => {
    setTextAreaError(!!form.getFieldError("textarea")[0]);
  };
  const onChange = () => {
    setTextAreaError(!!form.getFieldError("textarea")[0]);
  };
  const onChangeS = (
    value: CountryType[] | CountryType | null,
    name: string
  ) => {
    form.setFieldsValue({ name, value });
  };
  const countries: CountryType[] = [
    { id: 1, name: "Andorra" },
    {
      id: 2,
      name: "United Arab Emirates",
    },
  ];
  const countries2: CountryType[] = [
    { id: 1, name: "Belarus" },
    {
      id: 2,
      name: "Russia",
    },
  ];

  return (
    <div className={styles.page}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishF}
        autoComplete="off"
        onFieldsChange={onChange}
      >
        <Form.Item
          label="Select 1"
          name="one"
          required
          rules={[{ message: "Cannot leave blank", required: true }]}
          validateTrigger="onSubmit"
        >
          <CustomSelect
            data={countries}
            onChange={(value) => onChangeS(value, "one")}
          />
        </Form.Item>
        <Form.Item
          label="Select 2"
          name="two"
          required
          rules={[{ message: "Cannot leave blank", required: true }]}
          validateTrigger="onSubmit"
        >
          <CustomSelect
            data={countries2}
            onChange={(value) => onChangeS(value, "two")}
            multiple={true}
          />
        </Form.Item>
        <Form.Item
          label="Input"
          name="input"
          tooltip="This is a required field"
          required
          className={styles["form_item--custom"]}
          rules={[
            { message: "Cannot leave blank", required: true },
            {
              max: 10,
              message: "Value should be less than 10 character",
            },
            {
              min: 5,
              message: "Value should be more than 5 character",
            },
          ]}
          validateTrigger="onSubmit"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="TextArea"
          name="textarea"
          tooltip="This is a required field"
          required
          className={textAreaError ? styles["form_item--custom"] : ""}
          rules={[
            { message: "Cannot leave blank", required: true },
            {
              max: 10,
              message: "Value should be less than 10 character",
            },
            {
              min: 5,
              message: "Value should be more than 5 character",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;
