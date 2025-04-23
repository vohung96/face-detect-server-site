# Face Detection Server

Server phát hiện khuôn mặt sử dụng face-api.js chạy trên Docker.

## Yêu cầu

- Docker
- Node.js (nếu muốn chạy local)

## Các bước cài đặt

1. Tải các model cần thiết:
   - Tải các file model từ [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Đặt các file model vào thư mục `models/`:
     - ssd_mobilenetv1_model-weights_manifest.json
     - ssd_mobilenetv1_model-shard1
     - ssd_mobilenetv1_model-shard2
     - face_landmark_68_model-weights_manifest.json
     - face_landmark_68_model-shard1
     - face_landmark_68_model-shard2
     - face_recognition_model-weights_manifest.json
     - face_recognition_model-shard1
     - face_recognition_model-shard2

2. Build Docker image:
```bash
docker build -t face-detect-server .
```

3. Chạy container:
```bash
docker run -p 3000:3000 face-detect-server
```

## API Endpoint

### POST /detect

Phát hiện khuôn mặt từ một mảng các ảnh (URL hoặc base64).

**Request Body:**
```json
{
  "images": [
    "data:image/jpeg;base64,...",
    "https://example.com/image.jpg"
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "success": true,
      "detections": [
        {
          "box": {
            "x": 100,
            "y": 100,
            "width": 200,
            "height": 200
          },
          "landmarks": [
            {
              "x": 150,
              "y": 150
            },
            // ... các điểm landmarks khác
          ]
        }
      ]
    }
  ]
}
```

## Lưu ý

- Server có thể xử lý nhiều ảnh cùng lúc
- Mỗi ảnh có thể là URL hoặc base64 string
- Kết quả trả về bao gồm vị trí khuôn mặt (box) và các điểm landmarks 