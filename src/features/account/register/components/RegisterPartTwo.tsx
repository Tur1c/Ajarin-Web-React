import { useState } from "react";
import axios from "../../../../api/axios";
import "./RegisterPartTwo.css";

const REGISTER_URL = "/api/account/register";

function RegisterPartTwo(props: any) {
  const [accountRegister, setAccountRegister] = useState({ ...props.data });
  const [age, setAge] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedEdu, setSelectedEdu] = useState<string>("");

  const [errorAge, setErrorAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  interface genderOption {
    gender: string;
    label: string;
  }

  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const genderOptions: genderOption[] = [
    { gender: "Male", label: "Male" },
    { gender: "Female", label: "Female" },
  ];

  const eduOptions: eduOption[] = [
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];

  const validateNumber = (
    value: string,
    minLength: number,
    maxLength: number
  ): boolean => {
    const length = value.trim().length;
    return (
      length >= minLength && (maxLength === undefined || length <= maxLength)
    );
  };

  const validateAge = (value: number): boolean => {
    const parsedValue = value;
    return parsedValue >= 5 && parsedValue <= 100;
  };

  const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(event.target.valueAsNumber);
    setAccountRegister({ ...accountRegister, age: event.target.value });
    setErrorAge("");
  };

  const handleChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value);
    setAccountRegister({ ...accountRegister, gender: event.target.value });
  };

  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
    setAccountRegister({ ...accountRegister, phoneNumber: event.target.value });
    setErrorMessage("");
  };

  const handleChangeEdu = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAccountRegister({ ...accountRegister, eduOptions: event.target.value });
  };

  const handleBlurAge = () => {
    if (!validateAge(age)) {
      setErrorAge("Please enter a valid age.");
    }
  };

  const handleBlurNumber = () => {
    if (!validateNumber(phoneNumber, 10, 13)) {
      // Adjust min and max length as needed
      setErrorMessage("Please enter a valid phone number.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(accountRegister),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if ((response.data.errorSchema.message = "Sukses")) {
        props.callBack(response.data.errorSchema.message);
      }
    } catch (err) {
      // if (!err?.response) {
      //   console.log("No Server Response");

      // }
      console.log(err);
    }
  };

  return (
    <div className="wrapper-part2 d-flex">
      <div className="flex-fill w-100">
        <form onSubmit={handleSubmit}>
          <h1 className="text fw-bold">One More Step.</h1>
          <div className="text register-link">
            Before you’ll start learning, let us to know about you first
          </div>

          <div className="inputs2">
            <div className="left-input">
              <div className="age-gen">
                <div className="input-box w-100">
                  <input
                    type="number"
                    required
                    style={{ width: "100%" }}
                    id="age"
                    onChange={handleChangeAge}
                    onBlur={handleBlurAge}
                  />
                  <label>Age</label>
                  <p className="alert mt-2">{errorAge}</p>
                  {/* <p>{validateAge(10)}</p> */}
                </div>
                <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                  <select
                    id="gender"
                    value={selectedGender}
                    onChange={handleChangeGender}
                  >
                    {genderOptions.map((option) => (
                      <option key={option.gender} value={option.gender}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label className="special-case">Gender</label>
                </div>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  id="phoneNumber"
                  onChange={handleChangeNumber}
                  onBlur={handleBlurNumber}
                />
                <label>Phone Number</label>
                <p className="alert mt-2">{errorMessage}</p>
              </div>
              <div className="input-box">
                <select
                  id="gender"
                  value={selectedEdu}
                  onChange={handleChangeEdu}
                >
                  {eduOptions.map((option) => (
                    <option key={option.eduLevel} value={option.eduLevel}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="special-case">Education Level</label>
              </div>
            </div>
            <div className="right-input">
              <div className="input-box">
                <input
                  type="text"
                  required
                  id="city"
                  onChange={(e) =>
                    setAccountRegister({
                      ...accountRegister,
                      city: e.target.value,
                    })
                  }
                />
                <label>City</label>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  required
                  id="country"
                  onChange={(e) =>
                    setAccountRegister({
                      ...accountRegister,
                      country: e.target.value,
                    })
                  }
                />
                <label>Country</label>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  required
                  id="school"
                  onChange={(e) =>
                    setAccountRegister({
                      ...accountRegister,
                      school: e.target.value,
                    })
                  }
                />
                <label>School / Works at</label>
              </div>
            </div>
          </div>

          <div className="create-btn d-flex justify-content-between align-items-center">
            <button type="submit" className="fw-bold">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPartTwo;
