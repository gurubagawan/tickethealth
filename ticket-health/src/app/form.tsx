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
  };


  return (
    <form onSubmit={handleSubmit}>
      <Input
        size="lg"
        name="feeling"
        value={formData.feeling}
        onChange={handleChange}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />

      

      <Input
        size="lg"
        placeholder="comments"
        name="comments"
        value={formData.comments}
        onChange={handleChange}
      />

    <div className="w-72">

      <Select value={formData.stress} >
        {stressOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
        </div>


      <Button type="submit" className="mt-6" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default FormComponent;
