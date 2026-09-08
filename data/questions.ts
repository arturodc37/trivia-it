import { Question } from "@/lib/types";

export const QUESTIONS: Question[] = [
  // ==========================================
  // 1. PROXMOX (1-5)
  // ==========================================
  {
    id: 1,
    category: "Proxmox",
    question: "¿Qué sistema de almacenamiento distribuido se integra nativamente con Proxmox VE para ofrecer alta disponibilidad?",
    options: {
      A: "GlusterFS",
      B: "DRBD",
      C: "Ceph",
      D: "ZFS sobre iSCSI"
    },
    answer: "C",
    explanation: "Proxmox VE integra Ceph nativamente en su interfaz; GlusterFS y DRBD también son válidos como storage compartido, pero no tienen esa integración nativa en la GUI/API de Proxmox."
  },
  {
    id: 2,
    category: "Proxmox",
    question: "¿Qué comando se usa en Proxmox VE para migrar en vivo una VM entre nodos?",
    options: {
      A: "pct migrate",
      B: "qm migrate",
      C: "pvecm migrate",
      D: "qmigrate --live"
    },
    answer: "B",
    explanation: "`qm migrate <vmid> <nodo>` migra en vivo una VM KVM; `pct migrate` es el equivalente pero para contenedores LXC, no VMs."
  },
  {
    id: 3,
    category: "Proxmox",
    question: "¿Qué tecnología de virtualización usa Proxmox VE para sus contenedores ligeros?",
    options: {
      A: "OpenVZ",
      B: "systemd-nspawn",
      C: "LXC",
      D: "Docker"
    },
    answer: "C",
    explanation: "Proxmox VE usa LXC para virtualización a nivel de SO, gestionado con `pct`; OpenVZ fue el predecesor histórico pero ya no es lo que usa Proxmox actual."
  },
  {
    id: 4,
    category: "Proxmox",
    question: "En un clúster de Proxmox VE, ¿qué servicio gestiona el quorum entre nodos?",
    options: {
      A: "pacemaker",
      B: "corosync",
      C: "keepalived",
      D: "pvestatd"
    },
    answer: "B",
    explanation: "Corosync provee la comunicación de clúster y el mecanismo de quorum; keepalived y pacemaker son herramientas de HA de otros stacks (no las usa Proxmox por defecto)."
  },
  {
    id: 5,
    category: "Proxmox",
    question: "¿Qué formato de disco se usa típicamente para VMs cuando el almacenamiento backend es Ceph RBD en Proxmox?",
    options: {
      A: "qcow2",
      B: "vmdk",
      C: "raw",
      D: "vhdx"
    },
    answer: "C",
    explanation: "Ceph RBD no aprovecha las ventajas de snapshots de qcow2 (se gestionan a nivel de RBD), por eso Proxmox usa `raw` sobre RBD."
  },

  // ==========================================
  // 2. DOCKER (6-10)
  // ==========================================
  {
    id: 6,
    category: "Docker",
    question: "¿Qué comando de Docker lista los contenedores actualmente en ejecución?",
    options: {
      A: "docker stats",
      B: "docker ps",
      C: "docker events",
      D: "docker top"
    },
    answer: "B",
    explanation: "`docker ps` lista contenedores en ejecución; `docker stats` muestra uso de recursos y `docker top` muestra procesos dentro de un contenedor específico, no la lista general."
  },
  {
    id: 7,
    category: "Docker",
    question: "¿Qué archivo define los pasos para construir una imagen Docker?",
    options: {
      A: ".dockerignore",
      B: "manifest.yaml",
      C: "Dockerfile",
      D: "docker-compose.yml"
    },
    answer: "C",
    explanation: "El Dockerfile contiene las instrucciones que `docker build` usa para generar la imagen; `.dockerignore` solo excluye archivos del contexto de build."
  },
  {
    id: 8,
    category: "Docker",
    question: "¿Qué comando levanta los servicios definidos en un docker-compose.yml en segundo plano usando la sintaxis con guion?",
    options: {
      A: "docker-compose run -d",
      B: "docker-compose start -d",
      C: "docker-compose up -d",
      D: "docker-compose exec -d"
    },
    answer: "C",
    explanation: "`docker-compose up -d` crea y arranca los contenedores en modo detached; `start` solo arranca contenedores ya creados previamente, no los crea."
  },
  {
    id: 9,
    category: "Docker",
    question: "¿Qué driver de red de Docker permite que contenedores en distintos hosts (nodos) se comuniquen entre sí, típico en Docker Swarm?",
    options: {
      A: "macvlan",
      B: "host",
      C: "bridge",
      D: "overlay"
    },
    answer: "D",
    explanation: "La red `overlay` permite comunicación entre contenedores en distintos hosts (Swarm/multi-host); `bridge` es solo intra-host."
  },
  {
    id: 10,
    category: "Docker",
    question: "¿Qué técnica de Dockerfile permite reducir el tamaño final de la imagen usando varias etapas de construcción?",
    options: {
      A: "docker build --squash",
      B: "Optimización con .dockerignore",
      C: "Multi-stage build (FROM ... AS)",
      D: "Layer caching"
    },
    answer: "C",
    explanation: "Multi-stage build permite copiar solo los artefactos necesarios a la imagen final, descartando herramientas de compilación de etapas previas."
  },

  // ==========================================
  // 3. KUBERNETES (11-15)
  // ==========================================
  {
    id: 11,
    category: "Kubernetes",
    question: "¿Cuál es la unidad más pequeña desplegable en Kubernetes?",
    options: {
      A: "Container",
      B: "ReplicaSet",
      C: "Node",
      D: "Pod"
    },
    answer: "D",
    explanation: "El Pod es la unidad mínima de despliegue en Kubernetes; un Container vive dentro de un Pod, no es desplegable por sí solo como recurso de K8s."
  },
  {
    id: 12,
    category: "Kubernetes",
    question: "¿Qué componente del control plane de Kubernetes almacena el estado del clúster?",
    options: {
      A: "kube-apiserver",
      B: "kubelet",
      C: "etcd",
      D: "kube-scheduler"
    },
    answer: "C",
    explanation: "etcd almacena todo el estado del clúster; kube-apiserver es la interfaz que lee/escribe en etcd, pero no es el almacén en sí."
  },
  {
    id: 13,
    category: "Kubernetes",
    question: "¿Qué objeto de Kubernetes gestiona actualizaciones progresivas (rolling updates) y mantiene un número deseado de réplicas de Pods?",
    options: {
      A: "ReplicaSet",
      B: "StatefulSet",
      C: "Job",
      D: "Deployment"
    },
    answer: "D",
    explanation: "Deployment gestiona ReplicaSets, habilita rolling updates y rollback; un ReplicaSet por sí solo mantiene réplicas pero no gestiona actualizaciones progresivas."
  },
  {
    id: 14,
    category: "Kubernetes",
    question: "¿Qué comando de kubectl muestra los logs de un contenedor dentro de un Pod?",
    options: {
      A: "kubectl attach",
      B: "kubectl exec",
      C: "kubectl logs",
      D: "kubectl describe"
    },
    answer: "C",
    explanation: "`kubectl logs <pod>` muestra la salida estándar del contenedor; `kubectl exec` ejecuta comandos dentro del contenedor, no muestra logs históricos."
  },
  {
    id: 15,
    category: "Kubernetes",
    question: "¿Qué recurso de Kubernetes expone un conjunto de Pods como un único punto de acceso de red estable?",
    options: {
      A: "Ingress",
      B: "Endpoint",
      C: "NetworkPolicy",
      D: "Service"
    },
    answer: "D",
    explanation: "Un Service da una IP/DNS estable que balancea tráfico hacia los Pods; Ingress gestiona el enrutamiento HTTP externo, pero depende de un Service detrás."
  },

  // ==========================================
  // 4. NGINX (16-20)
  // ==========================================
  {
    id: 16,
    category: "Nginx",
    question: "¿Qué directiva de nginx se usa para definir un grupo de servidores backend para balanceo de carga?",
    options: {
      A: "location",
      B: "listen",
      C: "server_name",
      D: "upstream"
    },
    answer: "D",
    explanation: "El bloque `upstream` define los servidores backend para balanceo de carga; `location` solo enruta rutas dentro de un server block."
  },
  {
    id: 17,
    category: "Nginx",
    question: "¿Qué directiva define el bloque de configuración de un sitio virtual en nginx?",
    options: {
      A: "http",
      B: "vhost",
      C: "server",
      D: "site"
    },
    answer: "C",
    explanation: "Cada bloque `server { }` define un vhost dentro del contexto `http`; no existe una directiva literal `vhost` en nginx."
  },
  {
    id: 18,
    category: "Nginx",
    question: "¿Cómo se recarga la configuración de nginx sin causar downtime en las conexiones activas?",
    options: {
      A: "systemctl restart nginx",
      B: "nginx -s reload",
      C: "kill -9 $(pidof nginx)",
      D: "nginx -s stop && nginx"
    },
    answer: "B",
    explanation: "`nginx -s reload` recarga sin downtime, ya que los workers antiguos terminan las conexiones en curso; `restart` sí corta el servicio momentáneamente."
  },
  {
    id: 19,
    category: "Nginx",
    question: "¿Qué directiva de nginx se usa para reenviar peticiones hacia un servidor backend (proxy inverso)?",
    options: {
      A: "rewrite",
      B: "fastcgi_pass",
      C: "return",
      D: "proxy_pass"
    },
    answer: "D",
    explanation: "`proxy_pass` reenvía la petición HTTP hacia el backend indicado; `fastcgi_pass` es específico para backends FastCGI (como PHP-FPM), no HTTP genérico."
  },
  {
    id: 20,
    category: "Nginx",
    question: "¿Qué módulo de nginx permite terminar conexiones TLS/SSL?",
    options: {
      A: "ngx_stream_module",
      B: "ngx_http_gzip_module",
      C: "ngx_http_ssl_module",
      D: "ngx_http_rewrite_module"
    },
    answer: "C",
    explanation: "`ngx_http_ssl_module` habilita las directivas para terminar HTTPS; `ngx_stream_module` es para tráfico TCP/UDP genérico, no HTTP con TLS."
  },

  // ==========================================
  // 5. IPTABLES (21-25)
  // ==========================================
  {
    id: 21,
    category: "Iptables",
    question: "¿Qué tabla de iptables se usa por defecto para el filtrado general de paquetes?",
    options: {
      A: "mangle",
      B: "nat",
      C: "filter",
      D: "raw"
    },
    answer: "C",
    explanation: "La tabla `filter` es la predeterminada para decidir ACCEPT/DROP; `mangle` se usa para modificar paquetes, no para filtrado básico."
  },
  {
    id: 22,
    category: "Iptables",
    question: "¿Qué cadena de iptables intercepta los paquetes destinados al propio host local?",
    options: {
      A: "FORWARD",
      B: "PREROUTING",
      C: "OUTPUT",
      D: "INPUT"
    },
    answer: "D",
    explanation: "La cadena INPUT procesa paquetes destinados al propio host; PREROUTING actúa antes de que se decida el destino (local o reenviado)."
  },
  {
    id: 23,
    category: "Iptables",
    question: "¿Qué comando lista las reglas actuales de iptables mostrando su número de línea?",
    options: {
      A: "iptables -S -v",
      B: "iptables --list-rules -n",
      C: "iptables -L --line-numbers",
      D: "iptables -vnL --numeric"
    },
    answer: "C",
    explanation: "`iptables -L --line-numbers` muestra las reglas con su posición exacta en cada cadena; las otras variantes existen pero no incluyen el número de línea."
  },
  {
    id: 24,
    category: "Iptables",
    question: "¿Qué tabla de iptables se usa para realizar traducción de direcciones de red (NAT)?",
    options: {
      A: "filter",
      B: "mangle",
      C: "security",
      D: "nat"
    },
    answer: "D",
    explanation: "La tabla `nat` contiene PREROUTING, POSTROUTING y OUTPUT para DNAT/SNAT; `mangle` se usa para marcar o alterar paquetes, no para NAT."
  },
  {
    id: 25,
    category: "Iptables",
    question: "¿Qué objetivo (target) de iptables descarta silenciosamente un paquete, sin enviar respuesta al origen?",
    options: {
      A: "REJECT",
      B: "RETURN",
      C: "ACCEPT",
      D: "DROP"
    },
    answer: "D",
    explanation: "DROP descarta el paquete sin avisar al emisor; REJECT sí responde con un mensaje de error explícito."
  },

  // ==========================================
  // 6. AWS (26-30)
  // ==========================================
  {
    id: 26,
    category: "AWS",
    question: "¿Qué servicio de AWS provee almacenamiento de objetos escalable?",
    options: {
      A: "EBS",
      B: "EFS",
      C: "S3",
      D: "Glacier"
    },
    answer: "C",
    explanation: "Amazon S3 es el servicio de almacenamiento de objetos; EBS es almacenamiento de bloque para instancias EC2 y EFS es almacenamiento de archivos (NFS), no objetos."
  },
  {
    id: 27,
    category: "AWS",
    question: "¿Qué servicio de AWS permite ejecutar código en respuesta a eventos sin aprovisionar servidores?",
    options: {
      A: "Fargate",
      B: "EC2",
      C: "Lambda",
      D: "Batch"
    },
    answer: "C",
    explanation: "AWS Lambda ejecuta código serverless en respuesta a eventos; Fargate también evita gestionar servidores pero corre contenedores, no funciones sueltas por evento."
  },
  {
    id: 28,
    category: "AWS",
    question: "¿Qué servicio de AWS gestiona usuarios, roles y políticas de acceso?",
    options: {
      A: "KMS",
      B: "Cognito",
      C: "IAM",
      D: "Organizations"
    },
    answer: "C",
    explanation: "AWS IAM controla usuarios, roles y políticas de acceso a nivel de cuenta; Cognito gestiona identidades de usuarios finales de aplicaciones, no accesos internos de AWS."
  },
  {
    id: 29,
    category: "AWS",
    question: "¿Qué servicio de AWS ofrece bases de datos relacionales gestionadas (MySQL, PostgreSQL, etc.)?",
    options: {
      A: "ElastiCache",
      B: "DynamoDB",
      C: "Redshift",
      D: "RDS"
    },
    answer: "D",
    explanation: "Amazon RDS gestiona motores relacionales (MySQL, PostgreSQL, etc.); DynamoDB es NoSQL y Redshift es un data warehouse analítico, no transaccional."
  },
  {
    id: 30,
    category: "AWS",
    question: "¿Qué servicio de AWS se usa para definir redes virtuales aisladas con subredes propias?",
    options: {
      A: "CloudFront",
      B: "Route 53",
      C: "Direct Connect",
      D: "VPC"
    },
    answer: "D",
    explanation: "Amazon VPC crea una red lógicamente aislada con subredes propias; Route 53 es DNS y Direct Connect es conectividad dedicada, no definición de red virtual."
  },

  // ==========================================
  // 7. GITLAB (31-35)
  // ==========================================
  {
    id: 31,
    category: "GitLab",
    question: "¿Qué archivo define un pipeline de CI/CD dentro de un repositorio de GitLab?",
    options: {
      A: ".gitlab/ci.yml",
      B: "pipeline.yaml",
      C: ".gitlab-ci.yml",
      D: "ci-config.json"
    },
    answer: "C",
    explanation: "`.gitlab-ci.yml` en la raíz del repo define el pipeline de CI/CD; los otros nombres de archivo no son reconocidos por GitLab."
  },
  {
    id: 32,
    category: "GitLab",
    question: "¿Qué componente de GitLab ejecuta los jobs definidos en el pipeline?",
    options: {
      A: "GitLab Agent",
      B: "Sidekiq",
      C: "GitLab Runner",
      D: "CI Executor Server"
    },
    answer: "C",
    explanation: "GitLab Runner recibe y ejecuta los jobs con el executor configurado; el GitLab Agent es para conectar clústeres Kubernetes, no para ejecutar jobs de CI."
  },
  {
    id: 33,
    category: "GitLab",
    question: "¿Qué palabra clave en `.gitlab-ci.yml` define el orden de las etapas del pipeline?",
    options: {
      A: "steps",
      B: "order",
      C: "stages",
      D: "phases"
    },
    answer: "C",
    explanation: "La clave `stages` define el orden de las etapas del pipeline; `steps` no es una palabra clave válida en GitLab CI."
  },
  {
    id: 34,
    category: "GitLab",
    question: "¿Qué funcionalidad de GitLab permite revisar y fusionar cambios de código antes de integrarlos a una rama principal?",
    options: {
      A: "Issue",
      B: "Milestone",
      C: "Snippet",
      D: "Merge Request"
    },
    answer: "D",
    explanation: "El Merge Request permite revisar y fusionar cambios (equivalente al Pull Request de GitHub); un Issue es para reportar tareas o bugs, no cambios de código."
  },
  {
    id: 35,
    category: "GitLab",
    question: "¿Qué característica de GitLab permite almacenar y distribuir imágenes Docker propias dentro de cada proyecto?",
    options: {
      A: "Package Registry",
      B: "Wiki",
      C: "Artifact Storage",
      D: "Container Registry"
    },
    answer: "D",
    explanation: "El Container Registry integrado permite push/pull de imágenes Docker por proyecto; el Package Registry existe pero es para paquetes (npm, Maven, etc.), no imágenes de contenedor."
  },

  // ==========================================
  // 8. DEVOPS GENERAL (36-40)
  // ==========================================
  {
    id: 36,
    category: "DevOps",
    question: "¿Qué práctica de DevOps consiste en integrar cambios de código frecuentemente en un repositorio compartido, validándolos con builds y pruebas automáticas?",
    options: {
      A: "Canary Release",
      B: "Feature Flagging",
      C: "Blue-Green Deployment",
      D: "Integración Continua (CI)"
    },
    answer: "D",
    explanation: "La Integración Continua valida cada cambio con builds y tests automáticos al integrarlo frecuentemente; Blue-Green y Canary son estrategias de despliegue, no de integración de código."
  },
  {
    id: 37,
    category: "DevOps",
    question: "¿Cuál de estas herramientas es un ejemplo típico de Infraestructura como Código (IaC)?",
    options: {
      A: "Jenkins",
      B: "Prometheus",
      C: "Grafana",
      D: "Terraform"
    },
    answer: "D",
    explanation: "Terraform define infraestructura en archivos declarativos versionables (IaC); Jenkins es una herramienta de CI/CD, no de definición de infraestructura."
  },
  {
    id: 38,
    category: "DevOps",
    question: "¿Qué práctica DevOps busca reducir al mínimo el tiempo entre que se hace un commit y su despliegue seguro en producción?",
    options: {
      A: "Code Review",
      B: "Sprint Planning",
      C: "Pair Programming",
      D: "Continuous Delivery/Deployment"
    },
    answer: "D",
    explanation: "Continuous Delivery/Deployment reduce el lead time entre commit y producción; Code Review y Pair Programming son prácticas de calidad de código, no de velocidad de despliegue."
  },
  {
    id: 39,
    category: "DevOps",
    question: "¿Qué herramienta de gestión de configuración usa 'playbooks' en YAML y no requiere agente instalado en los nodos administrados (usa SSH)?",
    options: {
      A: "Puppet",
      B: "Chef",
      C: "SaltStack (modo agente)",
      D: "Ansible"
    },
    answer: "D",
    explanation: "Ansible es agentless: usa SSH y playbooks YAML sin agente permanente; Puppet y Chef sí requieren un agente instalado en los nodos gestionados."
  },
  {
    id: 40,
    category: "DevOps",
    question: "¿Qué término describe la práctica de tratar los servidores como recursos desechables y reemplazables en vez de mantenerlos individualmente ('mascotas')?",
    options: {
      A: "Snowflake servers",
      B: "Configuration drift",
      C: "Vertical scaling",
      D: "Cattle, not pets (infraestructura inmutable)"
    },
    answer: "D",
    explanation: "\"Cattle, not pets\" promueve servidores reemplazables e inmutables; \"configuration drift\" es el problema que esta práctica busca evitar, no el nombre de la práctica en sí."
  },

  // ==========================================
  // 9. SEGURIDAD (41-45)
  // ==========================================
  {
    id: 41,
    category: "Seguridad",
    question: "¿Qué protocolo cifra el tráfico web y sustituye al HTTP inseguro?",
    options: {
      A: "FTP",
      B: "SNMP",
      C: "Telnet",
      D: "HTTPS (TLS/SSL)"
    },
    answer: "D",
    explanation: "HTTPS usa TLS/SSL para cifrar la comunicación cliente-servidor; FTP y Telnet son protocolos inseguros por defecto (sin cifrado)."
  },
  {
    id: 42,
    category: "Seguridad",
    question: "¿Qué tipo de ataque busca saturar un servicio con tráfico masivo, generalmente distribuido, para dejarlo indisponible?",
    options: {
      A: "SQL Injection",
      B: "Man-in-the-middle",
      C: "Phishing",
      D: "DDoS"
    },
    answer: "D",
    explanation: "DDoS satura recursos desde múltiples orígenes distribuidos; un ataque DoS simple (no distribuido) usa un solo origen."
  },
  {
    id: 43,
    category: "Seguridad",
    question: "¿Qué principio de seguridad establece otorgar a cada usuario o servicio solo los permisos estrictamente necesarios para su función?",
    options: {
      A: "Defensa en profundidad",
      B: "Seguridad por oscuridad",
      C: "Fail-open",
      D: "Principio de mínimo privilegio"
    },
    answer: "D",
    explanation: "El mínimo privilegio limita accesos al mínimo indispensable; la defensa en profundidad es un concepto relacionado pero distinto (capas múltiples de seguridad, no solo permisos)."
  },
  {
    id: 44,
    category: "Seguridad",
    question: "¿Qué mecanismo añade una segunda capa de verificación además de usuario y contraseña?",
    options: {
      A: "Single Sign-On (SSO) simple",
      B: "Hashing de contraseñas",
      C: "Captcha",
      D: "Autenticación de dos factores (2FA/MFA)"
    },
    answer: "D",
    explanation: "2FA/MFA exige un segundo factor además de la contraseña; el SSO simple solo centraliza la autenticación, no añade una capa adicional de verificación."
  },
  {
    id: 45,
    category: "Seguridad",
    question: "¿Qué herramienta se usa comúnmente para escaneo de vulnerabilidades en auditorías de seguridad de infraestructura?",
    options: {
      A: "Wireshark",
      B: "Ansible",
      C: "Grafana",
      D: "OpenVAS"
    },
    answer: "D",
    explanation: "OpenVAS es un escáner de vulnerabilidades de código abierto; Wireshark es un analizador de tráfico de red, no un escáner de vulnerabilidades."
  },

  // ==========================================
  // 10. LINUX / SYSADMIN (46-50)
  // ==========================================
  {
    id: 46,
    category: "Linux",
    question: "¿Qué comando de Linux muestra el uso de espacio en disco por sistema de archivos en formato legible?",
    options: {
      A: "du -h",
      B: "free -h",
      C: "lsblk -h",
      D: "df -h"
    },
    answer: "D",
    explanation: "`df -h` muestra espacio usado/disponible por sistema de archivos montado; `du -h` mide el uso de espacio de archivos/directorios específicos, no del filesystem completo."
  },
  {
    id: 47,
    category: "Linux",
    question: "¿Qué comando permite editar el crontab del usuario actual en Linux?",
    options: {
      A: "cron edit",
      B: "systemctl edit cron",
      C: "at -e",
      D: "crontab -e"
    },
    answer: "D",
    explanation: "`crontab -e` abre el editor para modificar las tareas programadas del usuario actual; `at -e` no es un comando válido de Linux."
  },
  {
    id: 48,
    category: "Linux",
    question: "¿Qué archivo contiene la configuración de los repositorios APT en sistemas Debian/Ubuntu?",
    options: {
      A: "/etc/yum.repos.d/base.repo",
      B: "/etc/apt/apt.conf",
      C: "/etc/dpkg/dpkg.cfg",
      D: "/etc/apt/sources.list"
    },
    answer: "D",
    explanation: "`/etc/apt/sources.list` define los repositorios APT en Debian/Ubuntu; `/etc/yum.repos.d/base.repo` es el equivalente en sistemas basados en RPM (RHEL/CentOS), no en Debian."
  },
  {
    id: 49,
    category: "Linux",
    question: "¿Qué demonio puede actuar simultáneamente como resolutor DNS local y servidor DHCP ligero en Linux?",
    options: {
      A: "bind9",
      B: "systemd-resolved",
      C: "unbound",
      D: "dnsmasq"
    },
    answer: "D",
    explanation: "dnsmasq combina resolución DNS y servidor DHCP ligero en un solo demonio; bind9 y unbound son solo resolutores DNS, sin funcionalidad DHCP integrada."
  },
  {
    id: 50,
    category: "Linux",
    question: "¿Qué comando muestra en tiempo real los procesos en ejecución junto con su uso de CPU y memoria?",
    options: {
      A: "ps aux (estático)",
      B: "lsof",
      C: "vmstat 1",
      D: "top / htop"
    },
    answer: "D",
    explanation: "`top`/`htop` muestran procesos en tiempo real con uso de CPU y memoria; `ps aux` es una fotografía estática del momento en que se ejecuta, no se actualiza sola."
  }
];
