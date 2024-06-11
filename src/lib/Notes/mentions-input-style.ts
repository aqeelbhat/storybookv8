export const editorCss = {
    height: '100%',
    control: {
      backgroundColor: 'var(--warm-prime-chalk)',
      fontSize: 14,
      fontWeight: 'normal',
      minHeight: '100%'
    },
  
    '&multiLine': {
      control: {
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        minHeight: '100%',
      },
      highlighter: {
        padding: '12px',
        border: 'none',
        minHeight: '100%'
      },
      input: {
        padding: '12px',
        border: 'none',
        outline: 'none',
        color: 'var(--warm-prime-charcoal)',
        fontFamily: 'Inter',
        fontSize: '10.5pt',
        fontWeight: '400'
      }
    },
  
    '&singleLine': {
      display: 'inline-block',
      width: 180,
  
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        border: '2px inset',
      },
    },
  
    suggestions: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '1px 0px 0px 0px rgba(166, 166, 166, 0.25) inset, -6px 0px 12px 0px rgba(0, 0, 0, 0.12)',
      list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'var(--warm-prime-chalk)',
        fontSize: 14,
        padding: '8px',
        border: 'none',
      },
      item: {
        padding: '8px',
        borderBottom: 'none',
        '&focused': {
          background: 'var(--warm-neutral-light-400)',
          borderRadius: '4px'
        },
      },
    },
}

export const readonlyCss = {
  ...editorCss,
  '&multiLine': {
    ...editorCss["&multiLine"],
    highlighter: {
      padding: '0',
      border: 'none',
      minHeight: '100%'
    }
  }
}
