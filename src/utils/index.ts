/**
 *
 * 列表型数据转化树形
 */

export function buildTreeData(dates: string[]) {
  const tree: any[] = []
  // 数组去重
  dates = [...new Set(dates)]
  dates.forEach((date) => {
    const [year, month, day] = date.split('-')

    // Find or create the year node
    let yearNode = tree.find((node) => node.key === year)
    if (!yearNode) {
      yearNode = { title: `${year} 年`, key: year, children: [] }
      tree.push(yearNode)
    }

    // Find or create the month node
    let monthNode = yearNode.children.find((node: any) => node.key === `${year}-${month}`)
    if (!monthNode) {
      monthNode = { title: ` ${month} 月`, key: `${year}-${month}`, children: [] }
      yearNode.children.push(monthNode)
    }

    // Add the day node
    monthNode.children.push({
      title: `${day} 日`,
      key: `${year}-${month}-${day}`
    })
  })

  return tree
}
