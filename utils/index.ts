export function extractContent(str: string) {
  // 正则表达式匹配 <@! 数字 >
  const userPattern = /<@!\d+>/g

  // 使用 replace 方法删除所有匹配的用户标识
  const result = str.replace(userPattern, '').trim()

  return result
}
