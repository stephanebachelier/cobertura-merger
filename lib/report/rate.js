// inspired by https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-lib-coverage/lib/percent.js
function percent(covered, total = 0) {
  return total > 0
    ? Math.floor((1000 * 100 * covered) / total / 10) / 100
    : 100.0
}

function rate(covered, total = 0) {
  const precision = Math.pow(10, 4)

  return total === 0
    ? 1
    : Math.floor(Math.round((precision * covered) / total)) / precision
}

function lineCovered(lines) {
  return lines.filter(({ hits }) => hits > 0).length
}

function lineCoverage(lines = []) {
  if (!lines.length) {
    return {
      covered: 0,
      total: 0,
      rate: rate(0)
    }
  }

  const covered = lineCovered(lines)
  const total = lines.length

  return {
    covered,
    total,
    rate: rate(covered, total)
  }
}

function branchCoverage(branches = []) {
  if (!branches.length) {
    return {
      covered: 0,
      total: 0,
      rate: rate(0)
    }
  }

  const { covered, total } = branches
    .filter(({ branch }) => branch !== null)
    .reduce(
      (acc, branch) => {
        acc.covered += branch.covered
        acc.total += branch.total

        return acc
      },
      {
        covered: 0,
        total: 0
      }
    )

  return {
    covered,
    total,
    rate: rate(covered, total)
  }
}

module.exports = {
  percent,
  lineCovered,
  lineCoverage,
  branchCoverage
}
