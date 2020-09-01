
/**
 * Convert Published date text to Date object
 */
function parseDate(dirtyDate: string): Date {
  // 
  const dotDate = dirtyDate.replace('Published', '').trim()
  const [date, month, year] = dotDate.split('.')
  return new Date(Number(year), Number(month) - 1, Number(date));
}

/**
 * Parses string content into an object containing publishDate and text description
 * @param content 
 */
export function parseContent(content: string): { publishedDate: Date, description: string } {
  const data = content.split('<br/>')
  const dirtyPublishDate = data.shift() as string;
  const publishedDate = parseDate(dirtyPublishDate);
  return { publishedDate, description: data.join('<br/>').trim() }
}
