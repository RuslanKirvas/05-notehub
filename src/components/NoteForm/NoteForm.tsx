import { useFormik } from "formik";
import * as Yup from "yup";

import type { CreateNoteData } from "../../services/noteService";
import css from "./NoteForm.module.css";

const noteTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

interface NoteFormProps {
  onSubmit: (data: CreateNoteData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(noteTags, "Please select a valid tag")
    .required("Tag is required"),
});

export const NoteForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NoteFormProps) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo" as const,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};
