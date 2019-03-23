const { getDisplayFromKey } = require('../utils');

class Display {
  // Entity display info
  constructor() {
    this.sections = [];
  }

  add(text, title = 'Info') {
    this.sections.push({ text, title });
  }
}

class DisplayTable {
  static fromObject(object) {
    const header = { columns: ['Key', 'Value'], isBold: true };
    const rows = [header];
    Object.keys(object).forEach(key => {
      rows.push({ columns: [getDisplayFromKey(key), object[key]] });
    });
    return new DisplayTable(rows);
  }

  constructor(rows = []) {
    this.rows = rows;

    this.toString = this.toString.bind(this);
  }

  toString() {
    const stringParts = ['<table>'];
    this.rows.forEach(row => {
      stringParts.push(
        `<tr>${row.columns.map(col => this.columnToString(col, row)).join('\n')}</tr>`
      );
    });
    stringParts.push('</table>');
    return stringParts.join('\n');
  }

  columnToString(col, row) {
    return `<td>${row.isBold ? '<strong>' : ''}${col}${row.isBold ? '</strong>' : ''}</td>`;
  }
}

function DisplayLink(href, text) {
  return `<a href="${href}"><h5>${text || href}</h5></a>`;
}

module.exports = {
  Display,
  DisplayTable,
  DisplayLink
};
