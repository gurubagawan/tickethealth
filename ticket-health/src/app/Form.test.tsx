import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import FormComponent from "./Form";

jest.mock("@/app/api/submitForm", () => ({
  submitForm: jest.fn(),
}));

const { submitForm } = require("@/app/api/submitForm");

describe("Form Tests", () => {
  beforeEach(() => {
    render(<FormComponent />);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Submission saved" }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders form fields", () => {
    expect(screen.getByPlaceholderText(/How are you feeling\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Any additional comments\?/i)).toBeInTheDocument();
  });

  it("updates input values", () => {
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

  it("shows validation errors on submission with empty fields", () => {
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Please enter your email./i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter how you're feeling./i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a stress level./i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your comments./i)).toBeInTheDocument();
  });

  it("shows validation error when a single field is empty", () => {
    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");

    fireEvent.change(feelingInput, { target: { value: "I'm good" } });
    fireEvent.change(commentInput, { target: { value: "Test comment" } });

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);


    expect(screen.queryByText(/Please enter how you're feeling./i)).not.toBeInTheDocument();
    expect(screen.getByText(/Please select a stress level./i)).toBeInTheDocument();
    expect(screen.queryByText(/Please enter your comments./i)).not.toBeInTheDocument();
  });

  it("clears validation errors when fields are filled", async () => {
    const user = userEvent.setup();

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    const stressSelect = screen.getByTestId("stress-select");
    const emailInput = screen.getByTestId("email-input");

    fireEvent.change(emailInput, {target: {value: "guru@email.com"}})
    fireEvent.change(feelingInput, { target: { value: "I'm good" } });
    fireEvent.change(commentInput, { target: { value: "Test comment" } });
    await user.click(stressSelect);
    await user.click(screen.getByText("Very Stressed"));

    expect(screen.queryByText(/Please enter your email./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please enter how you're feeling./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please select a stress level./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please enter your comments./i)).not.toBeInTheDocument();
  });

  it("submits the form successfully with complete data", async () => {
    const user = userEvent.setup();
    submitForm.mockResolvedValue({ success: true });

    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    const feelingInput = screen.getByTestId("feeling-input");
    const commentInput = screen.getByTestId("comments-input");
    const stressSelect = screen.getByTestId("stress-select");
    const emailInput = screen.getByTestId("email-input");

    fireEvent.change(emailInput, {target: {value: "guru@email.com"}})
    fireEvent.change(feelingInput, { target: { value: "Happy" } });
    fireEvent.change(commentInput, { target: { value: "Everything is good" } });
    await user.click(stressSelect);
    await user.click(screen.getByText("Very Stressed"));

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitForm).toHaveBeenCalled();
    });

    expect(mockAlert).toHaveBeenCalledWith("Form submitted successfully!");
    mockAlert.mockRestore();
  });
});
