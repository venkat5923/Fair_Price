import React from 'react';

export default function StatusBar() {
  return (
    <>
      <div className="device-island">
        <div className="island-camera"></div>
      </div>
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          {/* Cellular Signal Bars */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
            <rect x="0.5" y="8" width="3" height="3" rx="0.5" fill="#19251D" />
            <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" fill="#19251D" />
            <rect x="8.5" y="3" width="3" height="8" rx="0.5" fill="#19251D" />
            <rect x="12.5" y="0.5" width="3" height="10.5" rx="0.5" fill="#19251D" />
          </svg>
          {/* Wi-Fi Icon */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 10.5C8.05228 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.05228 8.5 7.5 8.5C6.94772 8.5 6.5 8.94772 6.5 9.5C6.5 10.0523 6.94772 10.5 7.5 10.5Z" fill="#19251D"/>
            <path d="M4.5 6.5C5.3 5.7 6.3 5.3 7.5 5.3C8.7 5.3 9.7 5.7 10.5 6.5" stroke="#19251D" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M1.5 3.5C3.1 2 5.2 1.3 7.5 1.3C9.8 1.3 11.9 2 13.5 3.5" stroke="#19251D" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {/* Battery Icon */}
          <svg width="22" height="11" viewBox="0 0 24 12" fill="none">
            <rect x="0.75" y="0.75" width="19.5" height="10.5" rx="3.25" stroke="#19251D" strokeWidth="1.5" />
            <rect x="2.5" y="2.5" width="13" height="7" rx="1.5" fill="#19251D" />
            <path d="M22 4.5V7.5" stroke="#19251D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
}

export function HomeIndicator() {
  return <div className="home-indicator"></div>;
}
