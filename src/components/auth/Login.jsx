import React, { useState, useEffect, useContext, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import axios from "axios";
import AccountContext from "../../context/AccountContext";

import "./login.css";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import SDSSULOGO from "../../images/sdssu-logo.webp";
import COVERPHOTO from "../../images/research-collaboration.svg";

import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Container,
    Row,
    Col,
    Card,
} from "reactstrap";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const { setUserData } = useContext(AccountContext);
    const history = useHistory();

    const onSubmitFormLogin = async (e) => {
        e.preventDefault();

        const loginResponse = await axios.post(
            "https://sdssu-rms.herokuapp.com/login",
            { username, password }
        );

        const { success, token, user, message } = loginResponse.data;

        if (success) {
            setUserData({ token, user });
            localStorage.setItem("auth-token", `Bearer ${token}`);

            history.push("/dashboard");
        } else {
            toast.error(message);
        }
    };

    return (
        <Fragment>
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

            <Container>
                <Row
                    style={{
                        position: "relative",
                        height: "100%",
                        margin: "0 auto",
                    }}
                >
                    <Col md="7">
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                top: "20%",
                                bottom: "30%",
                                height: "20%",
                            }}
                        >
                            <h1 className="title text-primary font-weight-bold">
                                SURIGAO DEL SUR STATE UNIVERSITY{" "}
                            </h1>
                            <h2 className="">Research Management System</h2>
                            <img
                                style={{
                                    position: "fixed",
                                    zIndex: "0",
                                }}
                                className="d-block mx-auto"
                                src={COVERPHOTO}
                                alt=""
                                width="500"
                            />
                        </div>
                    </Col>
                    <Col md="5">
                        <Card
                            className="pt-3 pr-3 pl-3 pb-5"
                            style={{
                                position: "relative",
                                width: "400px",
                                // top: "20%",
                                margin: "150px 0",
                                borderRadius: "8px",
                                boxShadow:
                                    "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
                            }}
                        >
                            <img
                                style={{
                                    padding: "0",
                                    margin: "0",
                                    height: "120px",
                                    width: "120px",
                                    position: "relative",
                                    top: "-70px",
                                    left: "120px",
                                    bottom: "-30px",
                                }}
                                src={SDSSULOGO}
                                alt="sdssu-logo"
                            />
                            <Form
                                style={{ marginTop: "-40px" }}
                                onSubmit={onSubmitFormLogin}
                            >
                                <FormGroup>
                                    <Input
                                        style={{
                                            borderRadius: "6px",
                                            border: "1px solid #dddfe2",
                                        }}
                                        className="pt-4 pb-4"
                                        autoComplete="false"
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={username}
                                        onChange={(e) => {
                                            setUserName(e.target.value);
                                        }}
                                        placeholder="Username"
                                        required
                                    />
                                    {/* <small className="text-danger">Username field is required</small> */}
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        style={{
                                            borderRadius: "6px",
                                            border: "1px solid #dddfe2",
                                        }}
                                        className="pt-4 pb-4"
                                        autoComplete="false"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                        placeholder="Password"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup check>
                                    <Label check className="">
                                        <Input
                                            type="checkbox"
                                            onChange={() => {
                                                setShowPassword(!showPassword);
                                            }}
                                        />{" "}
                                        Show password
                                    </Label>
                                </FormGroup>
                                <FormGroup>
                                    <button
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "6px",
                                            width: "100%",
                                            fontSize: "20px",
                                        }}
                                        type="submit"
                                        className="btn btn-primary mt-3"
                                    >
                                        Log In
                                    </button>
                                </FormGroup>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default Login;
