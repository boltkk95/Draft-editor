import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';

function MyEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
    const startOffset = currentSelection.getStartOffset();
    const textBeforeCursor = currentBlock.getText().slice(0, startOffset);

    // Check if the typed character is a space and the character before it is a '#'
    if (chars === ' ' && currentBlock.getText().charAt(currentSelection.getStartOffset() - 1) === '*' && currentBlock.getText().charAt(currentSelection.getStartOffset() - 2) === '*') {
      const start = currentSelection.getStartOffset() - 2; // Start at the '#' position
      const end = currentSelection.getStartOffset(); // End at the space position
      const boldSelection = currentSelection.merge({ anchorOffset: start, focusOffset: end });

      const boldContent = Modifier.applyInlineStyle(currentContent, boldSelection, 'BOLD');

      const newState = EditorState.push(editorState, boldContent, 'insert-characters');
      setEditorState(EditorState.forceSelection(newState, boldSelection)); // Keep the selection
      return 'handled';
    }

    return 'not-handled';
};


  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
}

export default MyEditor;


