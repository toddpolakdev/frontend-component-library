import { useEffect, useState } from 'react';

import { ClockRoot, DateText, Time } from './Clock.styles';

export interface ClockProps {
  /** Locale for time/date formatting; defaults to the runtime locale. */
  locale?: string;
}

export function Clock({ locale }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ClockRoot role="timer" aria-live="off">
      <Time>
        {now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
      </Time>
      <DateText>
        {now.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}
      </DateText>
    </ClockRoot>
  );
}

Clock.displayName = 'Clock';

export default Clock;
