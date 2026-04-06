'use client';

import { useState, useEffect } from 'react';
import { SITE_NAME, type Gallery, type CompareMode, type ScaleMode, type Alignment, type ImageRenderingMode, type SliderOrientation } from '@/lib/types';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { TopBar } from './TopBar';
import { ClickerMode } from './ClickerMode';
import { SliderMode } from './SliderMode';

interface Props {
  gallery: Gallery;
}

export function CompareView({ gallery }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [mode, setMode] = useState<CompareMode>('clicker');
  const [clickerSource, setClickerSource] = useState(0);
  const [checkedSources, setCheckedSources] = useState<boolean[]>(() =>
    gallery.sources.map(() => true),
  );
  const [sliderSourceA, setSliderSourceA] = useState(0);
  const [sliderSourceB, setSliderSourceB] = useState(Math.min(1, gallery.sources.length - 1));
  const [sliderOrientation, setSliderOrientation] = useState<SliderOrientation>('vertical');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('1:1');
  const [alignment, setAlignment] = useState<Alignment>('center');
  const [rendering, setRendering] = useState<ImageRenderingMode>('auto');

  const sceneUrls = gallery.urls[sceneIndex] ?? [];
  const { loaded, dimensions } = useImagePreloader(sceneUrls);

  const pageTitle = gallery.title ? `${gallery.title} | ${SITE_NAME}` : SITE_NAME;

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <title>{pageTitle}</title>
      <TopBar
        gallery={gallery}
        sceneIndex={sceneIndex}
        setSceneIndex={setSceneIndex}
        mode={mode}
        setMode={setMode}
        clickerSource={clickerSource}
        setClickerSource={setClickerSource}
        checkedSources={checkedSources}
        setCheckedSources={setCheckedSources}
        sliderSourceA={sliderSourceA}
        setSliderSourceA={setSliderSourceA}
        sliderSourceB={sliderSourceB}
        setSliderSourceB={setSliderSourceB}
        sliderOrientation={sliderOrientation}
        setSliderOrientation={setSliderOrientation}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        alignment={alignment}
        setAlignment={setAlignment}
        rendering={rendering}
        setRendering={setRendering}
      />
      <div className="relative flex-1 overflow-hidden">
        {mode === 'clicker' ? (
          <ClickerMode
            urls={sceneUrls}
            sources={gallery.sources}
            activeSource={clickerSource}
            setActiveSource={setClickerSource}
            checkedSources={checkedSources}
            dimensions={dimensions}
            scaleMode={scaleMode}
            alignment={alignment}
            rendering={rendering}
            loaded={loaded}
          />
        ) : (
          <SliderMode
            urls={sceneUrls}
            sources={gallery.sources}
            sourceA={sliderSourceA}
            sourceB={sliderSourceB}
            setSourceA={setSliderSourceA}
            setSourceB={setSliderSourceB}
            orientation={sliderOrientation}
            dimensions={dimensions}
            scaleMode={scaleMode}
            alignment={alignment}
            rendering={rendering}
            loaded={loaded}
          />
        )}
      </div>
    </div>
  );
}
