import { useEffect, useState } from "react";
import "../App.css";
import { Button, Modal, Form, Input, Spin, Select } from "antd";

interface Props {
  fields: any;
  loadingForm: boolean;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  showModal: boolean;
  setShowModal: any;
  submitLoading: boolean;
}
function FormModal({
  fields,
  onFinish,
  onFinishFailed,
  loadingForm,
  showModal,
  setShowModal,
  submitLoading,
}: Props) {
  const renderFields = () => {
    return fields.map((x: any) => {
      const chooseInput = () => {
        if (!x.options) {
          return (
            <Input disabled={submitLoading} defaultValue={x.defaultValue} />
          );
        } else {
          return (
            <Select
              disabled={submitLoading}
              options={x.options}
              defaultValue={x.defaultValue}
            />
          );
        }
      };
      return (
        <Form.Item
          key={x.info.column_name}
          label={x.info.column_name}
          name={x.info.column_name}
          rules={[
            {
              required: x.info.is_nullable === "NO",
              message: `${x.info.column_name} is required`,
            },
          ]}
        >
          {chooseInput()}
        </Form.Item>
      );
    });
  };

  return (
    <Modal
      open={showModal}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      onCancel={() => setShowModal(false)}
    >
      <div style={{ padding: 24 }}>
        <Spin spinning={loadingForm}>
          <Form
            name="add"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {renderFields()}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                Add
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </Modal>
  );
}

export default FormModal;
