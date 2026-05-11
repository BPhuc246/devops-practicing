
# ROADMAP PRACTICING DEVOPS

## Phase 1 — Build app cơ bản  

- Goal: 
    + Xây dựng hoàn chỉnh một ứng dụng Todo fullstack có thể chạy được trên máy local
    + Hiểu luồng dữ liệu từ Database → Backend API → Frontend và ngược lại
    + Làm quen với cấu trúc project thực tế, tổ chức code rõ ràng, tách biệt từng layer
    + 

- Frontend: React + Tailwind

- Backend: Nodejs + Express + Postgresql

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── index.js          # Khởi động Express server
│   │   ├── db.js             # Kết nối PostgreSQL, tạo bảng
│   │   └── routes/
│   │       └── todos.js      # Toàn bộ API endpoints
│   ├── .env                  # Biến môi trường (không commit)
│   ├── .env.example          # Template cho team (có commit)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # Component chính, quản lý state
    │   ├── api.js             # Gọi API với axios
    │   └── components/
    │       ├── TodoItem.jsx   # Hiển thị + sửa + xoá từng todo
    │       └── AddTodo.jsx    # Form thêm todo mới
    ├── vite.config.js         # Proxy /api → localhost:3001
    └── package.json
```

## Phase 2 — Dockerize app



## Phase 3 — Docker Compose


## Phase 3.5 — Secrets Management


## Phase 4 — CI/CD với GitHub Actions


## Phase 5 — Deploy VPS + Nginx + Domain + Security


## Phase 6 — Kubernetes (local với minikube trước)


## Phase 7 — Monitoring & Logging (Prometheus + Grafana + Loki)


## Phase 8 — Infrastructure as Code (Terraform + Ansible)