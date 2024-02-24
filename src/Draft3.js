import React, { useState } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';

function MyEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());

    // Check if the typed character is a space and the character before it is a '#' or '*'
    if (chars === ' ') {
      const prevChar = currentBlock.getText().charAt(currentSelection.getStartOffset() - 1);
      // if (prevChar === '#') {
      //   const start = currentSelection.getStartOffset() - 1; // Start after the '#'
      //   const end = currentSelection.getStartOffset(); // End at the space position
      //   const headingSelection = currentSelection.merge({ anchorOffset: start, focusOffset: end });

      //   const contentWithHeading = Modifier.setBlockType(currentContent, headingSelection, 'header-one');

      //   const newState = EditorState.push(editorState, contentWithHeading, 'insert-characters');
      //   setEditorState(EditorState.forceSelection(newState, headingSelection)); // Keep the selection
      //   return 'handled';}
       if (prevChar === '*') {
        const start = currentSelection.getStartOffset() - 1; // Start at the '*' position
        const end = currentSelection.getStartOffset(); // End at the space position
        const boldSelection = currentSelection.merge({ anchorOffset: start, focusOffset: end });

        const boldContent = Modifier.applyInlineStyle(currentContent, boldSelection, 'BOLD');

        const newState = EditorState.push(editorState, boldContent, 'insert-characters');
        setEditorState(EditorState.forceSelection(newState, boldSelection)); // Keep the selection
        return 'handled';
      }
    }

    return 'not-handled';
  };

  const handleReturn = (e) => {
    // Check if Enter key is pressed
    if (e.key === 'Enter') {
      // Prevent the default behavior of creating a new line
      e.preventDefault();

      // Reset all inline styles
      const selectionState = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const withoutStyles = Modifier.removeInlineStyle(contentState, selectionState, ['BOLD', 'ITALIC', 'UNDERLINE']);

      // Insert a soft newline character
      const contentStateWithNewline = Modifier.insertText(
        withoutStyles,
        withoutStyles.getSelectionAfter(),
        '\n'
      );

      // Create a new EditorState with the updated content
      const newEditorState = EditorState.push(editorState, contentStateWithNewline, 'insert-characters');

      // Update the editor state
      setEditorState(RichUtils.insertSoftNewline(newEditorState));

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
        handleReturn={handleReturn}
      />
    </div>
  );
}

export default MyEditor;
