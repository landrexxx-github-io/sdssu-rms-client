import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { changePassword } from "../../../redux/actions/auth_action";

import {
    Container,
    Button,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
} from "reactstrap";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = yup.object().shape({
    old_password: yup.string().required("Old password field is required."),
    new_password: yup.string().required("New password field is required."),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password"), null])
        .required("Confirm password field is required."),
});

const ChangePassword = ({ currentUser }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(formSchema),
    });

    const onSubmit = (data) => {
        const isConfirm = window.confirm(
            "Are you sure that you want to change your password?"
        );

        if (isConfirm) {
            dispatch(changePassword(data));
        } else {
            reset({});
        }
    };

    console.log("Current user: ", currentUser);

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

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Change Password
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
                                        <a href="/change-password">
                                            Change Password
                                        </a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <Container fluid>
                <Card>
                    <CardBody>
                        <Row className="pt-4 pb-4">
                            <Col md="5" className="ml-4">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <FormGroup>
                                        <Label>
                                            Old Password{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="hidden"
                                            name="username"
                                            value={
                                                !currentUser
                                                    ? ""
                                                    : currentUser.username
                                            }
                                            {...register("username")}
                                        ></input>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="old_password"
                                            {...register("old_password")}
                                        ></input>
                                        <small className="text-danger">
                                            {errors.old_password?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            New Password{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="new_password"
                                            {...register("new_password")}
                                        ></input>
                                        <small className="text-danger">
                                            {errors.new_password?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            Confirm Password{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="confirm_password"
                                            {...register("confirm_password")}
                                        ></input>
                                        <small className="text-danger">
                                            {errors.confirm_password?.message &&
                                                "Passwords did not match."}
                                        </small>
                                    </FormGroup>
                                    <Button
                                        type="submit"
                                        className="btn btn-purple mt-3"
                                        style={{ float: "right" }}
                                    >
                                        Save Changes
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default ChangePassword;
