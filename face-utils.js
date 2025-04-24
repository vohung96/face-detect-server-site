/**
 * Format kết quả face detection từ server để phù hợp với client
 * @param {Object} detection - Kết quả detect từ server
 * @returns {Object} - Kết quả đã được format
 */
export function formatDetectionResult(detection) {
  if (!detection) return null;
  
  // Chuyển đổi descriptor từ object sang Float32Array
  let descriptorArray;
  if (detection.descriptor) {
    if (Array.isArray(detection.descriptor)) {
      descriptorArray = new Float32Array(detection.descriptor);
    } else if (typeof detection.descriptor === 'object') {
      // Nếu descriptor là object với các key là index
      const values = Object.values(detection.descriptor);
      descriptorArray = new Float32Array(values);
    } else {
      descriptorArray = detection.descriptor;
    }
  }
  
  return {
    alignedRect: {
      _imageDims: detection.alignedRect._imageDims,
      _score: detection.alignedRect._score,
      _classScore: detection.alignedRect._classScore
    },
    descriptor: descriptorArray,
    detection: {
      _box: detection.detection._box,
      _score: detection.detection._score,
      _classScore: detection.detection._classScore
    },
    expressions: {
      neutral: detection.expressions.neutral,
      happy: detection.expressions.happy,
      sad: detection.expressions.sad
    },
    landmarks: {
      _imgDims: detection.landmarks._imgDims,
      _shift: detection.landmarks._shift,
      _positions: detection.landmarks._positions
    }
  };
}

/**
 * Format mảng kết quả face detection
 * @param {Array} detections - Mảng kết quả detect từ server
 * @returns {Array} - Mảng kết quả đã được format
 */
export function formatDetectionResults(detections) {
  if (!Array.isArray(detections)) return [];
  return detections.map(detection => formatDetectionResult(detection));
} 