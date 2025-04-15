import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormComponent from "./Form";

describe("FormComponent", () => {

  it("renders form fields", () => {
    render(<FormComponent />);
    expect(screen.getByPlaceholderText(/How are you feeling\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Any additional comments\?/i)).toBeInTheDocument();
  });

  it("updates input values", () => {
    render(<FormComponent />);
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    const stressSelect = screen.getByTestId("stress-select");
    
    fireEvent.change(feelingInput, { target: { value: "test@example.com" } });
    fireEvent.change(commentInput, { target: { value: "Feeling good" } });
    fireEvent.change(stressSelect, { target: { value: "2" } });
    
    
    expect(feelingInput).toHaveValue("test@example.com");
    expect(commentInput).toHaveValue("Feeling good");
    expect(stressSelect).toHaveValue("2");
  });

  it("shows validation errors on submission with empty fields", async () => {
    render(<FormComponent />);
    const submitButton = screen.getByText(/Submit/i);
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Please enter how you're feeling./i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a stress level./i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your comments./i)).toBeInTheDocument();
  });

  it("shows validation error when a single field is empty", async () => {
    render(<FormComponent />);
    
    // Fill two fields but leave one empty
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    
    fireEvent.change(feelingInput, { target: { name: "feeling", value: "I'm good" } });
    fireEvent.change(commentInput, { target: { name: "comments", value: "Test comment" } });
    
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
    
    // Only stress level error should remain
    expect(screen.queryByText(/Please enter how you're feeling./i)).not.toBeInTheDocument();
    expect(screen.getByText(/Please select a stress level./i)).toBeInTheDocument();
    expect(screen.queryByText(/Please enter your comments./i)).not.toBeInTheDocument();
  });

  it("clears validation errors when fields are filled", async () => {
    render(<FormComponent />);
    const submitButton = screen.getByText(/Submit/i);
    
    // Submit with empty form to trigger errors
    fireEvent.click(submitButton);
    
    // Now fill the fields
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    
    fireEvent.change(feelingInput, { target: { name: "feeling", value: "I'm good" } });
    fireEvent.change(commentInput, { target: { name: "comments", value: "Test comment" } });
    
    // Select stress option
    const stressSelect = screen.getByTestId("stress-select");
    fireEvent.change(stressSelect, { target: { value: "3" } });
    
    // Check that errors are gone
    expect(screen.queryByText(/Please enter how you're feeling./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please select a stress level./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please enter your comments./i)).not.toBeInTheDocument();
  });

  it("submits the form successfully with complete data", async () => {
    // Mock the API call
    const mockSubmitForm = jest.fn().mockResolvedValue({ success: true });
    jest.mock("@/app/api/submitForm", () => ({
      submitForm: () => mockSubmitForm(),
    }));
    
    // Mock the alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<FormComponent />);
    
    // Fill all required fields
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    const stressSelect = screen.getByTestId("stress-select");
    
    fireEvent.change(feelingInput, { target: { name: "feeling", value: "Happy" } });
    fireEvent.change(commentInput, { target: { name: "comments", value: "Everything is good" } });
    fireEvent.change(stressSelect, { target: { value: "4" } });
    
    // Submit the form
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
    
    // Assert form submission
    expect(mockSubmitForm).toHaveBeenCalled();
    
    // Clean up
    mockAlert.mockRestore();
    jest.resetAllMocks();
  });

  it("handles API error during form submission", async () => {
    // Mock console.error
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the API call to fail
    const mockSubmitForm = jest.fn().mockRejectedValue(new Error("API Error"));
    jest.mock("@/app/api/submitForm", () => ({
      submitForm: () => mockSubmitForm(),
    }));
    
    render(<FormComponent />);
    
    // Fill all required fields
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    const stressSelect = screen.getByTestId("stress-select");
    
    fireEvent.change(feelingInput, { target: { name: "feeling", value: "Concerned" } });
    fireEvent.change(commentInput, { target: { name: "comments", value: "Some issues" } });
    fireEvent.change(stressSelect, { target: { value: "2" } });
    
    // Submit the form
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
    
    // Assert error was logged
    expect(mockConsoleError).toHaveBeenCalled();
    
    // Clean up
    mockConsoleError.mockRestore();
    jest.resetAllMocks();
  });
});
