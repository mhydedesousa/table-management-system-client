import { useEffect, useState } from "react";
import "./App.css";
import { Button, Space, Table, Row, Col, Modal, Form, Input } from "antd";
import {
  addToTable,
  deleteFromTable,
  getTableInfo,
  getTables,
} from "./util/APIUtil";

function Home() {
  const [tables, setTables] = useState([]);
  const [tableSchema, setTableSchema] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTables()
      .then((response) => setTables(response))
      .catch((e) => console.log(e));
  }, []);

  const handleTableButtonClick = (tableName: string | null) => {
    // load schema and table
    setLoading(true);
    setSelectedTable(tableName);
    getTableInfo(tableName!)
      .then((response) => {
        setTableSchema(response.schema);
        setTableData(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const renderTableButtons = () => {
    return (
      <Space wrap style={{ marginBottom: 24 }}>
        {tables.map((t) => (
          <Button
            onClick={() => handleTableButtonClick(t)}
            type={selectedTable === t ? "primary" : "default"}
            loading={selectedTable === t && loading}
            disabled={loading}
          >
            {t}
          </Button>
        ))}
      </Space>
    );
  };

  const renderAdd = () => {
    const handleClick = () => {
      setShowModal(true);
    };
    return (
      <Button style={{ marginBottom: 24 }} type="primary" onClick={handleClick}>
        Add
      </Button>
    );
  };

  const renderModal = () => {
    const setUpFormItems = () => {
      return tableSchema.map((x: any) => {
        if (x.column_name === "id") return <></>;
        return (
          <Form.Item
            label={x.column_name}
            name={x.column_name}
            rules={[
              {
                required: x.is_nullable === "NO",
                message: `${x.column_name} is required`,
              },
            ]}
          >
            <Input disabled={addLoading} />
          </Form.Item>
        );
      });
    };
    const onFinish = (values: any) => {
      setAddLoading(true);
      addToTable(selectedTable!, values)
        .then((response) => {
          getTableInfo(selectedTable!)
            .then((response) => {
              setTableSchema(response.schema);
              setTableData(response.data);
              setAddLoading(false);
              setShowModal(false);
            })
            .catch((e) => {
              console.log(e);
              setAddLoading(false);
            });
        })
        .catch((e) => {
          console.log(e);
          setAddLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
      setShowModal(false);
    };
    const onFinishFailed = (error: any) => {
      console.log("Failed:", error);
    };
    return (
      <Modal
        open={showModal}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={() => setShowModal(false)}
      >
        <div style={{ padding: 24 }}>
          <Form
            name="add"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {setUpFormItems()}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={addLoading}>
                Add
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  };

  const renderTable = () => {
    const columns = tableSchema.map((i: any) => {
      return {
        title: i.column_name,
        dataIndex: i.column_name,
        key: i.column_name,
      };
    });

    columns.push({
      title: "delete",
      dataIndex: "delete",
      key: "delete",
    });

    const dataSource = tableData.map((r: any, i: number) => {
      const handleDeleteClick = (id: string) => {
        const newDeleteLoading = [...deleteLoading];
        deleteLoading[i] = true;
        setDeleteLoading(newDeleteLoading);

        deleteFromTable(selectedTable!, r.id)
          .then((response) => {
            const newDeleteLoading = [...deleteLoading];
            deleteLoading[i] = false;
            setDeleteLoading(newDeleteLoading);
            setTableData(tableData.filter((x: any) => x.id !== r.id));
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            const newDeleteLoading = [...deleteLoading];
            deleteLoading[i] = false;
            setDeleteLoading(newDeleteLoading);
          });
      };
      const deleteButton = (
        <Button
          onClick={() => handleDeleteClick(r.id)}
          loading={deleteLoading[i]}
        >
          Delete
        </Button>
      );

      return { ...r, key: i, delete: deleteButton };
    });

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
        // sticky={true}
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Row>{renderTableButtons()}</Row>

      {selectedTable && (
        <>
          <Row>{renderAdd()}</Row>
          {renderModal()}
          {renderTable()}
        </>
      )}
    </div>
  );
}

export default Home;
