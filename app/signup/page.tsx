"use client";
// FIX: avatar not being saved in database
import { ChangeEvent, useEffect, useState } from "react";
import clsx from "clsx";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaSkype,
} from "react-icons/fa";
import { createUser } from "../serverActions";
import { useFormState } from "react-dom";
import Link from "next/link";
import  Image from "next/image";

const SignUp = () => {
  const [state, formAction] = useFormState(createUser, { message: "" });
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (state.message === "success") setStep(4);
  }, [state.message]);
  // Logic of first step of sign up
  const [inputValues, setInputValues] = useState({
    login: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    login: false,
    firstName: false,
    lastName: false,
    password: false,
    confirmPassword: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const handlePasswordFocus = (focused: boolean) => {
    setPasswordFocused(focused);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  useEffect(() => {
    setAllValid(allInputsValid());
  }, [inputValues]);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "login":
      case "firstName":
      case "lastName":
        return value.length > 0;
      case "password":
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(
          value
        );
      case "confirmPassword":
        return (
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(
            value
          ) && value === inputValues.password
        );
    }
  };
  const allInputsValid = () => {
    return Object.keys(inputValues).every((key) => {
      return validateInput(key, inputValues[key as keyof typeof inputValues]);
    });
  };

  // Logic of second step of sign up
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string>("");
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file)
    }
  };
  // Logic of third step of sign up
  const [socialMedias, setSocialMedias] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    skype: "",
  });
  const handleSocialMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialMedias({ ...socialMedias, [name]: value });
  };
  return (
    <div className="mx-auto rounded-lg overflow-hidden flex flex-col justify-center h-[100vh] px-5">
      <Image src="/logo.png" alt="logo" width={150} height={150} className="block mx-auto w-20 h-20" />
      <form className="mt-4" action={formAction}>
        <div className={clsx(step !== 1 && "hidden")}>
          <h1 className="font-bold text-2xl mb-2 text-center">Sign up</h1>
          {Object.keys(inputValues).map((key) => {
            const isValid = validateInput(
              key,
              inputValues[key as keyof typeof inputValues]
            );
            return (
              <label htmlFor={key} className="block mt-3" key={key}>
                <div className="flex items-center">
                  <input
                    type={
                      key.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                    id={key}
                    name={key}
                    value={inputValues[key as keyof typeof inputValues]}
                    onChange={handleInputChange}
                    onFocus={() =>
                      key === "password" && handlePasswordFocus(true)
                    }
                    onBlur={() =>
                      key === "password" && handlePasswordFocus(false)
                    }
                    className={clsx(
                      "input",
                      touched[key as keyof typeof touched] &&
                        (isValid ? "valid" : "invalid")
                    )}
                    placeholder={`${key.split(/(?=[A-Z])/).join(" ")} *`}
                  />
                  {touched[key as keyof typeof touched] &&
                    (isValid ? (
                      <IoMdCheckmarkCircleOutline className="ml-2 w-10 h-10 text-green-500" />
                    ) : (
                      <IoMdCloseCircleOutline className="ml-2 w-10 h-10 text-red-500" />
                    ))}
                </div>
                {key === "password" && passwordFocused && (
                  <p className="text-sm text-white w-[90%]">
                    Password must be at least 8 characters long, contain a
                    digit, an uppercase letter, a lowercase letter, and a
                    special character.
                  </p>
                )}
              </label>
            );
          })}
          <div className="mt-4">
            <button
              type="button"
              className="btn"
              onClick={() => setStep(2)}
              disabled={!allValid}
            >
              Continue
            </button>
            <p className="text-lg text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="font-bold hover:underline">Log in</Link>
              </p>
          </div>
        </div>
        <div className={clsx(step !== 2 && "hidden")}>
          <h1 className="font-bold text-2xl mb-2 text-center">
            Click to upload profile image
          </h1>
          {!avatar && (
            <IoCloudUploadOutline className="mx-auto w-[50vw] h-[50vh] text-gray-500"></IoCloudUploadOutline>
          )}
          <input
            type="file"
            onChange={handleAvatarChange}
            name="avatar"
            accept="image/*"
          />
          <input type="hidden" name="avatarBase64" value={avatarBase64} />
          {avatar && (
            <img
              src={URL.createObjectURL(avatar)}
              alt="avatar"
              className="mx-auto w-[90vw] h-[50vh] rounded-full"
            />
          )}
          <button type="button" className="btn mt-4" onClick={() => setStep(3)}>
            Continue
          </button>
        </div>
        <div className={clsx(step !== 3 && "hidden", "flex flex-col gap-5")}>
          <h1 className="font-bold text-2xl mb-2 text-center">
            Connect social medias
          </h1>
          <p className="text-gray-600 text-lg text-center">(Optional)</p>
          <div className="flex items-center">
            <FaFacebook className="w-10 h-10 text-blue-500 mr-2" />
            <input
              type="text"
              name="facebook"
              id="facebook"
              className="input mr-2"
              placeholder="Facebook profile URL"
              onChange={handleSocialMediaChange}
            />
          </div>
          <div className="flex items-center">
            <FaTwitter className="w-10 h-10 text-blue-500 mr-2" />
            <input
              type="text"
              name="twitter"
              id="twitter"
              className="input mr-2"
              placeholder="Twitter profile URL"
              onChange={handleSocialMediaChange}
            />
          </div>
          <div className="flex items-center">
            <FaInstagram className="w-10 h-10 text-pink-500 mr-2" />
            <input
              type="text"
              name="instagram"
              id="instagram"
              className="input mr-2"
              placeholder="Instagram profile URL"
              onChange={handleSocialMediaChange}
            />
          </div>
          <div className="flex items-center">
            <FaLinkedin className="w-10 h-10 text-blue-500 mr-2" />
            <input
              type="text"
              name="linkedin"
              id="linkedin"
              className="input mr-2"
              placeholder="LinkedIn profile URL"
              onChange={handleSocialMediaChange}
            />
          </div>
          <div className="flex items-center">
            <FaSkype className="w-10 h-10 text-blue-500 mr-2" />
            <input
              type="text"
              name="skype"
              id="skype"
              className="input mr-2"
              placeholder="Skype profile URL"
              onChange={handleSocialMediaChange}
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="btn">
              Create account
            </button>
          </div>
        </div>
      </form>
      <div className={clsx(step !== 4 && "hidden")}>
        <IoMdCheckmarkCircleOutline className="mx-auto w-20 h-20 text-green-500" />
        <h1 className="font-bold text-2xl mb-2 text-center">
          Account created successfully!
        </h1>
        <p className="text-gray-600 text-lg text-center">
          You can now log in with your credentials.
        </p>
        <Link href='/login' className="btn text-center">Log in</Link>
      </div>
    </div>
  );
};

export default SignUp;
