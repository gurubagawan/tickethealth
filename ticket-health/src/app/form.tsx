"use client";
import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";

import { submitForm } from "@/app/api/submitForm";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    feeling: '',
    stress: '',
    comments: '',
  });

  const stressOptions = [
    { label: 'Very Stressed', value: '1' },
    { label: 'Stressed', value: '2' },
    { label: 'Neutral', value: '3' },
    { label: 'Relaxed', value: '4' },
    { label: 'Very Relaxed', value: '5'},
  ]

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    submitForm(formData)
      .then(response => {
        console.log('Form submitted successfully:', response);
        // Reset form or show success message
        setFormData({
          feeling: '',
          stress: '',
          comments: '',
        });
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        // Show error message
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
        className="bg-white text-black"
        labelProps={{
          className: "before:content-none after:content-none bg-white",
        }}
      />

      

      <Input
        size="lg"
        placeholder="comments"
        name="comments"
        value={formData.comments}
        onChange={handleChange}
        className="bg-white"

      />


      <Select className="bg-white" value={formData.stress} >
        {stressOptions.map((option) => (
          <Option className="bg-white" key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>


      <Button type="submit" className="mt-6" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default FormComponent;
