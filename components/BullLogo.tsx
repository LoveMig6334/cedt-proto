export default function BullLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#F472B6" />
      {/* Horns */}
      <path d="M14 21 Q10 14 12.5 11.5 Q14.5 15.5 16.5 19" fill="white" />
      <path d="M34 21 Q38 14 35.5 11.5 Q33.5 15.5 31.5 19" fill="white" />
      {/* Ears */}
      <ellipse cx="13.5" cy="23" rx="3" ry="2" fill="white" transform="rotate(-18 13.5 23)" />
      <ellipse cx="34.5" cy="23" rx="3" ry="2" fill="white" transform="rotate(18 34.5 23)" />
      {/* Head */}
      <ellipse cx="24" cy="27" rx="9.5" ry="8.5" fill="white" />
      {/* Nose */}
      <ellipse cx="24" cy="31.5" rx="5.5" ry="3" fill="#FCE7F3" />
      <circle cx="22" cy="31.5" r="1.1" fill="#F472B6" />
      <circle cx="26" cy="31.5" r="1.1" fill="#F472B6" />
      {/* Eyes */}
      <circle cx="20" cy="25.5" r="1.7" fill="#1E293B" />
      <circle cx="28" cy="25.5" r="1.7" fill="#1E293B" />
      <circle cx="20.5" cy="25" r="0.6" fill="white" />
      <circle cx="28.5" cy="25" r="0.6" fill="white" />
    </svg>
  );
}
