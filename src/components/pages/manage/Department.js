import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCampus } from "../../../redux/actions/campus_action";
import {
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../../redux/actions/department_action";

import {
    Container,
    Button,
    Card,
    CardBody,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";

import ReactDatatable from "@ashvin27/react-datatable";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Department = () => {
    const campus = useSelector((state) => state.campus.campuses);
    const department = useSelector((state) => state.department.departments);
    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [deptId, setDeptId] = useState("");
    const [deptCode, setDeptCode] = useState("");
    const [deptName, setDeptName] = useState("");
    const [campusId, setCampusId] = useState("");
    const [campusName, setCampusName] = useState("");

    // Datatables Configuration
    const dtColumns = [
        {
            key: "department_no",
            className: "text-center",
            align: "left",
            sortable: true,
            width: 150,
            cell: (department) => {
                return (
                    <React.Fragment>
                        <Button
                            size="sm"
                            className="btn-circle"
                            onClick={() => showEditForm(department)}
                        >
                            <i className="fas fa-edit ml-1"></i>
                        </Button>{" "}
                        &nbsp;
                        <Button
                            color="danger"
                            size="sm"
                            className="btn-circle"
                            onClick={() => onClickDelete(department._id)}
                        >
                            <i className="fas fa-trash"></i>
                        </Button>
                    </React.Fragment>
                );
            },
        },
        {
            key: "department_code",
            text: "Department Code",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "department_name",
            text: "Department Name",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "campus_name",
            text: "Campus",
            className: "",
            align: "left",
            sortable: true,
        },
    ];

    const dtConfig = {
        key_column: "id",
        page_size: 10,
        length_menu: [10, 20, 50],
        button: {
            // print: true,
            extra: true,
        },
    };

    const dtExtraButtons = [
        {
            className: "btn btn-primary",
            title: "Print",
            children: [
                <span>
                    <i
                        className="glyphicon glyphicon-print fa fa-print"
                        aria-hidden="true"
                    ></i>
                </span>,
            ],
            onClick: () => {
                alert("Print Logic here");
            },
        },
        {
            className: "btn btn-warning",
            title: "Create New",
            children: [
                <span>
                    <i
                        className="glyphicon glyphicon-print fa fa-plus"
                        aria-hidden="true"
                    ></i>
                </span>,
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getCampus());
        dispatch(getDepartment());
    }, [dispatch]);

    const clearForm = () => {
        setDeptId("");
        setDeptCode("");
        setDeptName("");
        setCampusId("");
    };

    const toggleModal = () => {
        setModal(!modal);
        clearForm();
    };

    const showEditForm = (data) => {
        const { _id, department_code, department_name, campus_id } = data;

        toggleModal();

        setDeptId(_id);
        setDeptCode(department_code);
        setDeptName(department_name);
        setCampusId(campus_id);
    };

    const onSubmitForm = (e) => {
        e.preventDefault();

        const data = {
            department_id: deptId,
            department_code: deptCode,
            department_name: deptName,
            campus_id: campusId,
            campus_name: campusName
        };

        if (!deptId) {
            dispatch(createDepartment(data));
        } else {
            dispatch(updateDepartment(data));
        }

        toggleModal();
    };

    const onClickDelete = (department_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) 
            dispatch(deleteDepartment(department_id));
    };

    return (
        <React.Fragment>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Modal
                isOpen={modal}
                toggle={toggleModal}
                size="lg"
                className="modal-dialog"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={toggleModal}
                >
                    {!deptId ? "Add Department" : "Update Department"}
                </ModalHeader>
                <Form onSubmit={onSubmitForm}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Input
                                    type="hidden"
                                    name="department_id"
                                    id="department_id"
                                    value={deptId}
                                    onChange={(e) => {
                                        setDeptId(e.target.value);
                                    }}
                                    required
                                />
                                <Label for="">Department Code</Label>
                                <Input
                                    type="text"
                                    name="department_code"
                                    id="department_code"
                                    value={deptCode}
                                    onChange={(e) => {
                                        setDeptCode(e.target.value);
                                    }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="">Department Name</Label>
                                <Input
                                    type="text"
                                    name="department_name"
                                    id="department_name"
                                    value={deptName}
                                    onChange={(e) => {
                                        setDeptName(e.target.value);
                                    }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Address of the Campus">
                                    Campus
                                </Label>
                                <Input
                                    type="select"
                                    name="campus_id"
                                    id="campus_id"
                                    value={campusId}
                                    required
                                    onChange={(e) => {
                                        let index = e.nativeEvent.target.selectedIndex;
                                        let nameOfCampus = e.nativeEvent.target[index].text;
                                        
                                        setCampusId(e.target.value);
                                        setCampusName(nameOfCampus);
                                    }}
                                >
                                    {campus.length > 0
                                        ? campus.map((opt) => {
                                              return (
                                                  <option value={opt._id}>
                                                      {opt.campus_name}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </Input>
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary">
                            Save Changes
                        </Button>
                        <Button color="light" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Department
                        </h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="/">Settings</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-muted active"
                                        aria-current="page"
                                    >
                                        <a href="/campus">Department</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-5 align-self-center">
                        <div className="customize-input float-right">
                            <select className="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                <option>2019</option>
                                <option value={1}>2020</option>
                                <option value={2}>2021</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <Container fluid>
                <Card>
                    <CardBody>
                        <ReactDatatable
                            className="table"
                            tHeadClassName="thead-dark"
                            config={dtConfig}
                            records={department}
                            columns={dtColumns}
                            extraButtons={dtExtraButtons}
                        />
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Department;
