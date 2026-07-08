import React, { useRef } from "react";
import "./RichTextEditor.css";

function RichTextEditor() {
  const editorRef = useRef();

  const format = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  return (
    <div className="editor-container">

      <div className="toolbar">
        <button onClick={() => format("bold")}>
          <b>B</b>
        </button>

        <button onClick={() => format("italic")}>
          <i>I</i>
        </button>

        <button onClick={() => format("underline")}>
          <u>U</u>
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable
        suppressContentEditableWarning={true}
      ></div>

    </div>
  );
}

export default RichTextEditor;