const express = require('express');
const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('face-api.js');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

// Khai báo các biến cần thiết
const loadingPromises = new Map();
const MODEL_PATH = path.join(__dirname, 'models');

// Kiểm tra thư mục models
if (!fs.existsSync(MODEL_PATH)) {
  console.error(`Models directory not found at ${MODEL_PATH}`);
  process.exit(1);
}

// Hàm load model weights
const loadModelWeights = async (modelName) => {
  try {
    const manifestPath = path.join(MODEL_PATH, `${modelName}-weights_manifest.json`);
    const shardPath = path.join(MODEL_PATH, `${modelName}-shard1`);
    
    if (!fs.existsSync(manifestPath) || !fs.existsSync(shardPath)) {
      throw new Error(`Model files not found for ${modelName}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const weights = fs.readFileSync(shardPath);
    
    return { manifest, weights };
  } catch (error) {
    console.error(`Error loading model weights for ${modelName}:`, error);
    throw error;
  }
};

// Khởi tạo face-api.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
app.use(express.json({ limit: '50mb' }));

// Load các model cần thiết
const loadModels = async (
    useTinyModel
  ) => {
    let models = [
      'ssd_mobilenetv1_model',
      'tiny_face_detector_model',
      'face_landmark_68_model',
      'face_recognition_model',
      'face_expression_model',
    ];
    if (useTinyModel) {
      models = [
        'tiny_face_detector_model',
        'face_landmark_68_model',
        'face_recognition_model',
        'face_expression_model',
      ];
    } else if (useTinyModel === false) {
      models = [
        'ssd_mobilenetv1_model',
        'face_landmark_68_model',
        'face_recognition_model',
        'face_expression_model',
      ];
    }

    try {
      // Kiểm tra faceapi có tồn tại không
      if (!faceapi) {
        console.error('faceapi is not initialized');
        return false;
      }
  
      // Load các model tuần tự
      for (const model of models) {
        try {
          // Nếu đang có Promise đang load model này, đợi nó hoàn thành
          if (loadingPromises.has(model)) {
            const result = await loadingPromises.get(model);
            if (!result) {
              console.error(`Failed to load model ${model} from existing promise`);
              return false;
            }
            continue;
          }
    
          if (_.get(faceapi, `nets.${model}.isLoaded`)) {
            console.log(`Model ${model} is already loaded`);
            continue;
          }
    
          // Tạo Promise mới để load model
          const loadPromise = (async () => {
            try {
              console.log(`Loading model ${model}...`);
              const { manifest, weights } = await loadModelWeights(model);
              
              switch (model) {
                case 'ssd_mobilenetv1_model':
                  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
                  break;
                case 'tiny_face_detector_model':
                  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
                  break;
                case 'face_landmark_68_model':
                  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
                  break;
                case 'face_recognition_model':
                  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
                  break;
                case 'face_expression_model':
                  await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_PATH);
                  break;
                default:
                  console.error(`Unknown model type: ${model}`);
                  return false;
              }
              console.log(`Model ${model} loaded successfully`);
              return true;
            } catch (error) {
              console.error(`Error loading model ${model}:`, error);
              return false;
            } finally {
              loadingPromises.delete(model);
            }
          })();
    
          loadingPromises.set(model, loadPromise);
          const result = await loadPromise;
          if (!result) {
            console.error(`Failed to load model ${model}`);
            return false;
          }
        } catch (error) {
          console.error(`Unexpected error while loading model ${model}:`, error);
          return false;
        }
      }
  
      return true;
    } catch (error) {
      console.error('Unexpected error in loadModels:', error);
      return false;
    }
  };

// Hàm xử lý ảnh và phát hiện khuôn mặt
async function detectFaces(image, timeoutMs = 10000, useTinyModel = true) {
  try {
    const detectionPromise = (async () => {
      const loaded = await loadModels(useTinyModel);
      if (!loaded) {
        console.error('Failed to load models');
        return null;
      }

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = image;
      });

      const options = useTinyModel ? new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: 0.5,
        inputSize: 320,
      }) : new faceapi.SsdMobilenetv1Options();

      const detections = await faceapi
        .detectSingleFace(img, options)
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withFaceExpressions();

      if (!_.get(detections, 'detection._box')) {
        console.log('No face detected in image');
        return null;
      }

      return detections;
    })();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Face detection timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return await Promise.race([detectionPromise, timeoutPromise]);
  } catch (error) {
    console.error('Unexpected error in detectFaces:', error);
    return null;
  }
}

// API endpoint
app.post('/detect', async (req, res) => {
  try {
    const { images, useTinyModel = true } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Invalid input: images array required' });
    }

    const results = await Promise.all(
      images.map(async (image) => {
        try {
          return await detectFaces(image, 5000, useTinyModel);
        } catch (error) {
          return null;
        }
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await loadModels();
  console.log(`Server is running on port ${PORT}`);
}); 