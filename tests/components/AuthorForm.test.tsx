import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import AuthorForm from "@/components/AuthorForm";

describe("AuthorForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create mode", () => {
    it("renders empty form for new author", () => {
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue("");
      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/affiliation/i)).toHaveValue("");
      expect(screen.getByLabelText(/orcid/i)).toHaveValue("");
      expect(
        screen.getByRole("button", { name: /create author/i })
      ).toBeInTheDocument();
    });

    it("displays correct heading for new author", () => {
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(
        screen.getByRole("heading", { name: /add new author/i })
      ).toBeInTheDocument();
    });

    it("calls onSubmit with form data when submitted", async () => {
      const user = userEvent.setup();
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/name/i), "Test Author");
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/affiliation/i), "Test University");
      await user.type(screen.getByLabelText(/orcid/i), "0000-0001-2345-6789");

      const submitButton = screen.getByRole("button", {
        name: /create author/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test Author",
        email: "test@example.com",
        affiliation: "Test University",
        orcId: "0000-0001-2345-6789",
      });
    });

    it("calls onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("requires name field", async () => {
      const user = userEvent.setup();
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      // Try to submit without filling name
      const submitButton = screen.getByRole("button", {
        name: /create author/i,
      });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("allows submission with only required fields", async () => {
      const user = userEvent.setup();
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/name/i), "Test Author");

      const submitButton = screen.getByRole("button", {
        name: /create author/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test Author",
        email: "",
        affiliation: "",
        orcId: "",
      });
    });
  });

  describe("Edit mode", () => {
    const existingAuthor = {
      name: "Existing Author",
      email: "existing@example.com",
      affiliation: "Existing University",
      orcId: "0000-0001-2345-6789",
    };

    it("renders form with existing author data", () => {
      render(
        <AuthorForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={existingAuthor}
        />
      );

      expect(screen.getByLabelText(/name/i)).toHaveValue("Existing Author");
      expect(screen.getByLabelText(/email/i)).toHaveValue(
        "existing@example.com"
      );
      expect(screen.getByLabelText(/affiliation/i)).toHaveValue(
        "Existing University"
      );
      expect(screen.getByLabelText(/orcid/i)).toHaveValue("0000-0001-2345-6789");
    });

    it("displays correct heading for editing", () => {
      render(
        <AuthorForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={existingAuthor}
        />
      );

      expect(
        screen.getByRole("heading", { name: /edit author/i })
      ).toBeInTheDocument();
    });

    it("shows update button instead of create", () => {
      render(
        <AuthorForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={existingAuthor}
        />
      );

      expect(
        screen.getByRole("button", { name: /update author/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /create author/i })
      ).not.toBeInTheDocument();
    });

    it("calls onSubmit with updated data", async () => {
      const user = userEvent.setup();
      render(
        <AuthorForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={existingAuthor}
        />
      );

      await user.clear(screen.getByLabelText(/name/i));
      await user.type(screen.getByLabelText(/name/i), "Updated Author");

      const submitButton = screen.getByRole("button", {
        name: /update author/i,
      });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Updated Author",
        email: "existing@example.com",
        affiliation: "Existing University",
        orcId: "0000-0001-2345-6789",
      });
    });
  });

  describe("Form interactions", () => {
    it("updates form state as user types", async () => {
      const user = userEvent.setup();
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "John Doe");

      expect(nameInput).toHaveValue("John Doe");
    });

    it("renders ORCID help text", () => {
      render(<AuthorForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(
        screen.getByText(/open researcher and contributor id/i)
      ).toBeInTheDocument();
    });
  });
});
