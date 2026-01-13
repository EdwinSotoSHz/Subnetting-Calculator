# 📡 Calculadora de Subnetting - FLSM y VLSM

Una herramienta web para calcular subredes IPv4 utilizando métodos **FLSM** (Longitud Fija) y **VLSM** (Longitud Variable). Ideal para estudiantes de redes, administradores de sistemas y profesionales de TI.

## 🚀 Características

### 🔧 **FLSM (Fixed Length Subnet Mask)**
- Subnetting de longitud fija
- Todas las subredes con la misma máscara
- Mismo número de hosts por subred
- Ideal para redes con necesidades uniformes

### 🎯 **VLSM (Variable Length Subnet Mask)**
- Subnetting de longitud variable
- Mascarás diferentes según necesidades de hosts
- Optimización del espacio IP
- Ordenamiento automático de mayor a menor

### 🎨 **Interfaz y Funcionalidades**
- **Modo binario**: Visualización de direcciones IP en formato binario
- **Nombres personalizados**: Asignación de nombres a cada subred
- **Diseño responsive**: Compatible con dispositivos móviles
- **Fondo animado**: Efectos visuales con canvas
- **Resultados detallados**: Tablas completas con toda la información

## 📊 Tabla Comparativa

| Característica | FLSM | VLSM |
|----------------|------|------|
| Tipo de máscara | Fija | Variable |
| Optimización | Baja | Alta |
| Complejidad | Simple | Moderada |
| Uso típico | Redes pequeñas | Redes grandes |
| Flexibilidad | Limitada | Alta |

## 🏗️ Estructura del Proyecto

```
📦 Subnetting-Calculator/
├── 📄 index.html              # Página principal
├── 📄 flsm-calculator.html    # Calculadora FLSM
├── 📄 vlsm-calculator.html    # Calculadora VLSM
├── 📂 css/
│   └── style.css             # Estilos principales
├── 📂 js/
│   ├── backgroud.js          # Animaciones de fondo
│   ├── flsmCalculator.js     # Lógica FLSM (compilado)
│   └── vlsmCalculator.js     # Lógica VLSM (compilado)
├── 📂 ts/
│   ├── flsmCalculator.ts     # Código TypeScript FLSM
│   ├── vlsmCalculator.ts     # Código TypeScript VLSM
│   └── IPv4Utils.ts          # Utilidades IPv4
├── 📂 img/
│   └── icon.ico              # Favicon del sitio
└── 📄 README.md              # Este archivo
```

## 🔍 Componentes Técnicos

### 📐 **IPv4Utils (Core)**
- Conversión IPv4 ↔ Uint32
- Cálculo de máscaras de subred
- Determinación de broadcast
- Conversión a binario
- Manipulación de direcciones IP

### 🧮 **Algoritmos Implementados**

#### Para FLSM:
1. Cálculo de bits prestados: `n = ceil(log₂(subredes))`
2. Nuevo prefijo: `prefijo_base + n`
3. Máscara común para todas las subredes

#### Para VLSM:
1. Ordenamiento descendente de hosts requeridos
2. Cálculo individual de bits por subred: `n = j - ceil(log₂(hosts+2))`
3. Asignación óptima evitando superposición

## 🖥️ Uso

### Configuración Básica
1. **FLSM Calculator**:
   - Ingresar dirección IP base
   - Especificar prefijo inicial
   - Definir número de subredes requeridas

2. **VLSM Calculator**:
   - Ingresar dirección IP base
   - Especificar prefijo inicial
   - Listar hosts requeridos (separados por comas)

### Opciones Avanzadas
- ✅ **Salida Binaria**: Ver direcciones en formato binario
- ✅ **Nombre de Subredes**: Personalizar nombres para cada subred
- 🔄 **Orden Automático**: VLSM ordena hosts de mayor a menor

## 🎯 Casos de Uso

### Educativo
- Aprendizaje de conceptos de subnetting
- Verificación de cálculos manuales
- Visualización de resultados en diferentes formatos

### Profesional
- Planeación de redes empresariales
- Optimización de direcciones IP
- Documentación de esquemas de red

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsive
- **TypeScript**: Tipado estático y modularidad
- **JavaScript**: Interactividad y lógica
- **Canvas API**: Animaciones de fondo

## 📈 Resultados

Cada calculadora genera una tabla completa que incluye:
- ID de red y dirección de broadcast
- Rango de direcciones utilizables
- Máscara de subred y prefijo
- Número de hosts disponibles
- (Opcional) Representación binaria

## 💡 Consejos de Uso

1. **Para FLSM**: Use cuando todas las subredes necesiten el mismo número de hosts
2. **Para VLSM**: Ideal cuando las subredes tienen necesidades diferentes
3. **Optimización**: VLSM aprovecha mejor el espacio de direcciones
4. **Verificación**: Compare resultados con cálculos manuales para aprendizaje

---

**Nota**: Esta herramienta es educativa. Para redes críticas, verifique los cálculos con herramientas profesionales y considere todos los aspectos de diseño de red.