# 🚀 Rapidagil IT — Trivia Multijugador IT en Tiempo Real

Juego interactivo multijugador en tiempo real para eventos, charlas, clases o reuniones técnicas. Hasta cientos de jugadores pueden conectarse simultáneamente desde sus teléfonos móviles.

---

## 🎮 Mecánica del Juego

1. **Ingreso:** Cada participante entra a la URL desde su móvil, escribe su alias y elige el color de su avatar.
2. **Sala de espera:** Todos los jugadores esperan a que el organizador dé inicio.
3. **Preguntas en vivo:**
   - Se muestra un concepto técnico de IT con 4 opciones (A, B, C, D).
   - Temporizador de **15 segundos** por pregunta.
   - **El primer jugador en marcar la respuesta correcta acumula 1 punto** y se muestra quién acertó.
   - Si nadie acierta en 15 segundos, se revela la respuesta y continúa.
4. **Podio Final:** Al terminar las preguntas, se despliega el podio con los 3 primeros lugares, animación de confeti y ranking completo.

---

## 🛠️ Banco de Preguntas (50 Preguntas)

El banco incluye 50 preguntas técnicas de opción múltiple distribuidas en:
- 🖥️ **Proxmox VE** (Ceph, qm migrate, LXC, corosync, raw)
- 🐳 **Docker** (ps, Dockerfile, compose, overlay, multi-stage)
- ☸️ **Kubernetes** (Pod, etcd, Deployment, logs, Service)
- 🌐 **Nginx** (upstream, server, reload, proxy_pass, ssl)
- 🔥 **Iptables** (filter, INPUT, line numbers, nat, DROP)
- ☁️ **AWS** (S3, Lambda, IAM, RDS, VPC)
- 🦊 **GitLab** (ci.yml, Runner, stages, Merge Request, Container Registry)
- 🚀 **DevOps** (CI, Terraform, CD, Ansible, Cattle not pets)
- 🔒 **Seguridad** (HTTPS, DDoS, Mínimo privilegio, 2FA/MFA, OpenVAS)
- 🐧 **Linux / SysAdmin** (df -h, crontab, sources.list, dnsmasq, top/htop)

---

## ⚡ Despliegue 100% Gratis (Vercel + Supabase)

### Paso 1: Configurar Supabase (Base de datos en tiempo real)
1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un **New Project**.
3. En el menú lateral, ve a **SQL Editor** y pega el contenido del archivo [`supabase/schema.sql`](./supabase/schema.sql).
4. Haz clic en **Run** (esto crea las tablas y habilita Realtime).
5. Ve a **Project Settings > API** y copia:
   - **Project URL**
   - **anon public key**

### Paso 2: Subir el código a GitHub
Abre tu terminal en esta carpeta y ejecuta:
```bash
git add .
git commit -m "feat: Rapidagil IT - Trivia Multijugador en Tiempo Real"
git branch -M main
git push origin main
```

### Paso 3: Desplegar en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Haz clic en **"Add New..." → "Project"**.
3. Importa tu repositorio `trivia-it`.
4. En **Environment Variables**, añade:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Tu Project URL de Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Tu anon public key de Supabase)
5. Haz clic en **Deploy**. ¡Listo en ~1 minuto!

---

- **Jugadores (Móviles):** `https://tu-proyecto.vercel.app/`
- **Organizador (Panel Secreto):** `https://tu-proyecto.vercel.app/admin997784`
