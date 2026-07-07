# DevOps Practice Roadmap — Fullstack Todo App

A step-by-step roadmap for building, containerizing, testing, and deploying a fullstack Todo application — from local development to a live Azure VM.

---

## Table of Contents

- [Phase 1 — Basic App Build](#phase-1--basic-app-build)
- [Phase 2 — Dockerize the App](#phase-2--dockerize-the-app)
- [Phase 3 — Docker Compose](#phase-3--docker-compose)
- [Phase 3.5 — Secrets Management](#phase-35--secrets-management)
- [Phase 4 — CI/CD with GitHub Actions](#phase-4--cicd-with-github-actions)
- [Phase 5 — Deploy to Azure VM + Docker + Nginx + Sub Domain](#phase-5--deploy-to-azure-vm--docker--nginx--sub-domain)
- [Phase 6 - Kubernetes Basics](#phase-6--kubernetes-basics)
- [Phase 6.5 - Ingress](#phase-65--ingress)
- [Phase 7 - Infrastructure as Code](#phase-7--infrastructure-as-code-terraform--ansible)
- [Phase 7.1 - Terraform](#71-terraform)
- [Phase 7.2 - Ansible](#72-ansible)
- [Phase 8 - Monitoring and Logging](#phase-8--monitoring--logging-prometheus--grafana--loki)
---

## Phase 1 — Basic App Build

**Goals:**
- Build a complete fullstack Todo application that runs locally
- Understand the data flow: **Database → Backend API → Frontend** and back
- Get comfortable with real-world project structure, with clearly separated layers

**Stack:**
- **Frontend:** React + Tailwind
- **Backend:** Node.js + Express + PostgreSQL

**Project structure:**

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── index.js          # Starts the Express server
│   │   ├── db.js             # PostgreSQL connection, table creation
│   │   └── routes/
│   │       └── todos.js      # All API endpoints
│   ├── .env                  # Environment variables (not committed)
│   ├── .env.example          # Template for the team (committed)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main component, manages state
    │   ├── api.js             # API calls via axios
    │   └── components/
    │       ├── TodoItem.jsx   # Display + edit + delete a todo
    │       └── AddTodo.jsx    # Form to add a new todo
    ├── vite.config.js         # Proxies /api → localhost:8080
    └── package.json
```

---

## Phase 2 — Dockerize the App

Create a `.dockerignore` file for both frontend and backend to avoid copying `node_modules`, `.env`, `.git`, etc. into the image (keeps builds fast and images small).

### Build & Run

Run these commands from each service's folder (`frontend/` and `backend/`):

**Build an image from the Dockerfile:**
```bash
docker build -t <name-container> .
```
- `build` — reads the Dockerfile and creates an image
- `-t <name-container>` — names the image (e.g. `todo-backend`)
- `.` — build context is the current folder (where the Dockerfile lives)

**Run a container from the built image:**
```bash
docker run -p <PORT:PORT> --name <name> --env-file .env <name-container>
```
- `run` — creates and starts a container from an image
- `-p 8080:8080` — maps host port → container port
- `--name <name>` — names the container (e.g. `todo-backend-container`)
- `--env-file .env` — passes environment variables from `.env` into the container
- `<name-container>` — the image used to create the container

**Frontend build with `.env` variables:**
```bash
docker build --build-arg VITE_BACKEND_URL=<URL> -t <name-container> .
```
- `--build-arg` — reads `VITE_BACKEND_URL` and injects it at build time

### Useful Commands

```bash
docker ps                        # List running containers
docker logs <container-name>     # View container logs
docker stop <container-name>     # Stop a container
docker rm <container-name>       # Remove a container
```

### Example (frontend)

```bash
docker build -t pern-frontend .
docker run -p 5173:5173 --name frontend --env-file .env pern-frontend
```

---

## Phase 3 — Docker Compose

**Goal:** Start multiple services (frontend, backend, database) together with a single command.

Create a `docker-compose.yml` file in the root folder that contains both `frontend/` and `backend/`.

> 💡 Search `docker compose` in the official docs for full configuration details.

### Commands

```bash
docker compose up --build      # Build images and start all services
docker compose up -d --build   # Same, but detached (background)
docker compose down            # Stop and remove containers
docker compose down -v         # Stop and remove containers + volumes (data loss!)
docker compose logs backend    # View logs for the backend service
docker compose ps              # View status of all services
```

---

## Phase 3.5 — Secrets Management

| Rule | Description |
|------|-------------|
| **Rule 1** | Make sure `.env` is listed in `.gitignore` |
| **Rule 2** | Never hardcode fallback passwords in source code |
| **Rule 3** | Backend should validate required environment variables at startup |
| **Rule 4** | Check git history for leaked secrets: `git log --all --full-history -- **/.env` |

---

## Phase 4 — CI/CD with GitHub Actions

- **CI (Continuous Integration):** Automatically checks code quality and runs tests whenever code is pushed or a pull request is opened.
- **CD (Continuous Deployment / Delivery):** Automatically deploys the application once CI passes successfully.

### Setup

1. Create `.github/workflows/ci.yml` in the root folder (covering both `frontend/` and `backend/`) to:
   - Install dependencies
   - Run ESLint
   - Check code formatting
   - Validate the build/test process

2. Configure `eslint.config.js` and `.prettierrc` in both the `frontend/` and `backend/` folders to:
   - Maintain a consistent code style
   - Detect common coding issues
   - Prevent unused variables and formatting mistakes

3. Add a lint script to `package.json` in both folders:

```json
"scripts": {
  "lint": "eslint ."
}
```

Run it locally with:

```bash
npm run lint
```

---

## Phase 5 — Deploy to Azure VM + Docker + Nginx + Sub Domain

**Goal:** Deploy the Dockerized fullstack Todo app to an Ubuntu VM on Azure, accessible from any browser via the VM's public IP.

> **Note:** This guide is intended for learning purposes only.

### 1. Create an Azure Virtual Machine

A **Virtual Machine (VM)** is simply another computer running in Microsoft's cloud. Instead of hosting the app on your own laptop (which must stay online 24/7), you host it on a VM so anyone on the Internet can reach it anytime.

Go to: **Azure Portal → Virtual Machines → Create**

#### Basic

| Setting | Value |
|---|---|
| Subscription | Your Azure subscription |
| Resource Group | Create a new one |
| Virtual Machine Name | Any name |
| Region | Closest region (reduces latency) |
| Availability Options | `No infrastructure redundancy required` |
| Image | Latest Ubuntu Server LTS |
| Security Type | Default |
| Authentication Type | Password |

Set a username and a password (minimum 12 characters).

#### Inbound Port Rules

For learning purposes, allow:
- **SSH (22)** — connect to the server
- **HTTP (80)** — allow browsers to access your website

#### Disks

- **Standard SSD** — fast enough and cheaper than Premium SSD

#### Networking

Keep the default configuration.

#### Management

- Enable **Auto Shutdown** and choose a shutdown time to avoid unnecessary Azure charges.

#### Monitoring / Advanced

Keep default settings — unnecessary for beginners.

#### Tags (optional)

| Name | Value |
|------|-------|
| owner | your-name |

Click **Review + Create** and wait for deployment to finish.

---

### 2. Connect to the Virtual Machine

> **Important:** Stop the VM when you're not using it to save Azure credits.

**Step 1 — Start the VM**, then go to **Virtual Machine → Connect**.

**Step 2 — Connect via SSH:**

```bash
ssh <username>@<PUBLIC_IP>
```

Example:

```bash
ssh ubuntu@20.10.30.40
```

**Step 3 — Open HTTP traffic:**

Go to **Networking → Add inbound port rule** and allow:

| Port | Purpose |
|------|---------|
| 80 | Website (HTTP) |

Click **Add**.

---

### 3. Deploy Your Application

> **Prerequisite (Windows users):** Install WSL to become familiar with a Linux environment: https://learn.microsoft.com/windows/wsl/install

#### Step 1 — Push your code to GitHub

Commit and push your latest project.

#### Step 2 — Install Docker on the VM

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install docker.io -y
sudo usermod -aG docker $USER
```

Log out and log back in for the group change to take effect.

#### Step 3 — Clone your repository

```bash
git clone https://github.com/<your-username>/<your-project>.git
cd <your-project>
```

#### Step 4 — Configure the Frontend

```bash
nano .env
```

Update:

```env
VITE_BACKEND_URL=http://<VM_PUBLIC_IP>:<BACKEND_PORT>
```

#### Step 5 — Update the Frontend Dockerfile for Production

Replace the development Dockerfile with a production, Nginx-served build:

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

#### Step 6 — Configure the Backend

```bash
nano .env
```

Update:

```env
CLIENT_URL=http://<VM_PUBLIC_IP>
```

#### Step 7 — Start the Containers

From the folder containing `docker-compose.yml`:

```bash
docker compose up --build -d
```

---

### 🎉 Done!

Open your browser and visit:

```
http://<VM_PUBLIC_IP>
```

## Setting Up a Subdomain + HTTPS with DuckDNS, Docker Compose, and Let's Encrypt

This guide walks through getting a free subdomain, opening the required firewall ports, and issuing a free TLS certificate via Let's Encrypt (Certbot) for a Dockerized nginx reverse proxy setup.

### Prerequisites

- A VM with a public IP address
- Docker and Docker Compose installed on the VM
- SSH access to the VM
- An existing `docker-compose.yml` with `frontend`, `backend`, and `nginx` services on the same Docker network

---

### Step 1: Get a Free Subdomain

**What is a subdomain?**

A subdomain is a human-readable name (like `myapp.duckdns.org`) that points to your server's IP address, so users don't need to remember or type a raw IP like `20.210.204.97`. It also enables HTTPS, since certificate authorities like Let's Encrypt issue certificates for domain names, not IP addresses.

**Steps:**

1. Go to [https://www.duckdns.org](https://www.duckdns.org) and sign in (via GitHub, Google, etc. — it's free).
2. Enter a name for your domain (e.g. `myapp` → `myapp.duckdns.org`).
3. Set the IP field to your VM's public IP address and click **update**.
4. You now have a working domain: `http://myapp.duckdns.org` that resolves to your VM.

> DuckDNS supports up to 5 free subdomains per account, useful if you want separate domains for staging, monitoring dashboards, etc.

---

### Step 2: Open Ports 80 and 443 in the VM's Network Security Group

**Why these ports?**

- **Port 80 (HTTP)** — required for normal web traffic, and also used by Let's Encrypt to verify domain ownership during certificate issuance (the "HTTP-01 challenge").
- **Port 443 (HTTPS)** — required to serve encrypted traffic once the certificate is installed.

Without these open at the cloud firewall level (Azure NSG, AWS Security Group, etc.), traffic never reaches your VM, even if the VM's local firewall and nginx are configured correctly.

**Steps (Azure example):**

1. Azure Portal → your VM → **Networking**
2. Under **Inbound port rules**, click **Add**
3. Add a rule for port `80`: Protocol `TCP`, Source `Any`, Action `Allow`
4. Repeat for port `443`

---

### Step 3: Update `docker-compose.yml`

Add a `certbot` service and mount shared volumes so nginx and certbot can exchange certificate files and validation challenges.

```yaml
services:
  # ... your existing database, backend, frontend services ...

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - pern-net

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    networks:
      - pern-net
```

**What this does:**

| Piece | Purpose |
|---|---|
| `./certbot/conf:/etc/letsencrypt` | Shared folder where certbot stores issued certificates, and where nginx reads them from |
| `./certbot/www:/var/www/certbot` | Shared folder used for the HTTP validation challenge — certbot writes a file here, nginx serves it publicly, Let's Encrypt checks it |
| `ports: 80:80 / 443:443` | Exposes nginx to the internet on both HTTP and HTTPS |
| `certbot` service has no `ports` | It doesn't need to be reachable directly — it only runs on-demand to request/renew certs |

---

### Step 4: Create a Temporary `nginx.conf`

Before a certificate exists, nginx **cannot** listen on port 443 with SSL — there's nothing to serve yet. Use this minimal HTTP-only config first, just to handle Let's Encrypt's validation request:

```nginx
events {}

http {
    server {
        listen 80;
        server_name myapp.duckdns.org;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 "ok";
        }
    }
}
```

---

### Step 5: Deploy the Changes to the VM

**If using Ansible:**

```bash
export ANSIBLE_CONFIG="$PWD/ansible.cfg"
ansible-playbook -i your_inventory deploy.yml
# or, if using an Ansible Vault password:
ansible-playbook -i your_inventory deploy.yml --ask-vault-pass
```

**Then, on the VM:**

```bash
ssh <user>@<vm_ip>
cd /opt/s
mkdir -p ./certbot/www ./certbot/conf
sudo docker compose up -d --build
```

---

### Step 6: Verify nginx Is Serving the Challenge Path Correctly

This sanity check confirms the volume mounts and config are wired correctly **before** using up Let's Encrypt's rate-limited attempts.

```bash
mkdir -p ./certbot/www/.well-known/acme-challenge/
echo "hello" > ./certbot/www/.well-known/acme-challenge/test123
curl http://myapp.duckdns.org/.well-known/acme-challenge/test123
```

This **must** return `hello`. If it returns a 404:
- Confirm all volumes are mounted: `sudo docker inspect nginx --format '{{json .Mounts}}'`
- Force-recreate the container if needed: `sudo docker compose up -d --force-recreate nginx`

Once confirmed, clean up the test file:

```bash
rm ./certbot/www/.well-known/acme-challenge/test123
```

---

### Step 7: Request the Real Certificate

```bash
sudo docker compose up -d nginx

sudo docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d myapp.duckdns.org \
  --email your-email@example.com \
  --agree-tos --no-eff-email
```

**On success, you'll see:**

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/myapp.duckdns.org/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/myapp.duckdns.org/privkey.pem
This certificate expires on <date>.
These files will be updated when the certificate renews.
```

**Verify the files exist:**

```bash
sudo ls -la /opt/s/certbot/conf/live/myapp.duckdns.org/
```

You should see `fullchain.pem` and `privkey.pem`.

---

### Step 8: Switch to the Full HTTPS `nginx.conf`

Now that the certificate exists, replace the temporary config with the full version — HTTP redirects to HTTPS, and HTTPS proxies to your app:

```nginx
events {}

http {
    client_max_body_size 10M;
    resolver 127.0.0.11 valid=10s;

    server {
        listen 80;
        server_name myapp.duckdns.org;

        # Required for Let's Encrypt validation and renewals
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect everything else to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name myapp.duckdns.org;

        ssl_certificate /etc/letsencrypt/live/myapp.duckdns.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/myapp.duckdns.org/privkey.pem;

        location / {
            set $frontend_upstream http://frontend:80;
            proxy_pass $frontend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
        }

        location /api/ {
            set $backend_upstream http://backend:8080;
            proxy_pass $backend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 5s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        location = /nginx-health {
            return 200 "ok";
            add_header Content-Type text/plain;
        }
    }
}
```

> **Note:** using `set $variable` + `proxy_pass $variable` (instead of a bare `proxy_pass http://frontend:80;`) forces nginx to re-resolve the container's IP at request time via the `resolver` directive, instead of caching it once at startup. This avoids 502 errors after container restarts change the internal IP.

---

### Step 9: Reload nginx

```bash
sudo docker exec -it nginx nginx -t       # validate syntax first
sudo docker exec -it nginx nginx -s reload
```

---

### Step 10: Confirm HTTPS Works

```bash
curl -I https://myapp.duckdns.org
```

Expected result: `HTTP/1.1 200 OK` (or `HTTP/2 200`) with `Server: nginx`. Also check in a browser — you should see the padlock icon.

---

### Step 11: Set Up Auto-Renewal

**Why this matters:** Let's Encrypt certificates expire every **90 days**. Without automatic renewal, your site will silently start showing browser security warnings once the cert expires.

Add a scheduled job that checks daily and only renews when needed (certbot handles the "is it close to expiring" logic internally):

```bash
sudo crontab -e
```

Add this line:

```
0 3 * * * cd /opt/s && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
```

This runs every day at 3 AM, silently renews the cert if it's within 30 days of expiry, and reloads nginx to pick up the renewed certificate.

---

### Summary Checklist
- [ ] Subdomain registered on DuckDNS and pointing to VM IP
- [ ] Ports 80 and 443 open in cloud NSG/firewall
- [ ] `docker-compose.yml` updated with `certbot` service and shared volumes
- [ ] Temporary nginx.conf deployed and challenge path verified (`curl` returns `hello`)
- [ ] Certificate successfully issued via `certbot certonly`
- [ ] Full HTTPS nginx.conf deployed and reloaded
- [ ] `curl -I https://yourdomain.duckdns.org` returns `200 OK`
- [ ] Auto-renewal cron job configured



Your Todo application is now live and accessible from anywhere on the Internet.

# Kubernetes, Nginx & Ingress — Local Development Guide (minikube)
 
This document covers running a full-stack app (frontend + backend + PostgreSQL) on a local Kubernetes cluster with **minikube**, including ConfigMaps, Secrets, and exposing the app through an **Nginx Ingress Controller**.
 
---
 
## Table of Contents
 
- [Phase 6 — Kubernetes Basics](#phase-6--kubernetes-basics)
  - [Kubernetes Resource Kinds](#kubernetes-resource-kinds)
  - [Cluster Setup](#cluster-setup)
  - [Building & Loading Images](#building--loading-images)
  - [Deploying Resources](#deploying-resources)
  - [Inspecting the Cluster](#inspecting-the-cluster)
  - [Port Forwarding](#port-forwarding)
  - [ConfigMaps & Secrets](#configmaps--secrets)
- [Phase 6.5 — Ingress](#phase-65--ingress)
  - [What is Ingress?](#what-is-ingress)
  - [Enabling the Ingress Addon](#enabling-the-ingress-addon)
  - [Building for Ingress](#building-for-ingress)
  - [Applying the Ingress Resource](#applying-the-ingress-resource)
  - [Accessing the App](#accessing-the-app)
  - [Windows Note: Freeing Port 80](#windows-note-freeing-port-80)
---
 
## Phase 6 — Kubernetes Basics
 
### Kubernetes Resource Kinds
 
Kubernetes manages applications using different resource **kinds**. Each kind serves a specific purpose within the cluster.
 
| Kind                             | Purpose                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Pod**                          | Runs one or more containers. The smallest deployable unit in Kubernetes.                        |
| **Deployment**                   | Manages Pods, handles rolling updates, and ensures the desired number of replicas are running.  |
| **ReplicaSet**                   | Maintains a stable set of identical Pods. Usually managed automatically by a Deployment.        |
| **Service**                      | Provides a stable network endpoint for accessing one or more Pods.                              |
| **ConfigMap**                    | Stores non-sensitive configuration data such as environment variables or config files.          |
| **Secret**                       | Stores sensitive information such as passwords, API keys, and tokens.                           |
| **Namespace**                    | Organizes and isolates Kubernetes resources within a cluster.                                   |
| **Ingress**                      | Exposes HTTP/HTTPS routes from outside the cluster to Services inside the cluster.               |
| **PersistentVolume (PV)**        | Represents a piece of persistent storage available to the cluster.                              |
| **PersistentVolumeClaim (PVC)**  | Requests persistent storage from a PersistentVolume.                                            |
| **StorageClass**                 | Defines how PersistentVolumes are dynamically provisioned.                                      |
| **NetworkPolicy**                | Controls network communication between Pods for security purposes.                              |
| **StatefulSet**                  | Manages stateful applications (e.g. PostgreSQL, MySQL, MongoDB) with stable identities/storage.  |
| **DaemonSet**                    | Ensures that one Pod runs on every node (or a selected group of nodes).                         |
| **Job**                          | Executes a task once until it successfully completes.                                           |
| **CronJob**                      | Schedules Jobs to run automatically at specified times using cron syntax.                       |
 
---
 
### Cluster Setup
 
Reset and start a fresh minikube cluster using the Docker driver:
 
```bash
minikube delete
minikube start --driver=docker
```
 
---
 
### Building & Loading Images
 
Build the frontend and backend Docker images locally, then load them directly into the minikube cluster's image cache (no external registry needed):
 
```bash
# Build images
docker build --build-arg VITE_BACKEND_URL=http://localhost:8080 -t frontend:local .
docker build -t backend:local .
 
# Load images into minikube
minikube image load backend:local
minikube image load frontend:local
```
 
To remove images from minikube later:
 
```bash
minikube image rm backend:local
minikube image rm frontend:local
```
 
---
 
### Deploying Resources
 
Apply the manifests for each component:
 
```bash
kubectl apply -f k8s/frontend.yml
kubectl apply -f k8s/backend.yml
kubectl apply -f k8s/postgres.yml
```
 
Wait until each component's Pods are ready before moving on:
 
```bash
kubectl -n todoapp wait --for=condition=ready pod -l app=postgres --timeout=180s
kubectl -n todoapp wait --for=condition=ready pod -l app=backend --timeout=180s
kubectl -n todoapp wait --for=condition=ready pod -l app=frontend --timeout=180s
```
 
---
 
### Inspecting the Cluster
 
View all Pods in the `todoapp` namespace:
 
```bash
kubectl -n todoapp get pods
```
 
View specific Pods with extra details (node, IP, etc.):
 
```bash
kubectl -n todoapp get pods -l app=postgres -o wide
kubectl -n todoapp get pods -l app=backend -o wide
```
 
View Service details:
 
```bash
kubectl -n todoapp get svc backend -o wide
kubectl -n todoapp get svc frontend -o wide
```
 
---
 
### Port Forwarding
 
Bind local ports to the cluster Services for direct access during development:
 
```bash
kubectl -n todoapp port-forward svc/backend 8080:8080
kubectl -n todoapp port-forward svc/frontend 5173:5173
```
 
---
 
### ConfigMaps & Secrets
 
Apply configuration and secret manifests:
 
```bash
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml
```
 
Inspect them:
 
```bash
kubectl -n todoapp get configmap app-config -o yaml
kubectl -n todoapp get secret app-secret -o yaml
```
 
> **ConfigMap** → non-sensitive config (URLs, feature flags, env vars)
> **Secret** → sensitive values (passwords, tokens, API keys) — base64-encoded, not encrypted by default
 
---
 
## Phase 6.5 — Ingress
 
### What is Ingress?
 
Ingress receives HTTP/HTTPS requests from outside the cluster and decides which internal Kubernetes **Service** should handle them, based on rules like hostname and path. It sits in front of your Services and acts as a smart, single entry point — instead of exposing each Service individually.
 
In this setup, **Nginx** is used as the Ingress Controller — the actual component that implements the Ingress rules and routes traffic.
 
---
 
### Enabling the Ingress Addon
 
minikube ships with an Nginx Ingress Controller addon:
 
```bash
minikube addons enable ingress
```
 
Verify the controller Pods are running:
 
```bash
kubectl get pods -n ingress-nginx
kubectl get all -n ingress-nginx
```
 
---
 
### Building for Ingress
 
Since Ingress will route `/api` requests to the backend Service, rebuild the frontend so it calls a **relative** path instead of `localhost:8080`:
 
```bash
docker build --build-arg VITE_BACKEND_URL=/api -t frontend:local .
docker build -t backend:local .
```
 
> Don't forget to reload the updated images into minikube (`minikube image load ...`) after rebuilding.
 
---
 
### Applying the Ingress Resource
 
```bash
kubectl apply -f k8s/ingress.yml
```
 
Check that it was created correctly:
 
```bash
kubectl get ingress -n todoapp
```
 
---
 
### Accessing the App
 
Get the URL minikube exposes for the Ingress controller:
 
```bash
minikube service ingress-nginx-controller -n ingress-nginx --url
```
 
Then map the hostname used in your `ingress.yml` (e.g. `app.local`) to that address, and access the app at:
 
```
app.local:<port>
```
 
> Add an entry to your hosts file (`/etc/hosts` on Linux/macOS or `C:\Windows\System32\drivers\etc\hosts` on Windows) pointing `app.local` to `127.0.0.1` if needed.
 
---
 
### Windows Note: Freeing Port 80
 
On Windows, the World Wide Web Publishing Service (`W3SVC`) often occupies port 80, which can conflict with Ingress. 
Do not worry, stop this will not affect too much to your laptop or PC, you can start again any time
Stop it with:
 
```powershell
net stop W3SVC
```
 
---
 
## Quick Reference — Full Command Flow
 
```bash
# 1. Fresh cluster
minikube delete
minikube start --driver=docker
 
# 2. Build & load images
docker build --build-arg VITE_BACKEND_URL=/api -t frontend:local .
docker build -t backend:local .
minikube image load backend:local
minikube image load frontend:local
 
# 3. Deploy core resources
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/backend.yml
kubectl apply -f k8s/frontend.yml
 
# 4. Wait for readiness
kubectl -n todoapp wait --for=condition=ready pod -l app=postgres --timeout=180s
kubectl -n todoapp wait --for=condition=ready pod -l app=backend --timeout=180s
kubectl -n todoapp wait --for=condition=ready pod -l app=frontend --timeout=180s
 
# 5. Enable Ingress
minikube addons enable ingress
kubectl apply -f k8s/ingress.yml
 
# 6. Access the app
minikube service ingress-nginx-controller -n ingress-nginx --url
```

## Phase 7 — Infrastructure as Code (Terraform + Ansible)
Notes on provisioning Azure infrastructure with Terraform, including setup, common errors, and the plan/apply/destroy workflow.

## 7.1. Terraform
 
### 1. Prerequisites
 
#### Install Azure CLI (Windows)
 
```powershell
winget install --exact --id Microsoft.AzureCLI
```
 
Reference: [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
 
> After installing, **restart your terminal** so the `az` command is picked up in `PATH`. This avoids the "executable file not found" error described in the Troubleshooting section below.
 
#### Sign in to Azure
 
```powershell
az login --use-device-code
```
 
You'll see output like:
 
```
To sign in, use a web browser to open the page https://microsoft.com/devicelogin
and enter the code XXXXXXXXX to authenticate.
```
 
Open that URL, enter the code shown in your terminal, and complete sign-in in the browser.
 
```
===========
INFORMATION
===========
Select a subscription and tenant (Type a number or Enter for no changes):
```
 
Press **Enter** to accept the default subscription, or type the number of the subscription/tenant you want to use.
 
Reference: [Quickstart — Create a Linux VM in Azure using Terraform](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-terraform?tabs=azure-cli)

#### Common adjustments before `terraform plan` and `terraform apply`

- **Region**: change `location` to a region actually available under your subscription.
- **VM size**: for practice/testing, a small burstable size like `Standard_B2ls_v2` keeps costs low.
- **Authentication**: change using ssh key into password ( prefer for newbie )
 
### 2. Initialize Terraform
 
```bash
terraform init -upgrade
```
 
This downloads the Azure provider (`azurerm`) needed to manage Azure resources, and generates/updates the `.terraform.lock.hcl` file, which pins provider versions for reproducible runs.
 
### 3. Validate the configuration
 
```bash
terraform validate
```
 
Checks that the configuration is syntactically valid and internally consistent (before Terraform talks to Azure at all).
 
### 4. Plan the deployment
 
```bash
terraform plan
```
 
`terraform plan` is a **preview** — it shows what Terraform *would* create/change/destroy without actually doing it. The more resources in the configuration, the longer this takes, since Terraform queries current state for each one.
 
#### Save the plan to a file
 
```bash
terraform plan -out=tfplan
```
 
Saving the plan lets you review it now and apply the *exact same* plan later, rather than re-planning (which could pick up drift if something changed in between).
 
### 5. Apply the plan
 
```bash
terraform apply tfplan
```
 
Applies the previously saved plan file directly — no re-confirmation prompt, since the plan was already reviewed.
 
### 6. Get the VM's public IP
 
```bash
echo $(terraform output -raw public_ip_address)
```
 
> Note: the output name must match whatever you defined in your `output` block (e.g. `output "public_ip_address" { value = azurerm_public_ip.example.ip_address }`). Adjust the name if yours differs.
 
### 7. Destroy resources
 
Preview the destroy first, then apply it — same pattern as create:
 
```bash
terraform plan -destroy -out main.destroy.tfplan
terraform apply main.destroy.tfplan
```
 
### Troubleshooting
 
#### `could not parse Azure CLI version: exec: "az": executable file not found in %PATH%`
 
Terraform's `azurerm` provider (when using CLI authentication) shells out to `az` to get your credentials. This error means Terraform can't find the Azure CLI on `PATH`. Fixed by [Install Azure CLI](#1-prerequisites):
 
1. Confirm the CLI is installed: `az --version`
2. If that fails, reinstall (`winget install --exact --id Microsoft.AzureCLI`) and **open a new terminal window** — PATH changes don't apply to already-open sessions.
3. Re-run `az login --use-device-code` to confirm authentication works.
4. Retry `terraform plan`.
---

## 7.2. Ansible

Notes on using Ansible to configure servers and deploy an app after Terraform has provisioned the infrastructure.

### Overview — The 4 layers of getting an app running

For an app to actually run on a server, four things need to be in place:

- **Packages installed** — runtimes, Docker, etc.
- **Folders created** — app directory structure, volumes.
- **Config present** — `.env` files, secrets, app configuration.
- **Service running** — containers up and healthy.

These map to four distinct layers of infrastructure work:

| Layer | Concern | Tool |
|---|---|---|
| 1. Provisioning | Create the VM/network/infra itself | Terraform |
| 2. Configuration management | Install packages, create folders, write config | Ansible |
| 3. Deployment | Get the app's code/containers onto the server and running | Ansible (playbooks) |
| 4. Exposure | Make the app reachable — reverse proxy, HTTPS, domains | Caddy / Nginx |

### 1. Install Ansible (via WSL)

Ansible runs on Linux, so on Windows you install it inside WSL:

```bash
wsl
sudo apt update
sudo apt install -y ansible
```

### 2. Initialize the project

Create `ansible.cfg` and `inventory.ini` in your project folder — these define Ansible's settings and the list of hosts (servers) it manages.

Then, from `cmd`, enter WSL and navigate to the project folder:

```bash
wsl
cd /path/to/your/project
```

### 3. Point Ansible at your config file

```bash
export ANSIBLE_CONFIG=$PWD/ansible.cfg
```

This tells Ansible to use the `ansible.cfg` in your current folder instead of a global default.

**Verify:**

```bash
ansible --version | sed -n '1,6p'
```

**Test connectivity to your hosts** (defined in `inventory.ini` under a group, e.g. `prod`):

```bash
ansible prod -m ping
```

### 4. Connect to the VM

```bash
ssh <username>@<vm_ip_address>
```

### 5. Run playbooks

An **Ansible playbook** is a YAML script that automates server setup — installing packages, creating folders, writing config, starting services.

**Run a bootstrap playbook** (initial server setup — layer 2):

```bash
ansible-playbook bootstrap.yml
```

**Run a deploy playbook** (app deployment — layer 3), explicitly pointing at your inventory:

```bash
ansible-playbook -i inventory.ini deploy.yml
```

### 6. Access the app (layer 4 — exposure)

**With a reverse proxy (Nginx/Caddy) in front:**

```
http://<vm_ip_address>
```

The proxy listens on port 80/443 and forwards to the app internally — no port number needed in the URL.

**Without a reverse proxy** (hitting the app/container port directly):

```
http://<vm_ip_address>:<frontend_port>
```

### 7. Security Management (Ansible Vault)

Secrets (DB passwords, API keys, etc.) shouldn't sit in plaintext in your repo. `.gitignore` keeps files out of Git entirely, but for values that *do* need to live in your playbooks (referenced by name), Ansible Vault encrypts them at rest instead.

> Check `.gitignore` first — make sure `vault.yml` files and raw `.env` files aren't accidentally excluded from encryption/tracking in a way that leaves secrets exposed elsewhere.

#### Step 1 — Set your editor (optional)

Ansible Vault opens the encrypted file in `vim` by default. If you're not comfortable with `vim`, switch to `nano`:

```bash
export EDITOR=nano
```

Skip this step if you're fine with `vim`.

#### Step 2 — Reference secrets by name in your playbook/config

In `deploy.yml` (or wherever `backend/.env` content is templated), reference the secret by variable name instead of hardcoding it:

```yaml
DB_PASSWORD={{ vault_db_password }}
```

Ansible will substitute the real value at runtime, pulled from the encrypted vault file.

#### Step 3 — Create the vault file

```bash
ansible-vault create group_vars/prod/vault.yml
```

- Creates `group_vars/prod/vault.yml`, encrypted, and applied automatically to hosts in the `prod` group.
- You'll be prompted to set a password — this password is the encryption key. Anyone who wants to view or edit this file later needs it.

#### Step 4 — Add your secrets

This opens the file in your editor (`nano`, if you set `EDITOR` above). Add your secrets as normal YAML key/value pairs:

```yaml
vault_db_password: MySecretKey
```

Save and exit:

- **nano**: `Ctrl + O` (write out / save) → `Enter` to confirm filename → `Ctrl + X` (exit)
- **vim**: `Esc` → `:wq` → `Enter`

#### Step 5 — Run the playbook with the vault password

Since `deploy.yml` now depends on encrypted variables, you must supply the vault password at runtime:

```bash
ansible-playbook -i inventory.ini deploy.yml --ask-vault-pass
```

Ansible will prompt for the vault password, decrypt `vault.yml` in memory, substitute `{{ vault_db_password }}`, and proceed with deployment.

---

**Other useful vault commands:**

| Command | Purpose |
|---|---|
| `ansible-vault edit group_vars/prod/vault.yml` | Edit an existing encrypted file |
| `ansible-vault view group_vars/prod/vault.yml` | View contents without editing |
| `ansible-vault rekey group_vars/prod/vault.yml` | Change the vault password |
| `ansible-vault decrypt group_vars/prod/vault.yml` | Permanently decrypt (use with care) |


## Phase 8 — Monitoring & Logging (Prometheus + Grafana + Loki)


