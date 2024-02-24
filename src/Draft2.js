import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // const handleKeyCommand = (command, editorState) => {
  //   if (command === 'toggle-bold') {
  //     handleChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // };

  // const mapKeyToEditorCommand = (e) => {
  //   if (e.keyCode === 32  && e.target.textContent.trim() === '#') {
  //     return 'toggle-bold';
  //   }
  //   return getDefaultKeyBinding(e);
  // };

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = block.getText();
    const trimmedBlockText = blockText.trim();

    if (trimmedBlockText === '#' && chars === ' ') {
      const newContentState = currentContent.merge({
        blockMap: currentContent.getBlockMap().set(block.getKey(), block.merge({ text: '' })),
      });
      const newEditorState = EditorState.push(editorState, newContentState, 'remove-text');
      handleChange(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
      return 'handled';
    }

    return 'not-handled';
  };

  return (
    <div>
      <div>
        <h3>Instructions:</h3>
        <p>Type "#" at the beginning of a line and press space to make the text bold.</p>
      </div>
      <div style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }}>
        <Editor
          editorState={editorState}
          onChange={handleChange}
          // handleKeyCommand={handleKeyCommand}
          // keyBindingFn={mapKeyToEditorCommand}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
    </div>
  );
};

export default MyEditor;
