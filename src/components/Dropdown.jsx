import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the dropdown if the user clicks anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sagarx-dropdown" ref={ref}>
      <button
        type="button"
        className="sagarx-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        {value}
        <span className={`sagarx-caret ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="sagarx-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`sagarx-dropdown-option ${opt === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}