export const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <style>
      {`
        .bar { animation: bar-up 1s ease-out forwards; }
        @keyframes bar-up {
          from { height: 0; y: 85; }
          to { height: var(--h); y: var(--y); }
        }
        .line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: line-draw 2s ease-out forwards 0.5s;
        }
        @keyframes line-draw {
          to { stroke-dashoffset: 0; }
        }
        .dot {
          animation: dot-appear 0.1s ease-out forwards;
          opacity: 0;
        }
        @keyframes dot-appear {
          to { opacity: 1; }
        }
      `}
    </style>
    <rect width="100" height="100" rx="15" fill="#120F1E" />
    <g transform="translate(10, 10)">
      {/* Grid */}
      <path d="M 0 20 H 80 M 0 40 H 80 M 0 60 H 80 M 20 0 V 80 M 40 0 V 80 M 60 0 V 80" stroke="#1D1733" strokeWidth="1"/>

      {/* Bars */}
      <rect className="bar" x="5" width="10" fill="#8257E5" style={{ '--h': 40, '--y': 45, animationDelay: "0s" } as React.CSSProperties} />
      <rect className="bar" x="25" width="10" fill="#8257E5" style={{ '--h': 60, '--y': 25, animationDelay: "0.2s" } as React.CSSProperties} />
      <rect className="bar" x="45" width="10" fill="#8257E5" style={{ '--h': 30, '--y': 55, animationDelay: "0.4s" } as React.CSSProperties} />
      <rect className="bar" x="65" width="10" fill="#8257E5" style={{ '--h': 50, '--y': 35, animationDelay: "0.6s" } as React.CSSProperties} />

      {/* Line on top */}
      <path className="line" d="M 10 45 L 30 25 L 50 55 L 70 35" fill="none" stroke="#00D8FF" strokeWidth="3" />

      {/* Circles on line */}
      <g fill="#00D8FF" stroke="#120F1E" strokeWidth="2">
        <circle className="dot" cx="10" cy="45" r="4" style={{animationDelay: '0.7s'}}/>
        <circle className="dot" cx="30" cy="25" r="4" style={{animationDelay: '0.9s'}}/>
        <circle className="dot" cx="50" cy="55" r="4" style={{animationDelay: '1.1s'}}/>
        <circle className="dot" cx="70" cy="35" r="4" style={{animationDelay: '1.3s'}}/>
      </g>
    </g>
  </svg>
); 