import { useState, useEffect } from 'react';

export function useLocalTime(timeZone: string = 'Africa/Addis_Ababa', cityLabel: string = 'ADDIS'): string {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    function update() {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setTimeStr(`${cityLabel.toUpperCase()} ${formatted}`);
      } catch {
        setTimeStr(`${cityLabel.toUpperCase()} --:--`);
      }
    }

    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, [timeZone, cityLabel]);

  return timeStr;
}
