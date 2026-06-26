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

## Phase 5 — Deploy VPS + Nginx + Security ( Domain -> not free )

  - Goal: Deploy your Dockerized full-stack Todo application to a Linux server on Azure and access it from any browser using the VM's public IP.

**Azura Cloud ( Free 100$ for student email account )**
### 1. Set up virtual machine to host ( for learning only )

  *Why create virutal machine ?*
  => A Virtual Machine (VM) is simply another computer running in Microsoft's cloud.
  Instead of hosting your website on your own laptop (which must stay on 24/7), you host it on the VM so anyone on the Internet can access it.

  Step 1: Go to virtual machine section in Azure -> Click create
  Step 2: Basic Config
    + Basic: 
      - Subscription: create your own resource group
      - Virutal machine name: give it the name
      - Choose the region: Choose the region closest to your location ( Closer regions usually mean lower latency )
      - Availability Options: Choose `No infracstructure redundancy required` ( for learning, this is enough )
      - Image: Choose Ubuntu Server @lastest_version ( Most cloud servers use Linux )
      - Security type: Keep the default.
      - Authentication type: Choose password ( Passwords are easier for beginners while learning Linux ) 
        -> name: This is the Linux account you'll use after connecting, and passowrd's length is 12 
      - Inbound port rules ( important ): give it default for test only ( you can change it later in networking tab after create vm )
        e.g: port 22 -> Allows SSH connection  |  port 80 -> Allows browsers to access your website
    + Disks:
      - OS disk type: Standard SSD ( Fast enough and cheaper than Premium SSD ) 
    + Networking: Default
    + Management:
      - Auto-shutdown: tick enable auto-shutdown -> choose the time to shutdown ( save money )
    + Monitoring: Default ( Monitoring services cost money and are unnecessary for a beginner )
    + Advances: Default
    + Tags: Choose name and value if you want
      e.g: name: owner - value: adminphuc
    + Review + Create: Wait until deployment succeeds.

### 2. Connect virtual machine ( for learning only )
*Attention: turn off virtual machine when not learn to save money*
  Step 1 Go to virtual machine you created, click connect and start vm
  Step 2 Connect by `ssh <name>@<IP_PUBlIC_VIRTUAL_MACHINE>` in command prompt ( wsl )
  Step 3: Go to networking section -> create port rule -> inbound port rule -> destination port ranges edit into 80 for web  -> give the name for that settings then add --> Successfully -> Action is allow 

### 3. Host web with ip of virtual machine ( for learning only )
*Install wsl: https://learn.microsoft.com/en-us/windows/wsl/install* -> Get used to learn linux
  Step 1: Push code to github 
  Step 2: Install docker {
    `sudo apt update`
    `sudo apt upgrade -y` -> Update packages
    `sudo apt install docker.io -y` -> Install docker
    `sudo usermod -aG docker $USER` -> Add your user to Docker group, otherwise every Docker command requires sudo docker ...
  }
  Step 3: Paste `git clone https://github.com/<your_name>/<project_name>`
  Step 4: Navigate to frontend folder -> edit .env file by `nano` command -> VITE_BACKEND_UR=<IP_VM:PORT_BACKEND>
  Step 4.5: Edit in Dockerfile of frontend {
    from `FROM node:20-alpine` to `FROM node:20-alpine AS builder`
    add `FROM nginx:alpine`
    add `COPY --from=builder /app/dist /usr/share/nginx/html`
    from `EXPOSE 5173` to `EXPOSE 80`
    from `CMD [ "npm", "run", "preview" ]` to `CMD ["nginx", "-g", "daemon off;"]`
  }
  Step 5: Navigate to backend folder -> edit .env file by `nano` command -> CLIENT_URL=<IP_VM>
  Step 6: navigate to the folder cotain docker-compose.yml -> run `docker-compose up --build -d`
  
--> Congrats Successfully -> Access the ip public of virtual will show your website ( `http://YOUR_PUBLIC_IP` )


## Phase 6 — Kubernetes (local với minikube trước)

## Phase 7 — Monitoring & Logging (Prometheus + Grafana + Loki)

## Phase 8 — Infrastructure as Code (Terraform + Ansible)
