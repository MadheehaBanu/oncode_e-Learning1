import React, { useState } from "react";
import "./Inquire.css";
import { contactAPI } from "../services/api";

const Inquire = () => {
  const [formData, setFormData] = useState({
    trainingCenter: "",
    faculty: "",
    programme: "",
    title: "",
    fullName: "",
    designation: "",
    organization: "",
    nic: "",
    dob: "",
    homeAddress1: "",
    homeAddress2: "",
    city: "",
    stateProvince: "",
    email: "",
    phoneNumber: "",
    language: "",
    currentlyWorking: "",
    officeAddress1: "",
    officeAddress2: "",
    officeCity: "",
    officePhone: "",
    academicQualifications: "",
    professionalQualifications: "",
    sponsored: "",
    sponsorName: "",
    sponsorFoundNIBM: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to submit
    const submitData = {
      trainingCenter: formData.trainingCenter,
      faculty: formData.faculty,
      programme: formData.programme,
      title: formData.title,
      fullName: formData.fullName,
      designation: formData.designation,
      organization: formData.organization,
      nic: formData.nic,
      dob: formData.dob,
      homeAddress1: formData.homeAddress1,
      homeAddress2: formData.homeAddress2,
      city: formData.city,
      stateProvince: formData.stateProvince,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      language: formData.language,
      currentlyWorking: formData.currentlyWorking,
      officeAddress1: formData.officeAddress1,
      officeAddress2: formData.officeAddress2,
      officeCity: formData.officeCity,
      officePhone: formData.officePhone,
      academicQualifications: formData.academicQualifications,
      professionalQualifications: formData.professionalQualifications,
      sponsored: formData.sponsored,
      sponsorName: formData.sponsorName,
      sponsorFoundNIBM: formData.sponsorFoundNIBM,
    };

    try {
      await contactAPI.submitContact(submitData);
      setSubmitStatus("success");
      setFormData({
        trainingCenter: "",
        faculty: "",
        programme: "",
        title: "",
        fullName: "",
        designation: "",
        organization: "",
        nic: "",
        dob: "",
        homeAddress1: "",
        homeAddress2: "",
        city: "",
        stateProvince: "",
        email: "",
        phoneNumber: "",
        language: "",
        currentlyWorking: "",
        officeAddress1: "",
        officeAddress2: "",
        officeCity: "",
        officePhone: "",
        academicQualifications: "",
        professionalQualifications: "",
        sponsored: "",
        sponsorName: "",
        sponsorFoundNIBM: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="inquire-container">
      <h1>Application Form</h1>
      <p className="subtitle">
        Kindly complete the following application form and submit your details to proceed with the registration process.
        <br />
        Please note that your registration will be confirmed upon receipt of the first payment.
      </p>

      <form className="inquire-form" onSubmit={handleSubmit}>
        {/* Course Details */}
        <h2>Course Details</h2>

        <label>PREFERRED TRAINING CENTER *</label>
        <select
          name="trainingCenter"
          value={formData.trainingCenter}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option>Colombo</option>
          <option>Kandy</option>
          <option>Galle</option>
        </select>

        <label>PREFERRED FACULTY *</label>
        <select
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option>Business</option>
          <option>Computing</option>
          <option>Design</option>
          <option>Engineering</option>
        </select>

        <label>PROGRAMME YOU ARE LOOKING FOR *</label>
        <input
          type="text"
          name="programme"
          value={formData.programme}
          onChange={handleChange}
          required
        />

        {/* Personal Details */}
        <h2>Personal Details</h2>

        <label>TITLE *</label>
        <select
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option>Mr</option>
          <option>Ms</option>
          <option>Mrs</option>
          <option>Dr</option>
        </select>

        <label>FULL NAME IN BLOCK LETTERS *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>DESIGNATION</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />

        <label>ORGANIZATION</label>
        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
        />

        <label>NATIONAL IDENTITY CARD (NIC) NUMBER *</label>
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={handleChange}
          required
        />

        <label>DATE OF BIRTH *</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          placeholder="mm/dd/yyyy"
        />

        <label>HOME ADDRESS</label>
        <input
          type="text"
          name="homeAddress1"
          value={formData.homeAddress1}
          onChange={handleChange}
          placeholder="Street Address Line 1"
        />
        <input
          type="text"
          name="homeAddress2"
          value={formData.homeAddress2}
          onChange={handleChange}
          placeholder="Street Address Line 2"
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="stateProvince"
          value={formData.stateProvince}
          onChange={handleChange}
          placeholder="State / Province"
        />

        <label>EMAIL *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="ex:example@example.com"
        />

        <label>PHONE NUMBER *</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <label>PARTICIPANT FLUENT IN *</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option>English</option>
          <option>Tamil</option>
          <option>Sinhala</option>
        </select>

        <label>ARE YOU CURRENTLY WORKING? *</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="currentlyWorking"
              value="YES"
              checked={formData.currentlyWorking === "YES"}
              onChange={handleChange}
            />{" "}
            YES
          </label>
          <label>
            <input
              type="radio"
              name="currentlyWorking"
              value="NO"
              checked={formData.currentlyWorking === "NO"}
              onChange={handleChange}
            />{" "}
            NO
          </label>
        </div>

        {/* Office Details */}
        <h2>Office Details</h2>

        <label>OFFICE ADDRESS</label>
        <input
          type="text"
          name="officeAddress1"
          value={formData.officeAddress1}
          onChange={handleChange}
          placeholder="Street Address Line 1"
        />
        <input
          type="text"
          name="officeAddress2"
          value={formData.officeAddress2}
          onChange={handleChange}
          placeholder="Street Address Line 2"
        />
        <input
          type="text"
          name="officeCity"
          value={formData.officeCity}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="officePhone"
          value={formData.officePhone}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        {/* Pre-qualification */}
        <h2>Pre Qualifications</h2>

        <label>ACADEMIC QUALIFICATIONS</label>
        <textarea
          rows="3"
          name="academicQualifications"
          value={formData.academicQualifications}
          onChange={handleChange}
        ></textarea>

        <label>PROFESSIONAL QUALIFICATIONS</label>
        <textarea
          rows="3"
          name="professionalQualifications"
          value={formData.professionalQualifications}
          onChange={handleChange}
        ></textarea>

        {/* Sponsor Details */}
        <h2>Sponsor Details</h2>

        <label>ARE YOU SPONSORED? *</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sponsored"
              value="YES"
              checked={formData.sponsored === "YES"}
              onChange={handleChange}
            />{" "}
            YES
          </label>
          <label>
            <input
              type="radio"
              name="sponsored"
              value="NO"
              checked={formData.sponsored === "NO"}
              onChange={handleChange}
            />{" "}
            NO
          </label>
        </div>

        <label>SPONSOR'S NAME AND DESIGNATION *</label>
        <input
          type="text"
          name="sponsorName"
          value={formData.sponsorName}
          onChange={handleChange}
          required
        />

        <label>HOW DID YOU FOUND NIBM? *</label>
        <input
          type="text"
          name="sponsorFoundNIBM"
          value={formData.sponsorFoundNIBM}
          onChange={handleChange}
          required
        />

        <p className="terms">
          By clicking the Register button, you have agreed to abide by the Terms of Use. Please make sure you review the posted Terms of Use before registering.
        </p>

        <button type="submit" className="submit-btn">Register</button>
      </form>

      {submitStatus === "success" && (
        <p className="success-message">Your application has been submitted successfully.</p>
      )}
      {submitStatus === "error" && (
        <p className="error-message">There was an error submitting your application. Please try again.</p>
      )}
    </div>
  );
};

export default Inquire;
