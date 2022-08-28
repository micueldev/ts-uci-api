import DateFormatter from '@/Http/Model/DateFormatter';

describe('Test DateFormatter', () => {
  it('Test format date time', async () => {
    const date = new Date(Date.UTC(2022, 11, 7, 17, 4, 34));

    const dateFormatted = DateFormatter.format(date);
    expect(typeof dateFormatted).toEqual('string');

    expect(dateFormatted).toEqual('2022-12-07 17:04:34');
  });

  it('Test format date', async () => {
    const date = new Date(Date.UTC(2023, 1, 20, 17, 4, 34));

    const dateFormatted = DateFormatter.format(
      date,
      DateFormatter.HTTP_FORMAT_DATE,
    );
    expect(typeof dateFormatted).toEqual('string');

    expect(dateFormatted).toEqual('2023-02-20');
  });
});
