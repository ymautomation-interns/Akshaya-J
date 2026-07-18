import './LoadingSkeleton.css';

/**
 * Generic shimmer skeleton. `variant` picks a preset shape used across the app.
 */
export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton--${variant}`}>
          {variant === 'summary' && (
            <>
              <div className="skeleton__avatar shimmer" />
              <div className="skeleton__lines">
                <div className="shimmer skeleton__line" style={{ width: '55%' }} />
                <div className="shimmer skeleton__line" style={{ width: '35%' }} />
                <div className="shimmer skeleton__line" style={{ width: '45%' }} />
              </div>
            </>
          )}
          {variant === 'card' && (
            <>
              <div className="shimmer skeleton__block" />
              <div className="shimmer skeleton__line" style={{ width: '70%' }} />
              <div className="shimmer skeleton__line" style={{ width: '40%' }} />
            </>
          )}
        </div>
      ))}
    </>
  );
}
