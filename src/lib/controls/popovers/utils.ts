
type BoxCss = {
  width?: string
  maxWidth?: string
  padding?: string
  boxShadow?: string | number
  border?: string
  borderRadius?: string
  top?: string
  minHeight?: string
  left?: string
  height?: string
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '460px',
  bgcolor: 'background.paper',
  boxShadow: 24 as (string | number),
  p: 4,
  outline: 'none',
  padding: '16px',
  borderRadius: '8px'
}

export function getMaterialBoxStyle (css: BoxCss = {}) {
  const { width, boxShadow, maxWidth, padding, border, borderRadius, top, minHeight, left, height } = css
  const _style = { ...style }

  // override existing
  if (width) {
    _style.width = width
  }
  if (boxShadow) {
    _style.boxShadow = boxShadow
  }
  if (borderRadius) {
    _style.borderRadius = borderRadius
  }
  if (top) {
    _style.top = top
  }
  if (left) {
    _style.left = left
  }
  // overide new props
  if (maxWidth) {
    _style['maxWidth'] = maxWidth
  }
  if (padding) {
    _style['padding'] = padding
  }
  if (border) {
    _style['border'] = border
  }
  if(minHeight) {
    _style['minHeight'] = minHeight
  }
  if(height) {
    _style['height'] = height
  }

  return _style
}
