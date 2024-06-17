export const formatToKrTime = (date: Date) =>
  date.toLocaleString('ko-KR', {
    year: '2-digit',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Asia/Seoul',
  });
