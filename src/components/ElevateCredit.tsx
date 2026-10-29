/** Elevate Studio's credit under the footer: the mark and the name, the whole of it one link to elevatestudio.nu. */
export function ElevateCredit() {
  return (
    <div
      className="elevate-credit"
      style={{
        maxWidth: 1240,
        margin: "24px auto 0",
        padding: "20px 16px 0",
        borderTop: "1px solid rgba(128,128,128,.25)",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <a
        href="https://elevatestudio.nu"
        target="_blank"
        rel="noopener"
        className="opacity-[.55] transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 0",
          fontSize: 13,
          lineHeight: 1,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <svg viewBox="0 0 1884.3 1353.9" aria-hidden="true" style={{ width: 16, height: 16, flex: "none", display: "block" }}>
          <path d="M0.0 1353.9 L1218.7 0.0 L1218.7 329.1 L479.7 1136.4 L786.7 1132.4 L1215.5 687.4 L1884.3 1349.9 L1590.1 1349.9 L1218.6 994.7 L865.4 1349.9Z" fill="currentColor" />
        </svg>
        Byggd av Elevate Studio
      </a>
    </div>
  );
}
