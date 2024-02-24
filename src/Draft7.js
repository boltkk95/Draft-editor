import React, { useState } from 'react';
import { Editor, EditorState, Modifier, SelectionState } from 'draft-js';
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
    if (textBeforeCursor.endsWith('\n*** ') || textBeforeCursor === '*** ') {
      // If the typed character is not a space, include it in the bold formatting
      if (chars !== ' ') {
        const boldSelection = selection.merge({
          anchorOffset: startOffset - 4, // Move the anchor to before the '**'
          focusOffset: startOffset + 1 // Include the next character in the selection
        });

        const contentStateWithBold = Modifier.applyInlineStyle(
          currentContent,
          boldSelection,
          'BOLD'
        );

        // Remove '*** ' after applying bold
        const contentStateWithoutTripleStar = Modifier.removeRange(
          contentStateWithBold,
          boldSelection.merge({
            anchorOffset: startOffset - 4,
            focusOffset: startOffset
          }),
          'backward'
        );

        const newEditorState = EditorState.push(
          editorState,
          contentStateWithoutTripleStar,
          'apply-inline-style'
        );

        onChange(newEditorState);
        return 'handled';
      }
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
