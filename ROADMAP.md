# ROADMAP PRACTICING DEVOPS

## Phase 1 — Build app cơ bản

- Goal:
  - Xây dựng hoàn chỉnh một ứng dụng Todo fullstack có thể chạy được trên máy local
  - Hiểu luồng dữ liệu từ Database → Backend API → Frontend và ngược lại
  - Làm quen với cấu trúc project thực tế, tổ chức code rõ ràng, tách biệt từng layer
  -

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

- Create `.dockerignore` for frontend and backend and set up for it: avoid copy node_module, env, git ( too long )

- Paste these cmd line in each frontend path and backend path:

  **Build image from Dockerfile:**
  `docker build -t <name-container> .`
  - `build` — read Dockerfile and create image
  - `-t <name-container>` — name for image (ví dụ: `todo-backend`)
  - `.` — build context is the current folder (where store Dockerfile)

  **Run container from image built:**
  `docker run -p <PORT:PORT> --name <name> --env-file .env <name-container>`
  - `run` — create and start container from image
  - `-p 3001:3001` — map port to main: port trong container
  - `--name <name>` — name for container (e.g: `todo-backend-container`)
  - `--env-file .env` — pass environment variables file `.env` into container
  - `<name-container>` — image name used to create container

  ### Build in frontend has file .env: `docker build --build-arg VITE_BACKEND_URL=<URL> -t <name-container> .`
  - `--build-arg`: read var vite_backend_url from .env

```bash
  docker ps                        # Watch containers running
  docker logs <name container>   # Watch log ogg container
  docker stop <name container>   # Stop container
  docker rm <name container>     # Delete container
```

docker build -t pern-frontend .
docker run -p 5173:5173 --name frontend --env-file .env pern-frontend

## Phase 3 — Docker Compose

- Goal: Start several services at the same time

- Create file ``docker-compose.yml` in folder contained frontend and backend folder.

- `docker compose up --build` đọc `compose.yml`

Find by key word `docker compose` to have more details

```bash
  docker compose up --build      # Build image and start all
  docker compose up -d --build   # Detached
  docker compose down            # Stop and delete containers
  docker compose down -v         # Stop and delete volume (lost data)
  docker compose logs backend    # Watch log of service backend
  docker compose ps              # Watch status of service
```

## Phase 3.5 — Secrets Management

`Rule 1`: Ensure .env in file .gitignore
`Rule 2`: No fallback password in source code
`Rule 3`: Backend validated environment variable
`Rule 4`: Check git history: `git log --all --full-history -- **/.env`

## Phase 4 — CI/CD với GitHub Actions

CI (Continuous Integration): Automatically checks code quality and runs tests whenever code is pushed or a pull request is created
CD (Continuous Deployment / Delivery): Automatically deploys the application after the CI process passes successfully.

- Create file `.github/workflows/ci.yml` in folder cotain frontend and backend:
  - Install dependencies
  - Run ESLint
  - Check code formatting
  - Validate build/test process

- Configure `eslint.config.js` and `.prettierrc` in backend and frontend folder: to check format code:
  - Maintain consistent code style
  - Detect common coding issues
  - Prevent unused variables and formatting mistakes

- Setting `script` in `package.json` from both frontend and backend --> Run the following command to check for linting errors `npm run lint`

## Phase 5 — Deploy VPS + Nginx + Security

### Azura Cloud ( Free student email account )
- Set up virtual machine to host: https://www.youtube.com/watch?v=W-k3GGv8jto

## Phase 6 — Kubernetes (local với minikube trước)

## Phase 7 — Monitoring & Logging (Prometheus + Grafana + Loki)

## Phase 8 — Infrastructure as Code (Terraform + Ansible)
