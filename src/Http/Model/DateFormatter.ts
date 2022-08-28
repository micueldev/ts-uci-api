class DateFormatter {
  public static readonly HTTP_FORMAT = 'Y-m-d H:i:s';
  public static readonly HTTP_FORMAT_DATE = 'Y-m-d';

  public static format(date: Date, format: string = this.HTTP_FORMAT): string {
    if (format === this.HTTP_FORMAT_DATE) {
      return date.toISOString().replace(/T.+/, '');
    } else {
      return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }
  }
}

export default DateFormatter;
