import sanitizeHtml from 'sanitize-html'

export function sanitizeMailBody(mailBody: string): string {
  const sanitizeMailBody = sanitizeHtml(mailBody, {
    allowedTags: ['a', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
    allowedAttributes: {
      a: ['class']
    }
  })

  return sanitizeMailBody
}
