import React, { useState } from 'react';
import { Editor, EditorState, Modifier } from 'draft-js';

function MyEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());

    // Check if the typed character is a space and the character before it is a '#' or '*'
    if (chars === ' ') {
      const prevChar = currentBlock.getText().charAt(currentSelection.getStartOffset() - 1);
      if (prevChar === '#') {
        const start = currentSelection.getStartOffset() - 1; // Start after the '#'
        const end = currentSelection.getStartOffset(); // End at the space position
        const headingSelection = currentSelection.merge({ anchorOffset: start, focusOffset: end });

        const contentWithHeading = Modifier.setBlockType(currentContent, headingSelection, 'header-one');

        const newState = EditorState.push(editorState, contentWithHeading, 'insert-characters');
        setEditorState(EditorState.forceSelection(newState, headingSelection)); // Keep the selection
        return 'handled';
      } else if (prevChar === '*') {
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

      // Get the current selection
      const selectionState = editorState.getSelection();
      const currentContent = editorState.getCurrentContent();
      const currentBlockKey = selectionState.getStartKey();
      const currentBlock = currentContent.getBlockForKey(currentBlockKey);

      // Split the current block at the selection
      const contentStateWithSplitBlock = Modifier.splitBlock(currentContent, selectionState);

      // Create a new EditorState with the updated content
      let newEditorState = EditorState.push(editorState, contentStateWithSplitBlock, 'split-block');

      // Reset the inline styles for the new block
      const newSelection = newEditorState.getSelection();
      const newBlockKey = newSelection.getStartKey();
      const newBlock = newEditorState.getCurrentContent().getBlockForKey(newBlockKey);
      const resetStylesContent = Modifier.removeInlineStyle(contentStateWithSplitBlock, newSelection, ['BOLD', 'ITALIC', 'UNDERLINE']);

      // Set the block type of the new block to 'unstyled'
      const resetBlockTypeContent = Modifier.setBlockType(resetStylesContent, newSelection, 'unstyled');

      // Update the editor state with the reset styles for the new block
      newEditorState = EditorState.push(newEditorState, resetBlockTypeContent, 'reset-styles');

      // Move the cursor to the new block
      newEditorState = EditorState.forceSelection(newEditorState, newEditorState.getSelection().merge({
        anchorOffset: 0,
        focusOffset: 0,
        isBackward: false
      }));

      // Update the editor state
      setEditorState(newEditorState);

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
