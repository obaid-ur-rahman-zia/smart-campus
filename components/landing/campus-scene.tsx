"use client";

import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

const GLOBE_ARCS = [
  { startLat: 24.86, startLng: 67.01, endLat: 51.51, endLng: -0.13 },
  { startLat: 33.72, startLng: 73.04, endLat: 40.71, endLng: -74.01 },
  { startLat: 25.2, startLng: 55.27, endLat: 1.35, endLng: 103.82 },
  { startLat: 48.86, startLng: 2.35, endLat: 35.68, endLng: 139.69 },
];

const GLOBE_POINTS = GLOBE_ARCS.flatMap((arc) => [
  { lat: arc.startLat, lng: arc.startLng, size: 0.35, color: "#4ea4ff" },
  { lat: arc.endLat, lng: arc.endLng, size: 0.25, color: "#93c5fd" },
]);

function fitGlobeView(globe: GlobeInstance, width: number, height: number) {
  const minDim = Math.min(width, height);
  const cameraDistance = minDim * 0.58;
  const altitude = minDim < 400 ? 2.05 : 1.9;

  const controls = globe.controls();
  controls.minDistance = cameraDistance;
  controls.maxDistance = cameraDistance;
  globe.pointOfView({ lat: 20, lng: 60, altitude }, 0);
}

export function CampusSceneComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let globe: GlobeInstance | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let cancelled = false;

    void (async () => {
      const { default: Globe } = await import("globe.gl");
      if (cancelled || !containerRef.current) return;

      const { clientWidth, clientHeight } = container;

      globe = new Globe(container, {
        animateIn: true,
        waitForGlobeReady: true,
        rendererConfig: { alpha: true, antialias: true },
      })
        .width(clientWidth)
        .height(clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl(EARTH_TEXTURE)
        .showAtmosphere(true)
        .atmosphereColor("#4ea4ff")
        .atmosphereAltitude(0.12)
        .arcsData(GLOBE_ARCS)
        .arcColor(() => ["#4ea4ff", "#93c5fd"])
        .arcAltitude(0.25)
        .arcStroke(0.6)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .pointsData(GLOBE_POINTS)
        .pointAltitude(0.01)
        .pointRadius("size")
        .pointColor("color");

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.85;
      controls.enableZoom = false;
      controls.enablePan = false;

      fitGlobeView(globe, clientWidth, clientHeight);
      globe.renderer().setClearColor(0x000000, 0);

      const onResize = () => {
        if (!containerRef.current || !globe) return;
        const { clientWidth: w, clientHeight: h } = containerRef.current;
        globe.width(w);
        globe.height(h);
        fitGlobeView(globe, w, h);
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      globe?._destructor();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-transparent overflow-visible [&_canvas]:!bg-transparent"
      aria-hidden
    />
  );
}
