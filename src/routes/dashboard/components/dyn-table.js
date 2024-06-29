import {bindable, computedFrom} from 'aurelia-framework';

export class DynTable {
  @bindable rows = [];
  @bindable columns = [];

  sortableColumn = null;
  sortAsc = true;
  filter = null;

  max = 10;
  offset = 0;

  @computedFrom('sortableColumn', 'filteredRows', 'sortAsc', 'offset')
  get pagedResult() {
    let sortedRows = this.filteredRows;

    if (this.sortableColumn) {
      let idx = this.columns.findIndex(row => row.includes(this.sortableColumn));
      sortedRows = sortedRows.sort((a, b) => {
        if (a[idx] > b[idx]) return this.sortAsc ? 1 : -1;
        if (a[idx] < b[idx]) return this.sortAsc ? -1 : 1;
        return 0;
      });
    }

    return sortedRows.slice(this.offset, this.offset + this.max);
  }

  @computedFrom('sortableColumn', 'rows', 'filter')
  get filteredRows() {
    let filteredRows = this.rows;

    if (this.filter) {
      filteredRows = filteredRows.filter(
        r => r.some(c => String(c).toLowerCase().includes(this.filter.toLowerCase()))
      );
    }

    return filteredRows;
  }

  sort(name) {
    if (this.sortableColumn === name) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortableColumn = name;
      this.sortAsc = true;
    }
    
    return;
  }

  nextPage() {
    const offset = this.offset + this.max;
  
    if (offset >= this.rows.length) {
      this.offset = this.rows.length - (this.rows.length % this.max);
    } else {
      this.offset = offset;
    }
  }

  prevPage() {
    if (this.offset < 10) {
      this.offset = 0;
      return;
    }

    this.offset -= this.max;
  }

  @computedFrom('offset', 'filteredRows')
  get hasNextPage() {
    return (this.offset + this.max) < this.filteredRows.length;
  }

  @computedFrom('offset')
  get hasPrevPage() {
    return this.offset > 0;
  }

  @computedFrom('offset', 'max', 'filteredRows')
  get currentPageSize() {
    return Math.min(this.filteredRows.length, (this.offset + this.max))
  }

  highlight(text) {
    if (!this.filter) return text

    const highlightFn = (needle, haystack) => {
        return haystack.replace(new RegExp(needle, 'gi'), str => `<span class="highlight-text">${str}</span>`)
    }

    return highlightFn(this.filter, text)
  }
}