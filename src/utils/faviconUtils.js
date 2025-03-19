export const updateFavicon = (isDark) => {
    const favicon = document.getElementById('favicon');
    if (!favicon) return;
    
    const logoPath = '/src/assets/CS-logo-removebg-preview.png';
    
    if (isDark) {
      favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <foreignObject width="100" height="100">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <img src="${logoPath}" style="filter: brightness(0) invert(1);" />
          </div>
        </foreignObject>
      </svg>`;
    } else {
      favicon.href = logoPath;
    }
  };