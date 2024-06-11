export const RichTextEditorDefaultConfig = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'remove'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H2', 'H3', 'H4', 'Blockquote']
    },
    fontSize: {
      icon: 'fontSize',
      options: [8, 9, 10, 11, 12, 14, 16, 18]
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered']
    },
    textAlign: {
      inDropdown: false
    },
    link: {
      inDropdown: false,
      popupClassName:'rich-text-link-modal'
    }
}