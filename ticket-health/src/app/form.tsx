"use client";
import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { submitForm } from "@/app/api/submitForm";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    feeling: "",
    stress: "",
    comments: "",
  });

  const [errors, setErrors] = useState<{
    feeling?: string;
    stress?: string;
    comments?: string;
  }>({});

  const [touched, setTouched] = useState<{
    feeling?: boolean;
    stress?: boolean;
    comments?: boolean;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const stressOptions = [
    { label: "Very Stressed", value: "1" },
    { label: "Stressed", value: "2" },
    { label: "Neutral", value: "3" },
    { label: "Relaxed", value: "4" },
    { label: "Very Relaxed", value: "5" },
  ];

  const validate = (data = formData) => {
    const newErrors: typeof errors = {};

    if (!data.feeling.trim())
      newErrors.feeling = "Please enter how you're feeling.";
    if (!data.stress.trim())
      newErrors.stress = "Please select a stress level.";
    if (!data.comments.trim())
      newErrors.comments = "Please enter your comments.";

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };

    setFormData(newData);

    // If touched or submitted, validate live
    if ((touched[name as keyof typeof touched] || isSubmitted) && !validate(newData)[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validate(formData)[name as keyof typeof errors];
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleSelectChange = (value: string) => {
    const newData = { ...formData, stress: value };
    setFormData(newData);

    if ((touched.stress || isSubmitted) && !validate(newData).stress) {
      setErrors((prev) => ({ ...prev, stress: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit logic
    submitForm(formData)
      .then((res) => {
        console.log("Submitted:", res);
        setFormData({ feeling: "", stress: "", comments: "" });
        setErrors({});
        setTouched({});
        setIsSubmitted(false);
      })
      .catch((err) => {
        console.error("Submission failed:", err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        size="lg"
        name="feeling"
        placeholder="How are you feeling?"
        value={formData.feeling}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.feeling}
        className="bg-white text-black w-full p-2 mb-2"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      {errors.feeling && (
        <p className="text-red-500 text-sm mb-2">{errors.feeling}</p>
      )}

      <Textarea
        name="comments"
        placeholder="Any additional comments?"
        value={formData.comments}
        onChange={handleChange}
        onBlur={handleBlur}
        className="bg-white text-black w-full p-2 mt-2 rounded-md"
        error={!!errors.comments}
      />
      {errors.comments && (
        <p className="text-red-500 text-sm mb-2">{errors.comments}</p>
      )}

      <Select
        variant="outlined"
        label="Stress level"
        value={formData.stress}
        onChange={handleSelectChange}
        onBlur={() =>
          setTouched((prev) => ({ ...prev, stress: true }))
        }
        className="bg-white text-black mt-2 custom-select rounded-md p-2 flex"
        error={!!errors.stress}
      >
        {stressOptions.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            className="bg-white text-black p-2 hover:bg-gray-200"
          >
            {option.label}
          </Option>
        ))}
      </Select>
      {errors.stress && (
        <p className="text-red-500 text-sm mb-4">{errors.stress}</p>
      )}

      <Button
        type="submit"
        color="blue"
        className="mt-4"
        variant="filled"
      >
        Submit
      </Button>
    </form>
  );
};

export default FormComponent;
