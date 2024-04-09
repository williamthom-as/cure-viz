import moment from 'moment';

export class DateValueConverter {
  toView(value) {
    return moment(value).format('YYYY-MM-DD');
  }
}
