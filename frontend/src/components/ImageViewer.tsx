import React, { useRef, useEffect } from 'react';
import OpenSeadragon from 'openseadragon';
import { enableGeoTIFFTileSource } from 'geotiff-tilesource';
import { Button } from '@/components/ui/button';
import { Minimize2 } from 'lucide-react';

interface ImageViewerProps {
  viewerUrl: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ viewerUrl, onClose }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdViewer = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !viewerUrl) return;

    // Destroy existing viewer
    if (osdViewer.current) {
      osdViewer.current.destroy();
      osdViewer.current = null;
    }

    // Initialize OpenSeadragon viewer
    osdViewer.current = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      crossOriginPolicy: 'Anonymous',
      ajaxWithCredentials: false,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      defaultZoomLevel: 0,
      minZoomLevel: 0,
      maxZoomLevel: 10,
      gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true,
        pinchToZoom: true,
        scrollToZoom: true,
      },
    });

    // Use GeoTIFFTileSource to handle .svs or multi-page TIFF
    const tileSourcePromise = OpenSeadragon.GeoTIFFTileSource.getAllTileSources(
      viewerUrl,
      { logLatency: true }
    );

    tileSourcePromise
      .then((tileSources: any[]) => {
        // Open all discovered tile sources in sequence
        osdViewer.current.open(tileSources);

        // Optionally, you can inspect metadata or number of sources:
        console.log(`${tileSources.length} tile source(s) found`);
      })
      .catch((error: any) => {
        console.error('Failed to load SVS/TIFF:', error);
      });

    // Cleanup on unmount
    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, [viewerUrl]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex justify-end p-2 bg-gray-200">
        <Button variant="outline" size="icon" onClick={onClose}>
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>
      {/* Viewer container */}
      <div ref={viewerRef} className="flex-1 bg-black" />
    </div>
  );
};

export default ImageViewer;
