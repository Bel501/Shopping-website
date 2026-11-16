import { useEffect, useState } from 'react';

export interface DeviceCapabilities {
  webglSupported: boolean;
  isSoftwareGl: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  canRender3D: boolean;
}

function probeWebGL(): { webglSupported: boolean; isSoftwareGl: boolean } {
  if (typeof window === 'undefined') {
    return { webglSupported: false, isSoftwareGl: true };
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      return { webglSupported: false, isSoftwareGl: true };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { webglSupported: true, isSoftwareGl };
  } catch {
    return { webglSupported: false, isSoftwareGl: true };
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>(() => {
    const { webglSupported, isSoftwareGl } = probeWebGL();
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const memory =
      typeof navigator !== 'undefined' && 'deviceMemory' in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
        : 4;
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    const isLowEnd = !isSoftwareGl && (cores <= 2 || memory <= 2);

    return {
      webglSupported,
      isSoftwareGl,
      isLowEnd,
      prefersReducedMotion,
      canRender3D: webglSupported && !isLowEnd,
    };
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => {
      setCaps((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return caps;
}
