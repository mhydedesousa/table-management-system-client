import { useEffect, useState } from "react";
import "./App.css";
import { Button, Space, Table, Row } from "antd";
import {
  addToTable,
  deleteFromTable,
  getTableInfo,
  getTables,
} from "./util/APIUtil";
import FormModal from "./components/FormModal";

function Home() {
  const [tables, setTables] = useState([]);
  const [tableSchema, setTableSchema] = useState<any[]>([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [loadingForm, setLoadingForm] = useState(false);
  const [fields, setFields] = useState([]);

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
    const handleClick = async () => {
      setShowModal(true);

      setLoadingForm(true);
      const fieldsArr: any = [];
      const loadedData: any = [];
      for (const col of tableSchema) {
        if (col.column_name !== "id") {
          // if no referenced table, then this will be a simple Input
          if (!col.referenced_table_name) {
            fieldsArr.push({ info: col });
          } else {
            // otherwise, check if loaded the table already and set up options for a <Select/>
            const existingDataInLoadedData = loadedData.find(
              (x: any) => x.name === col.referenced_table_name
            );

            if (existingDataInLoadedData) {
              fieldsArr.push({
                info: col,
                options: existingDataInLoadedData.data.map((x: any) => {
                  const label = Object.hasOwn(x, "name")
                    ? x["name"]
                    : x[col.referenced_column_name];
                  return {
                    value: x[col.referenced_column_name],
                    label: label,
                  };
                }),
              });
            } else {
              try {
                const response = await getTableInfo(col.referenced_table_name!);
                loadedData.push({
                  data: response.data,
                  name: col.referenced_table_name,
                });

                fieldsArr.push({
                  info: col,
                  options: response.data.map((x: any) => {
                    const label = Object.hasOwn(x, "name")
                      ? x["name"]
                      : x[col.referenced_column_name];
                    return {
                      value: x[col.referenced_column_name],
                      label: label,
                    };
                  }),
                });
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      }

      setFields(fieldsArr);
      setLoadingForm(false);
    };

    return (
      <Button style={{ marginBottom: 24 }} type="primary" onClick={handleClick}>
        Add
      </Button>
    );
  };

  const onFinish = (values: any) => {
    setSubmitLoading(true);
    addToTable(selectedTable!, values)
      .then((response) => {
        getTableInfo(selectedTable!)
          .then((response) => {
            setTableSchema(response.schema);
            setTableData(response.data);
            setSubmitLoading(false);
            setShowModal(false);
          })
          .catch((e) => {
            console.log(e);
            setSubmitLoading(false);
          });
      })
      .catch((e) => {
        console.log(e);
        setSubmitLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
    setShowModal(false);
  };

  const onFinishFailed = (error: any) => {
    console.log("Failed:", error);
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
          <FormModal
            fields={fields}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            loadingForm={loadingForm}
            showModal={showModal}
            setShowModal={setShowModal}
            submitLoading={submitLoading}
          />
          {renderTable()}
        </>
      )}
    </div>
  );
}

export default Home;
