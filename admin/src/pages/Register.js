import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { hideLoading, Rotating, showLoading } from "../components/Spinner";
import breadcrup from "../assets/img/breadcrumb-bg.jpg";
import loginImg from "../assets/img/jimLogin.jpg";
import { App_host } from "../utils/hostData";
import { useNavigate } from "react-router-dom";

const RegisterGymSchema = Yup.object().shape({
  full_name: Yup.string().required("Full Name is required !"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required !"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters !")
    .required("Password is required !"),
  gymName: Yup.string().required("Gym Name is required !"),
  gymAddress: Yup.string().required("Gym Address is required !"),
  phone: Yup.string().matches(/^\d+$/, "Invalid phone number !"),
  city: Yup.string().required("City is required !"),
  description: Yup.string(),
  images: Yup.array(),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showImages, setShowImages] = useState([]);
  const inputRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };
  const HandleselectImage = () => {
    inputRef.current.click();
  };

  const navigate = useNavigate();
  const handleSubmit = async (values, formikBag) => {
    try {
      console.log(
        "a gaya aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        formikBag
      );

      const formValues = await RegisterGymSchema.validate(values, {
        abortEarly: false,
      });
      formValues.status = "pending";
      const formData = new FormData();

      // Append non-file fields
      Object.entries(formValues).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
        console.log("key ::", formData[key]);
      });

      // Append all images under the same key 'images'
      if (formValues.images && formValues.images.length > 0) {
        formValues.images.forEach((image) => {
          formData.append("images", image);
        });
      }
      console.log("-------------------------------", [...formData]);
      const response = await axios.post(`${App_host}/Jim/addJim`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        toast.success("Gym registered successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error("An Error Occured ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      formikBag?.resetForm();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("error.response.data.message", error);
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      hideLoading();
      formikBag?.setSubmitting(false);
    }
  };

  return (
    <>
      <section
        className="breadcrumb-section set-bg"
        style={{
          backgroundImage: `url(${breadcrup})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        data-setbg="img/breadcrumb-bg.jpg"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb-text">
                <h2>Register As Gym</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="contact-section spad"
        style={{ backgroundColor: "#151515" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title contact-title d-none d-lg-block">
                <img
                  src={loginImg}
                  className="img-fluid"
                  style={{ width: "100%", maxWidth: "500px", height: "700px" }}
                  alt="Preview"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="leave-comment">
                <Formik
                  initialValues={{
                    full_name: "",
                    email: "",
                    password: "",
                    gymName: "",
                    gymAddress: "",
                    phone: "",
                    city: "",
                    description: "",
                    images: [],
                  }}
                  validationSchema={RegisterGymSchema}
                  onSubmit={handleSubmit}
                  validateOnBlur={true}
                  validateOnChange={true}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="register-form">
                      <ErrorMessage
                        name="full_name"
                        component="span"
                        className="error"
                      />
                      <Field
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                      />

                      <ErrorMessage
                        name="email"
                        component="span"
                        className="error"
                      />
                      <Field type="text" name="email" placeholder="Email" />

                      <ErrorMessage
                        name="password"
                        component="span"
                        className="error"
                      />
                      <div style={{ position: "relative" }}>
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                        />
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>

                      <ErrorMessage
                        name="gymName"
                        component="span"
                        className="error"
                      />
                      <Field
                        type="text"
                        name="gymName"
                        placeholder="Gym Name"
                      />

                      <ErrorMessage
                        name="gymAddress"
                        component="span"
                        className="error"
                      />
                      <Field
                        type="text"
                        name="gymAddress"
                        placeholder="Gym Address"
                      />

                      <ErrorMessage
                        name="phone"
                        component="span"
                        className="error"
                      />
                      <Field
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        maxLength={13}
                      />

                      <ErrorMessage
                        name="city"
                        component="span"
                        className="error"
                      />
                      <Field type="text" name="city" placeholder="City" />

                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Description"
                      />
                      {/* <div className='w-100 h-20 my-2' onClick={HandleselectImage} style={{color:'white'}}>

                                            <FontAwesomeIcon icon={faUpload} style={{color:'white',fontSize:"30px"}} /> Upload Images

                                                <input
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    ref={inputRef}
                                                    onChange={(event) => {
                                                      setShowImages=event.target.files
                                                    }}
                                                    accept="image/*"
                                                    style={{
                                                        display: "none"
                                                    }}
                                                />
                                            </div> */}
                      <ErrorMessage
                        name="images"
                        component="span"
                        className="error"
                      />
                      <input
                        type="file"
                        name="images"
                        multiple
                        onChange={(event) => {
                          const files = Array.from(event.currentTarget.files);
                          setFieldValue("images", files);
                        }}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                      <div
                        className="custom-file-upload"
                        onClick={handleFileUploadClick}
                        style={{
                          cursor: "pointer",
                          padding: "10px",
                          border: "2px dashed #fff",
                          display: "inline-block",
                          color: "white",
                          textAlign: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faUpload}
                          style={{ color: "white", fontSize: "30px" }}
                        />{" "}
                        Upload Images
                      </div>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "submitting ...." : "Submit"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Register;
