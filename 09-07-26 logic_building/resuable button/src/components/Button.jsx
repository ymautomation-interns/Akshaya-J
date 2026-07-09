import "./Button.css";

function Button({ text, color }) {
  return (
    <button
      className="btn"
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
}

export default Button;