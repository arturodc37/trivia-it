import { Question } from "@/lib/types";

export const QUESTIONS: Question[] = [
  // ==========================================
  // 1. REDES Y NETWORKING (1-10)
  // ==========================================
  {
    id: 1,
    category: "Redes",
    question: "¿Qué protocolo y puerto estándar se utiliza para la navegación web segura y cifrada?",
    options: {
      A: "HTTP (Puerto 80)",
      B: "HTTPS (Puerto 443)",
      C: "SSH (Puerto 22)",
      D: "FTP (Puerto 21)"
    },
    answer: "B",
    explanation: "HTTPS utiliza TLS/SSL para cifrar el tráfico web y opera por defecto en el puerto TCP 443."
  },
  {
    id: 2,
    category: "Redes",
    question: "¿Qué servicio traduce nombres de dominio legibles por humanos (ej. google.com) en direcciones IP?",
    options: {
      A: "DHCP",
      B: "NAT",
      C: "DNS",
      D: "ARP"
    },
    answer: "C",
    explanation: "DNS (Domain Name System) funciona como la libreta de contactos de Internet traduciendo nombres a IPs."
  },
  {
    id: 3,
    category: "Redes",
    question: "¿Cuál es la dirección IP IPv4 estándar reservada para la interfaz de loopback (localhost)?",
    options: {
      A: "192.168.1.1",
      B: "10.0.0.1",
      C: "0.0.0.0",
      D: "127.0.0.1"
    },
    answer: "D",
    explanation: "127.0.0.1 es la dirección de loopback estándar en IPv4 que apunta al propio host local."
  },
  {
    id: 4,
    category: "Redes",
    question: "¿Cuál es la diferencia fundamental en la capa de transporte entre TCP y UDP?",
    options: {
      A: "TCP es orientado a conexión y garantiza entrega; UDP es sin conexión y prioriza velocidad",
      B: "UDP garantiza entrega ordenada y TCP no",
      C: "TCP solo funciona en redes locales (LAN) y UDP en Internet (WAN)",
      D: "UDP cifra automáticamente los datos y TCP no"
    },
    answer: "A",
    explanation: "TCP realiza un handshake de 3 vías y garantiza orden y entrega. UDP envía datagramas sin confirmación para baja latencia."
  },
  {
    id: 5,
    category: "Redes",
    question: "¿En qué capa del modelo OSI se realiza el enrutamiento de paquetes mediante direcciones IP?",
    options: {
      A: "Capa 2 - Enlace de Datos",
      B: "Capa 3 - Red",
      C: "Capa 4 - Transporte",
      D: "Capa 7 - Aplicación"
    },
    answer: "B",
    explanation: "La Capa de Red (Layer 3) es responsable del direccionamiento lógico e IP y el enrutamiento entre redes."
  },
  {
    id: 6,
    category: "Redes",
    question: "¿Qué protocolo asigna dinámicamente direcciones IP y parámetros de configuración a los clientes de una red?",
    options: {
      A: "DHCP",
      B: "SNMP",
      C: "BGP",
      D: "ICMP"
    },
    answer: "A",
    explanation: "DHCP (Dynamic Host Configuration Protocol) automatiza la asignación de IPs, máscaras y gateways."
  },
  {
    id: 7,
    category: "Redes",
    question: "¿Cuál es la representación compacta de la dirección IPv6 de loopback (equivalente a 127.0.0.1)?",
    options: {
      A: "0:0:0:0:0:0:0:0",
      B: "::1",
      C: "fe80::1",
      D: "ff02::1"
    },
    answer: "B",
    explanation: "En IPv6, '::1' representa la dirección de loopback local (0000:...:0001)."
  },
  {
    id: 8,
    category: "Redes",
    question: "¿Qué comando de diagnóstico de red envía mensajes ICMP Echo Request para comprobar conectividad?",
    options: {
      A: "traceroute",
      B: "netstat",
      C: "ping",
      D: "nslookup"
    },
    answer: "C",
    explanation: "El comando 'ping' utiliza paquetes ICMP Echo Request/Reply para verificar si un host está accesible y medir latencia."
  },
  {
    id: 9,
    category: "Redes",
    question: "¿Qué rango comprende los 'Well-Known Ports' (puertos bien conocidos reservados por la IANA)?",
    options: {
      A: "0 a 1023",
      B: "1024 a 49151",
      C: "49152 a 65535",
      D: "1 a 255"
    },
    answer: "A",
    explanation: "Los puertos del 0 al 1023 están reservados para servicios de sistema y protocolos estándar (HTTP, SSH, SMTP, etc.)."
  },
  {
    id: 10,
    category: "Redes",
    question: "¿Qué concepto define el tamaño máximo en bytes de un paquete que puede transmitirse en una interfaz de red sin fragmentarse?",
    options: {
      A: "TTL (Time to Live)",
      B: "MTU (Maximum Transmission Unit)",
      C: "Bandwidth",
      D: "Jitter"
    },
    answer: "B",
    explanation: "MTU (Maximum Transmission Unit) suele ser de 1500 bytes en redes Ethernet estándar."
  },

  // ==========================================
  // 2. BASES DE DATOS (11-20)
  // ==========================================
  {
    id: 11,
    category: "Bases de Datos",
    question: "¿Qué comando SQL se utiliza para eliminar filas existentes de una tabla cumpliendo una condición?",
    options: {
      A: "REMOVE FROM",
      B: "DROP ROWS",
      C: "DELETE FROM",
      D: "TRUNCATE"
    },
    answer: "C",
    explanation: "DELETE FROM tabla WHERE condición elimina registros específicos permitiendo transacciones reversibles (rollback)."
  },
  {
    id: 12,
    category: "Bases de Datos",
    question: "¿Qué tipo de cláusula JOIN retorna únicamente las filas que tienen valores coincidentes en ambas tablas?",
    options: {
      A: "LEFT JOIN",
      B: "FULL OUTER JOIN",
      C: "CROSS JOIN",
      D: "INNER JOIN"
    },
    answer: "D",
    explanation: "INNER JOIN filtra y devuelve solo la intersección donde la clave foránea y primaria coinciden."
  },
  {
    id: 13,
    category: "Bases de Datos",
    question: "¿Qué significan las siglas ACID en el contexto de transacciones en bases de datos relacionales?",
    options: {
      A: "Atomicity, Consistency, Isolation, Durability",
      B: "Async, Concurrency, Indexing, Data",
      C: "Availability, Consistency, Integrity, Delivery",
      D: "Access, Control, Identification, Distribution"
    },
    answer: "A",
    explanation: "ACID garantiza que las transacciones sean Atómicas, Consistentes, Aisladas y Durables."
  },
  {
    id: 14,
    category: "Bases de Datos",
    question: "¿Qué tipo de base de datos NoSQL es Redis?",
    options: {
      A: "Orientada a Grafos",
      B: "Clave-Valor en memoria (In-Memory Key-Value)",
      C: "Columnares anchas (Wide-Column)",
      D: "Relacional pura"
    },
    answer: "B",
    explanation: "Redis es una base de datos NoSQL clave-valor ultra rápida que opera en memoria RAM."
  },
  {
    id: 15,
    category: "Bases de Datos",
    question: "¿Para qué sirve principalmente crear un ÍNDICE (Index) en una columna de una base de datos?",
    options: {
      A: "Para encriptar los datos de esa columna",
      B: "Para acelerar la velocidad de búsqueda y consultas (SELECT)",
      C: "Para reducir el espacio en disco",
      D: "Para permitir valores nulos automáticamente"
    },
    answer: "B",
    explanation: "Los índices (como B-Trees) permiten encontrar registros en tiempo logarítmico O(log n) en lugar de escaneos completos O(n)."
  },
  {
    id: 16,
    category: "Bases de Datos",
    question: "¿Qué significa el acrónimo ORM en desarrollo de software y persistencia?",
    options: {
      A: "Object-Relational Mapping",
      B: "Online Resource Management",
      C: "Operational Relational Model",
      D: "Optimized Record Migration"
    },
    answer: "A",
    explanation: "Un ORM (como Prisma, Hibernate, Entity Framework) mapea tablas relacionales a objetos del lenguaje de programación."
  },
  {
    id: 17,
    category: "Bases de Datos",
    question: "¿Qué cláusula SQL se utiliza para combinar registros que tienen valores idénticos y aplicar funciones de agregación como COUNT() o SUM()?",
    options: {
      A: "ORDER BY",
      B: "PARTITION",
      C: "GROUP BY",
      D: "HAVING ONLY"
    },
    answer: "C",
    explanation: "GROUP BY agrupa filas con valores idénticos para procesar agregaciones (SUM, AVG, COUNT)."
  },
  {
    id: 18,
    category: "Bases de Datos",
    question: "¿Qué diferencia a TRUNCATE TABLE de DELETE FROM en SQL?",
    options: {
      A: "TRUNCATE es una operación DDL más rápida que elimina todas las filas sin registrar cada borrado individual",
      B: "DELETE no permite cláusula WHERE y TRUNCATE sí",
      C: "TRUNCATE borra también la estructura y definición de la tabla",
      D: "DELETE resetea los contadores AUTO_INCREMENT y TRUNCATE no"
    },
    answer: "A",
    explanation: "TRUNCATE desasigna las páginas de datos completas (DDL), siendo mucho más rápido pero no admite WHERE ni disparadores fila por fila."
  },
  {
    id: 19,
    category: "Bases de Datos",
    question: "¿Qué modelo de datos utiliza MongoDB para almacenar sus registros?",
    options: {
      A: "Filas y columnas estrictas",
      B: "Documentos flexibles tipo BSON / JSON",
      C: "Tablas hash puras en disco",
      D: "Nodos y aristas RDF"
    },
    answer: "B",
    explanation: "MongoDB almacena información en documentos BSON (Binary JSON) organizados en colecciones sin esquema rígido."
  },
  {
    id: 20,
    category: "Bases de Datos",
    question: "¿Qué restricción (constraint) de base de datos asegura que todos los valores en una columna sean diferentes?",
    options: {
      A: "FOREIGN KEY",
      B: "NOT NULL",
      C: "UNIQUE",
      D: "CHECK DEFAULT"
    },
    answer: "C",
    explanation: "El constraint UNIQUE garantiza que no existan dos filas con el mismo valor en dicha columna."
  },

  // ==========================================
  // 3. PROGRAMACIÓN & ALGORITMOS (21-30)
  // ==========================================
  {
    id: 21,
    category: "Programación",
    question: "¿Qué patrón de diseño creacional restringe la instanciación de una clase a una única instancia global?",
    options: {
      A: "Factory Pattern",
      B: "Observer Pattern",
      C: "Singleton Pattern",
      D: "Adapter Pattern"
    },
    answer: "C",
    explanation: "Singleton asegura que una clase tenga una sola instancia y proporciona un punto de acceso global a ella."
  },
  {
    id: 22,
    category: "Programación",
    question: "¿Qué estructura de datos opera bajo el principio LIFO (Last In, First Out)?",
    options: {
      A: "Queue (Cola)",
      B: "Stack (Pila)",
      C: "Array (Arreglo)",
      D: "LinkedList (Lista Enlazada)"
    },
    answer: "B",
    explanation: "Stack o Pila inserta (push) y extrae (pop) elementos por el tope siguiendo LIFO (el último en entrar es el primero en salir)."
  },
  {
    id: 23,
    category: "Programación",
    question: "¿Cuál es la complejidad temporal en el peor y caso promedio de la Búsqueda Binaria sobre un array ordenado?",
    options: {
      A: "O(n)",
      B: "O(1)",
      C: "O(n log n)",
      D: "O(log n)"
    },
    answer: "D",
    explanation: "La búsqueda binaria divide a la mitad el espacio de búsqueda en cada iteración, logrando una complejidad O(log n)."
  },
  {
    id: 24,
    category: "Programación",
    question: "¿Qué significa el principio de desarrollo de software 'DRY'?",
    options: {
      A: "Don't Repeat Yourself",
      B: "Deploy Rapidly Yearly",
      C: "Data Redundancy Yield",
      D: "Design Reliable Yields"
    },
    answer: "A",
    explanation: "DRY ('No te repitas') promueve la reutilización de lógica y evitar duplicación de código en un sistema."
  },
  {
    id: 25,
    category: "Programación",
    question: "¿Qué lenguaje de programación de sistemas fue creado originalmente por Dennis Ritchie para implementar el sistema operativo UNIX?",
    options: {
      A: "Bjarne C++",
      B: "Lenguaje C",
      C: "Assembly x86",
      D: "Pascal"
    },
    answer: "B",
    explanation: "Dennis Ritchie desarrolló C en los laboratorios Bell entre 1969 y 1973 para reescribir el kernel de UNIX."
  },
  {
    id: 26,
    category: "Programación",
    question: "¿Qué ocurre conceptualmente cuando una función recursiva no tiene o nunca alcanza una condición base (base case)?",
    options: {
      A: "Memory Leak en disco",
      B: "Stack Overflow (Desbordamiento de pila)",
      C: "Deadlock en CPU",
      D: "Null Pointer Exception"
    },
    answer: "B",
    explanation: "Las llamadas a funciones consumen frames en el call stack hasta agotar el límite de memoria asignado (Stack Overflow)."
  },
  {
    id: 27,
    category: "Programación",
    question: "¿Cuál es la complejidad temporal promedio de los algoritmos de ordenación más eficientes basados en comparación (como QuickSort o MergeSort)?",
    options: {
      A: "O(n²)",
      B: "O(n)",
      C: "O(n log n)",
      D: "O(2ⁿ)"
    },
    answer: "C",
    explanation: "Matemáticamente, ningún algoritmo de ordenamiento por comparación puede ser más rápido que O(n log n) en el caso general."
  },
  {
    id: 28,
    category: "Programación",
    question: "¿Qué tipo de tipado tiene TypeScript en comparación con JavaScript vanilla?",
    options: {
      A: "JavaScript es estático y TypeScript es dinámico",
      B: "TypeScript añade un sistema de tipos estático y opcional que se compila a JavaScript",
      C: "TypeScript es un lenguaje puramente interpretado sin chequeo previo",
      D: "TypeScript solo funciona en entornos de servidor con Node"
    },
    answer: "B",
    explanation: "TypeScript es un superset tipado de JavaScript que detecta errores en tiempo de compilación y emite JS estándar."
  },
  {
    id: 29,
    category: "Programación",
    question: "¿Qué método HTTP según la convención REST debe ser idempotente y se usa para actualizar completamente un recurso existente?",
    options: {
      A: "POST",
      B: "PUT",
      C: "PATCH",
      D: "CONNECT"
    },
    answer: "B",
    explanation: "PUT reemplaza por completo el recurso y es idempotente (múltiples llamadas idénticas producen el mismo resultado en el servidor)."
  },
  {
    id: 30,
    category: "Programación",
    question: "¿Qué estructura de datos no lineal está compuesta por nodos conectados mediante aristas sin ciclos cerrados?",
    options: {
      A: "Árbol (Tree)",
      B: "Grafo cíclico",
      C: "Hash Table",
      D: "Matriz densa"
    },
    answer: "A",
    explanation: "Un árbol es un grafo acíclico y conectado con un nodo raíz y relaciones padre-hijo."
  },

  // ==========================================
  // 4. CLOUD & DEVOPS (31-40)
  // ==========================================
  {
    id: 31,
    category: "Cloud & DevOps",
    question: "¿Qué significan las siglas CI/CD en la cultura y automatización DevOps?",
    options: {
      A: "Continuous Integration / Continuous Delivery (or Deployment)",
      B: "Cloud Infrastructure / Cloud Development",
      C: "Code Inspection / Code Distribution",
      D: "Centralized Interface / Centralized Database"
    },
    answer: "A",
    explanation: "CI/CD es la práctica de integrar código frecuentemente y desplegarlo automáticamente a entornos de staging/producción."
  },
  {
    id: 32,
    category: "Cloud & DevOps",
    question: "¿Cuál es la principal ventaja de los contenedores Docker frente a las Máquinas Virtuales tradicionales?",
    options: {
      A: "Los contenedores comparten el kernel del SO anfitrión, siendo mucho más ligeros y rápidos de iniciar",
      B: "Los contenedores emulan hardware físico completo mediante hipervisores Type 1",
      C: "Los contenedores no requieren memoria RAM",
      D: "Los contenedores solo pueden ejecutar código en Java"
    },
    answer: "A",
    explanation: "Docker virtualiza a nivel de sistema operativo compartiendo el kernel, lo que ahorra gigabytes de overhead por instancia."
  },
  {
    id: 33,
    category: "Cloud & DevOps",
    question: "¿Qué plataforma de código abierto originada en Google es el estándar de facto para la orquestación y escalado de contenedores?",
    options: {
      A: "Terraform",
      B: "Kubernetes (K8s)",
      C: "Ansible",
      D: "Puppet"
    },
    answer: "B",
    explanation: "Kubernetes gestiona el despliegue, escalado automático, balanceo de carga y auto-recuperación de contenedores."
  },
  {
    id: 34,
    category: "Cloud & DevOps",
    question: "¿Qué modelo de servicio en la nube proporciona máquinas virtuales, redes y almacenamiento bajo demanda (ej. AWS EC2, Azure VMs)?",
    options: {
      A: "SaaS (Software as a Service)",
      B: "PaaS (Platform as a Service)",
      C: "IaaS (Infrastructure as a Service)",
      D: "FaaS (Function as a Service)"
    },
    answer: "C",
    explanation: "IaaS entrega infraestructura computacional fundamental administrada por el proveedor."
  },
  {
    id: 35,
    category: "Cloud & DevOps",
    question: "¿Qué herramienta líder de Infraestructura como Código (IaC) utiliza archivos declarativos con extensión '.tf' y lenguaje HCL?",
    options: {
      A: "Terraform",
      B: "Chef",
      C: "CloudFormation puro",
      D: "Vagrant"
    },
    answer: "A",
    explanation: "Terraform (de HashiCorp) permite definir y aprovisionar infraestructura multi-cloud mediante archivos declarativos .tf."
  },
  {
    id: 36,
    category: "Cloud & DevOps",
    question: "¿Qué comando de Git crea y se cambia inmediatamente a una nueva rama local?",
    options: {
      A: "git branch --make <nombre>",
      B: "git checkout -b <nombre>  (o git switch -c <nombre>)",
      C: "git merge --new <nombre>",
      D: "git commit -b <nombre>"
    },
    answer: "B",
    explanation: "'git checkout -b' o 'git switch -c' crea la rama y posiciona HEAD sobre ella en un solo paso."
  },
  {
    id: 37,
    category: "Cloud & DevOps",
    question: "¿Qué servicio de almacenamiento de objetos ultra escalable ofrece Amazon Web Services para guardar archivos estáticos y backups?",
    options: {
      A: "AWS EBS",
      B: "AWS S3 (Simple Storage Service)",
      C: "AWS RDS",
      D: "AWS DynamoDB"
    },
    answer: "B",
    explanation: "Amazon S3 es el servicio de almacenamiento de objetos con 99.999999999% (11 nueves) de durabilidad."
  },
  {
    id: 38,
    category: "Cloud & DevOps",
    question: "¿Qué significa SLA en contratos de servicios de computación en la nube?",
    options: {
      A: "Service Level Agreement (Acuerdo de Nivel de Servicio)",
      B: "System Latency Architecture",
      C: "Server Load Allocation",
      D: "Secure Layer Authentication"
    },
    answer: "A",
    explanation: "Un SLA estipula el porcentaje de disponibilidad garantizada (ej. 99.99% uptime) y penalizaciones si no se cumple."
  },
  {
    id: 39,
    category: "Cloud & DevOps",
    question: "¿Qué arquitectura en la nube ejecuta funciones individuales en respuesta a eventos sin que el desarrollador gestione servidores?",
    options: {
      A: "Monolítica On-Premise",
      B: "Serverless / FaaS (ej. AWS Lambda, Cloudflare Workers)",
      C: "Cluster Bare-Metal",
      D: "Mainframe Storage"
    },
    answer: "B",
    explanation: "Serverless escala automáticamente a cero cuando no hay peticiones y cobra estrictamente por milisegundos de ejecución."
  },
  {
    id: 40,
    category: "Cloud & DevOps",
    question: "¿Qué componente de red distribuye el tráfico entrante de manera equitativa entre múltiples servidores para evitar saturaciones?",
    options: {
      A: "Balanceador de Carga (Load Balancer)",
      B: "Switch de Acceso",
      C: "Proxy SOCKS",
      D: "DNS Resolver"
    },
    answer: "A",
    explanation: "Un Load Balancer distribuye las peticiones entre instancias backend saludables según algoritmos como Round Robin o Least Connections."
  },

  // ==========================================
  // 5. CIBERSEGURIDAD (41-50)
  // ==========================================
  {
    id: 41,
    category: "Ciberseguridad",
    question: "¿Qué tipo de vulnerabilidad ocurre cuando una aplicación interpreta entrada de usuario no sanitizada como comandos directos de base de datos?",
    options: {
      A: "Cross-Site Scripting (XSS)",
      B: "SQL Injection (SQLi)",
      C: "Buffer Overflow",
      D: "Man-in-the-Middle (MitM)"
    },
    answer: "B",
    explanation: "SQL Injection permite a atacantes manipular consultas concatenadas para eludir autenticaciones o extraer datos."
  },
  {
    id: 42,
    category: "Ciberseguridad",
    question: "¿Qué significa el ataque XSS (Cross-Site Scripting)?",
    options: {
      A: "Inyección de scripts maliciosos (generalmente JavaScript) en páginas web vistas por otros usuarios",
      B: "Cifrado no autorizado de discos duros para pedir rescate",
      C: "Sobrecarga de servidores DNS con consultas masivas",
      D: "Intercepción de cables submarinos de fibra óptica"
    },
    answer: "A",
    explanation: "XSS permite ejecutar código JS en el navegador de la víctima para robar cookies de sesión o suplantar su identidad."
  },
  {
    id: 43,
    category: "Ciberseguridad",
    question: "¿Cuál es la diferencia principal entre el cifrado Simétrico y el Asimétrico?",
    options: {
      A: "Simétrico usa la misma clave para cifrar y descifrar; Asimétrico usa un par de claves (pública y privada)",
      B: "Simétrico solo se usa en hardware y Asimétrico en software",
      C: "Asimétrico es vulnerable a ataques de fuerza bruta y Simétrico no",
      D: "Simétrico siempre requiere conexión a Internet"
    },
    answer: "A",
    explanation: "En cifrado simétrico (AES) la clave es compartida. En asimétrico (RSA, ECC), la pública cifra y la privada descifra."
  },
  {
    id: 44,
    category: "Ciberseguridad",
    question: "¿Qué es un ataque DDoS (Distributed Denial of Service)?",
    options: {
      A: "Un ataque que inunda un servicio con tráfico proveniente de múltiples fuentes comprometidas (botnets) para saturarlo",
      B: "El robo físico de servidores en un centro de datos",
      C: "La alteración de firmas criptográficas en correos",
      D: "La decodificación de contraseñas mediante tablas arcoíris"
    },
    answer: "A",
    explanation: "DDoS busca agotar el ancho de banda, CPU o conexiones del servidor usando miles de dispositivos zombies para dejarlo inaccesible."
  },
  {
    id: 45,
    category: "Ciberseguridad",
    question: "¿Qué técnica de ingeniería social consiste en enviar correos o mensajes fraudulentos haciéndose pasar por una entidad de confianza?",
    options: {
      A: "Phishing",
      B: "Ransomware",
      C: "Spyware",
      D: "Rootkit"
    },
    answer: "A",
    explanation: "El Phishing busca engañar a las víctimas para que revelen credenciales, números de tarjeta o descarguen malware."
  },
  {
    id: 46,
    category: "Ciberseguridad",
    question: "¿Qué significa MFA / 2FA en el control de acceso y autenticación?",
    options: {
      A: "Multi-Factor Authentication (Autenticación de Múltiples Factores)",
      B: "Main Firewall Architecture",
      C: "Master File Allocation",
      D: "Managed Fast Access"
    },
    answer: "A",
    explanation: "MFA exige verificar al menos 2 factores independientes: algo que sabes (password), algo que tienes (móvil/token), o algo que eres (biometría)."
  },
  {
    id: 47,
    category: "Ciberseguridad",
    question: "¿Qué es una vulnerabilidad 'Zero-Day' (Día Cero)?",
    options: {
      A: "Una vulnerabilidad recién descubierta para la cual aún no existe un parche oficial del fabricante",
      B: "Un virus que solo actúa el primer día del mes",
      C: "Un certificado SSL que caducó hace 0 días",
      D: "Un fallo de hardware que se repara automáticamente"
    },
    answer: "A",
    explanation: "Zero-day indica que los desarrolladores han tenido 'cero días' para corregir la falla desde que se conoció públicamente o fue explotada."
  },
  {
    id: 48,
    category: "Ciberseguridad",
    question: "¿Qué algoritmo criptográfico unidireccional y función hash es el estándar moderno seguro recomendado (a diferencia del obsoleto MD5)?",
    options: {
      A: "SHA-256 (familia SHA-2)",
      B: "MD5",
      C: "ROT13",
      D: "DES"
    },
    answer: "A",
    explanation: "SHA-256 genera un hash de 256 bits resistente a colisiones y es la base de TLS, Bitcoin y firmas digitales modernas."
  },
  {
    id: 49,
    category: "Ciberseguridad",
    question: "¿Qué significa el principio de 'Mínimo Privilegio' (Principle of Least Privilege)?",
    options: {
      A: "Otorgar a usuarios y procesos solo los accesos y permisos estrictamente indispensables para su labor",
      B: "Crear una única cuenta de superusuario para todo el equipo",
      C: "Prohibir el uso de contraseñas de más de 8 caracteres",
      D: "Permitir acceso anónimo a todas las APIs internas"
    },
    answer: "A",
    explanation: "Limitar los privilegios minimiza el daño potencial en caso de que una cuenta o servicio sea comprometido."
  },
  {
    id: 50,
    category: "Ciberseguridad",
    question: "¿Qué es el 'Ransomware'?",
    options: {
      A: "Malware que secuestra y cifra los archivos de la víctima exigiendo un rescate económico para su recuperación",
      B: "Un software gratuito para acelerar la conexión a Internet",
      C: "Un escáner de puertos de código abierto",
      D: "Un protocolo para compartir archivos peer-to-peer"
    },
    answer: "A",
    explanation: "El Ransomware cifra los sistemas de organizaciones o usuarios y extorsiona exigiendo pagos comúnmente en criptomonedas."
  }
];
