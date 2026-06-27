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

## Phase 5 — Deploy to Azure VM + Docker + Nginx

- Goal: Deploy your Dockerized full-stack Todo application to an Ubuntu Virtual Machine on Azure and access it from any browser using the VM's public IP.

> **Note**
>
> This guide is intended for learning purposes only.

### 1. Create an Azure Virtual Machine
*Why do we need a Virtual Machine?*
A **Virtual Machine (VM)** is simply another computer running in Microsoft's cloud.
Instead of hosting your application on your own laptop (which must stay online 24/7), you host it on a VM so anyone on the Internet can access it anytime.

#### Step 1 — Create a Virtual Machine
Go to:
> **Azure Portal → Virtual Machines → Create**

### Basic

- **Subscription:** Your Azure subscription
- **Resource Group:** Create a new one
- **Virtual Machine Name:** Choose any name
- **Region:** Choose the closest region to reduce latency
- **Availability Options:** `No infrastructure redundancy required`
- **Image:** Latest Ubuntu Server LTS
- **Security Type:** Default
- **Authentication Type:** Password

Create:

- Username
- Password (minimum 12 characters)
- 
#### Inbound Port Rules
For learning purposes, allow:
- **SSH (22)** — Connect to the server
- **HTTP (80)** — Allow browsers to access your website


#### Disks
Choose:
- **Standard SSD**
Fast enough and cheaper than Premium SSD.


#### Networking
Keep the default configuration.


#### Management
Enable:
- **Auto Shutdown**
Choose a shutdown time to avoid unnecessary Azure charges.


#### Monitoring
Keep the default settings.
Monitoring services are unnecessary for beginners.


#### Advanced
Keep default settings.


#### Tags (Optional)
Example:
| Name | Value |
|------|------|
| owner | your-name |

---

Click **Review + Create** and wait for deployment to finish.

## 2. Connect to the Virtual Machine
> **Important**
>
> Stop the VM when you're not using it to save Azure credits.
### Step 1
Start the VM.
Go to:
> **Virtual Machine → Connect**

### Step 2
Connect using SSH.
```bash
ssh <username>@<PUBLIC_IP>
```
Example:
```bash
ssh ubuntu@20.10.30.40
```

## Step 3
Open HTTP traffic.
Go to:
> **Networking → Add inbound port rule**
Allow:
| Port | Purpose |
|------|---------|
| 80 | Website (HTTP) |
Click **Add**.

## 3. Deploy Your Application
> **Prerequisite**
>
> Install WSL if you're using Windows:
>
> https://learn.microsoft.com/windows/wsl/install
Using WSL helps you become familiar with Linux.

### Step 1 — Push your code to GitHub
Commit and push your latest project.

### Step 2 — Install Docker
Update packages:
```bash
sudo apt update
sudo apt upgrade -y
```
Install Docker:
```bash
sudo apt install docker.io -y
```

Add your user to the Docker group:
```bash
sudo usermod -aG docker $USER
```

Log out and log back in for the changes to take effect.

### Step 3 — Clone your repository
```bash
git clone https://github.com/<your-username>/<your-project>.git
```

Go to the project folder:
```bash
cd <your-project>
```

### Step 4 — Configure the Frontend
Navigate to the frontend directory.
Edit the `.env` file:
```bash
nano .env
```

Update:
```env
VITE_BACKEND_URL=http://<VM_PUBLIC_IP>:<BACKEND_PORT>
```

### Step 5 — Update the Frontend Dockerfile
Replace your development Dockerfile with a production build.
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 6 — Configure the Backend
Navigate to the backend folder.
Edit the `.env` file:
```bash
nano .env
```

Update:
```env
CLIENT_URL=http://<VM_PUBLIC_IP>
```

### Step 7 — Start the Containers
Navigate to the folder containing `docker-compose.yml`.
Run:
```bash
docker compose up --build -d
```

# 🎉 Done!
Open your browser and visit:
```text
http://<VM_PUBLIC_IP>
```
Your Todo application should now be accessible from anywhere on the Internet.

## Phase 6 — Kubernetes (local với minikube trước)

## Phase 7 — Monitoring & Logging (Prometheus + Grafana + Loki)

## Phase 8 — Infrastructure as Code (Terraform + Ansible)
