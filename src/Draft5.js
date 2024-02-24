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
    if (textBeforeCursor.endsWith('\n* ') || textBeforeCursor === '* ') {
      const modifiedContentState = Modifier.applyInlineStyle(
        currentContent,
        selection.merge({
          anchorOffset: startOffset - 2, // Move the anchor to before the '**'
          focusOffset: startOffset  // Keep the focus where it was
        }),
        'BOLD'
      );
      const newEditorState = EditorState.push(
        editorState,
        modifiedContentState,
        'apply-inline-style'
      );

      onChange(newEditorState);
      return 'handled';
    } 
    else if (textBeforeCursor.endsWith('\n# ') || textBeforeCursor === '# ') {
        const modifiedContentState = Modifier.setBlockType(
          currentContent,
          selection.merge({
            anchorOffset: startOffset - 2, // Move the anchor to before the '**'
            focusOffset: startOffset // Keep the focus where it was
          }),
          'header-one'
        );
        const newEditorState = EditorState.push(
          editorState,
          modifiedContentState,
          'apply-inline-style'
        );
  
        onChange(newEditorState);
        return 'handled';
      } 
     else if (textBeforeCursor.endsWith('\n***') || textBeforeCursor === '*** ') {
        const modifiedContentState = Modifier.applyInlineStyle(
          currentContent,
          selection.merge({
            anchorOffset: startOffset - 4, // Move the anchor to before the '**'
            focusOffset: startOffset // Keep the focus where it was
          }),
          'UNDERLINE'
        );
        const newEditorState = EditorState.push(
          editorState,
          modifiedContentState,
          'apply-inline-style'
        );
  
        onChange(newEditorState);
        return 'handled';
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
      <h2>My Draft.js Editor</h2>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        handleReturn={handleReturn}
      />
    </div>
  );
};

export default MyEditor;
