import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <span className="ll-v">V</span>
          <span className="ll-e">e</span>
          <span className="ll-n">n</span>
          <span className="ll-e2">e</span>
          <span className="ll-t">t</span>
          <span className="ll-h">h</span>
        </div>
        <div className="loading-bar-wrap">
          <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <span className="loading-pct">{Math.min(Math.round(progress), 100)}%</span>
      </div>
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="lp" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
