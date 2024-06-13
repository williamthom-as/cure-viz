import {inject, computedFrom, bindable} from 'aurelia-framework';

export class RecentlyViewed {
  @bindable dashboards = null;

  sortableColumn = 'createdAt';
  sortAsc = false;
  filter = null;

  max = 10;
  offset = 0;

  @computedFrom('sortableColumn', 'filteredRows', 'sortAsc', 'offset')
  get pagedResult() {
    let sortedColumns = this.filteredRows;

    if (this.sortableColumn) {
      const sortKey = this.sortableColumn.split('.');

      sortedColumns = sortedColumns.sort((a, b) => {
        const key_a = sortKey.reduce((o, k) => (o || {})[k], a);
        const key_b = sortKey.reduce((o, k) => (o || {})[k], b);
      
        if (typeof key_a === 'string') {
          return this.sortAsc ? key_a.localeCompare(key_b) : key_b.localeCompare(key_a);
        } else if (typeof key_a === 'number') {
          return this.sortAsc ? key_a - key_b : key_b - key_a;
        }
      });
    }

    return sortedColumns.slice(this.offset, this.offset + this.max);
  }

  @computedFrom('sortableColumn', 'dashboards', 'filter')
  get filteredRows() {
    let filteredRows = this.dashboards;

    if (this.filter) {
      filteredRows = filteredRows.filter(
        r => r.content && r.content.title && r.content.title.toLowerCase().includes(this.filter)
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
    const dashboardLength = this.filteredRows.length;

    if (offset >= dashboardLength) {
      this.offset = dashboardLength - (dashboardLength % this.max);
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
}