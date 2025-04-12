import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "./Form";

describe("MyForm", () => {
  it("renders form fields", () => {
    render(<Form />);
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/comments/i)).toBeInTheDocument();
  });

  it("updates input values", () => {
    render(<Form />);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const commentInput = screen.getByPlaceholderText(/comments/i);


    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(commentInput, { target: { value: "Feeling good" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(commentInput.value).toBe("Feeling good");
  });

  it("submits the form", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Submission saved" }),
      })
    );

    render(<Form />);

    fireEvent.change(screen.getByPlaceholderText(/your email/i), {
      target: { value: "submit@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/comments/i), {
      target: { value: "test comment" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });
});

