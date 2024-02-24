import React, { useState } from 'react';
import { Editor, EditorState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const currentBlock = currentContent.getBlockForKey(startKey);
    const startOffset = selection.getStartOffset();
    const textBeforeCursor = currentBlock.getText().slice(0, startOffset);

    // Check if '*** ' is at the start of the line
    if ((textBeforeCursor.endsWith('\n*** ') || textBeforeCursor === '*** ') && startOffset >= 4) {
        const contentStateWithUnderline = Modifier.applyInlineStyle(
          currentContent,
          selection.merge({
            anchorOffset: startOffset - 4, // Move the anchor to before the '**'
            focusOffset: startOffset // Keep the focus where it was
          }),
          'BOLD'
        );
      
        const newEditorState = EditorState.push(
          editorState,
          contentStateWithUnderline,
          'apply-inline-style'
        );
      
        onChange(newEditorState);
        return 'handled';
      }
      
      return 'not-handled';
      
  };

  return (
    <div>
      <h2>My Draft.js Editor</h2>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
};

export default MyEditor;
