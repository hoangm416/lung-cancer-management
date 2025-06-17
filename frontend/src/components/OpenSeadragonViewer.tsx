import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

interface OpenSeadragonViewerProps {
  dziUrl: string;
  width?: string;
  height?: string;
}

const OpenSeadragonViewer: React.FC<OpenSeadragonViewerProps> = ({
  dziUrl,
  width = '100%',
  height = '500px',
}) => {
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    const viewer = OpenSeadragon({
      id: 'openseadragon-viewer',
      prefixUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
      tileSources: dziUrl,
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [dziUrl]);

  return (
    <div
      id="openseadragon-viewer"
      style={{ width: width, height: height }}
    />
  );
};

export default OpenSeadragonViewer;