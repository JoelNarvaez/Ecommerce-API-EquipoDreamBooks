/* ============================================================================
   VARIABLES GLOBALES DE LAS GRÁFICAS
============================================================================ */
let chartPedidos   = null;
let chartIngresos  = null;
let chartExistencias = null;


/* ============================================================================
   GRAFICA 1 — PEDIDOS TOTALES (RadialBar)
============================================================================ */
async function generarGraficaPedidos() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/admin/pedidos", {
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    if (!data.ok) return;

    const totalPedidos = data.pedidos.length;

    const opciones = {
      chart: {
        type: "radialBar",
        height: 320,
        sparkline: { enabled: true }
      },

      series: [totalPedidos],

      colors: ["#0072ff"],

      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          gradientToColors: ["#27aeef"],
          stops: [0, 100]
        }
      },

      plotOptions: {
        radialBar: {
          hollow: {
            size: "62%",
            background: "#f6f7f9"
          },
          track: {
            background: "#ececec",
            strokeWidth: "90%"
          },
          dataLabels: {
            name: {
              offsetY: 22,
              color: "#333",
              fontSize: "15px",
              formatter: () => "Pedidos Totales"
            },
            value: {
              offsetY: -12,
              color: "#000",
              fontSize: "34px",
              fontWeight: "700",
              formatter: function () {
                return totalPedidos;
              }
            }
          }
        }
      },

      stroke: {
        lineCap: "round"
      }
    };

    if (chartPedidos) chartPedidos.destroy();

    chartPedidos = new ApexCharts(
      document.querySelector("#chart-pedidos"),
      opciones
    );

    chartPedidos.render();

    actualizarKpiPedidos(totalPedidos);

  } catch (error) {
    console.error("Error generando gráfica de pedidos:", error);
  }
}


function actualizarKpiPedidos(total) {
  const promEl  = document.getElementById("kpi-ped-prom");
  const trendEl = document.getElementById("kpi-ped-trend");

  if (promEl) {
    promEl.textContent = Math.max(1, Math.round(total / 7)) + " por día";
  }

  if (trendEl) {
    if (total >= 15) {
      trendEl.textContent = "↑ Subiendo";
      trendEl.className   = "kpi-up";
    } else {
      trendEl.textContent = "↓ Estable";
      trendEl.className   = "kpi-down";
    }
  }
}


/* ============================================================================
   GRAFICA 2 — INGRESOS (Área moderna)
============================================================================ */
async function generarGraficaIngresos() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/admin/ingresos", {
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    console.log("Respuesta /ingresos:", data);

    const info = data.ingresos || {};

    const historial = Array.isArray(info.historial) ? info.historial : [];

    // Serie de datos
    const serie = historial.length
      ? historial.map(r => Number(r.total || 0))
      : [0];

    // Etiquetas eje X (Día 1, Día 2, ...)
    const labels = historial.length
      ? historial.map(r => `Día ${r.dia}`)
      : ["Sin datos"];

    // Promedio
    let promedio = Number(info.promedio);
    if (!Number.isFinite(promedio)) {
      const suma = serie.reduce((acc, v) => acc + v, 0);
      promedio = serie.length ? suma / serie.length : 0;
    }

    // Tendencia
    let tendencia = Number(info.tendencia);
    if (!Number.isFinite(tendencia) && serie.length >= 2) {
      tendencia = serie[serie.length - 1] - serie[serie.length - 2];
    }
    if (!Number.isFinite(tendencia)) tendencia = 0;

    const opciones = {
      chart: {
        type: "area",
        height: 300,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      series: [{
        name: "Ingresos del mes",
        data: serie
      }],
      xaxis: {
        categories: labels,
        labels: {
          style: {
            fontSize: "11px",
            colors: "#666"
          }
        }
      },
      colors: ["#0f9d58"],
      stroke: {
        width: 3,
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      markers: {
        size: 4,
        colors: ["#ffffff"],
        strokeColors: ["#0f9d58"],
        strokeWidth: 2
      },
      tooltip: {
        y: {
          formatter: (val) =>
            "$" + Number(val).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
        }
      }
    };

    if (chartIngresos) {
      chartIngresos.destroy();
    }

    chartIngresos = new ApexCharts(
      document.querySelector("#chart-ingresos"),
      opciones
    );

    chartIngresos.render();
    actualizarKpiIngresos(promedio, tendencia);

  } catch (error) {
    console.error("Error generando gráfica de ingresos:", error);
  }
}

function actualizarKpiIngresos(promedio, tendencia) {
  const promEl  = document.getElementById("kpi-ing-prom");
  const trendEl = document.getElementById("kpi-ing-trend");

  if (promEl) {
    promEl.textContent = "$" + (promedio || 0).toFixed(2);
  }

  if (!trendEl) return;

  if (tendencia >= 0) {
    trendEl.textContent = `↑ +$${tendencia.toFixed(2)}`;
    trendEl.className   = "kpi-up";
  } else {
    trendEl.textContent = `↓ $${tendencia.toFixed(2)}`;
    trendEl.className   = "kpi-down";
  }
}


/* ============================================================================
   GRAFICA 3 — EXISTENCIAS POR CATEGORÍA (Barra PRO)
============================================================================ */
async function generarGraficaExistencias() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    if (!data.ok) return;

    let categoriasObj = data.categorias || {};

    // Si viene como array [{nombre, cantidad}] lo convertimos a objeto plano
    if (Array.isArray(categoriasObj)) {
      categoriasObj = Object.fromEntries(
        categoriasObj.map(c => [c.nombre, c.cantidad])
      );
    }

    const labels = Object.keys(categoriasObj);
    const valores = Object.values(categoriasObj).map(v => Number(v) || 0);

    if (!labels.length) {
      if (chartExistencias) chartExistencias.destroy();
      const maxEl = document.getElementById("kpi-stock-max");
      const totEl = document.getElementById("kpi-stock-total");
      if (maxEl) maxEl.textContent = "—";
      if (totEl) totEl.textContent = "—";
      return;
    }

    const palette = [
      "#4a90e2", "#50e3c2", "#f5a623",
      "#bd10e0", "#7ed321", "#f8e71c"
    ];

    const colores = labels.map((_, i) => palette[i % palette.length]);

    const opciones = {
      chart: {
        type: "bar",
        height: 320,
        toolbar: { show: false }
      },
      series: [{
        name: "Stock disponible",
        data: valores
      }],
      xaxis: {
        categories: labels,
        labels: {
          style: {
            fontSize: "12px",
            colors: "#666"
          }
        },
        axisBorder: { show: false },
        axisTicks:  { show: false }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "11px",
            colors: "#999"
          }
        }
      },
      grid: {
        borderColor: "rgba(0,0,0,0.04)",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } }
      },
      colors: colores,
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: true,
          columnWidth: "45%",
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        offsetY: -18,
        style: {
          fontSize: "12px",
          colors: ["#111"]
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} libros`
        }
      },
      legend: {
        show: false
      }
    };

    if (chartExistencias) {
      chartExistencias.destroy();
    }

    chartExistencias = new ApexCharts(
      document.querySelector("#chart-existencias"),
      opciones
    );

    chartExistencias.render();
    actualizarKpiExistencias(categoriasObj);

  } catch (error) {
    console.error("Error generando gráfica de existencias:", error);
  }
}


/* ============================================================================
   KPI — EXISTENCIAS
============================================================================ */
function actualizarKpiExistencias(categoriasObj) {
  const entries = Object.entries(categoriasObj);

  const maxEl = document.getElementById("kpi-stock-max");
  const totEl = document.getElementById("kpi-stock-total");

  if (!entries.length) {
    if (maxEl) maxEl.textContent = "—";
    if (totEl) totEl.textContent = "—";
    return;
  }

  const ordenadas = entries
    .slice()
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  const [nombreMax, valorMax] = ordenadas[0];

  const total = entries.reduce(
    (sum, [, v]) => sum + Number(v || 0),
    0
  );

  if (maxEl) {
    maxEl.textContent = `${nombreMax} (${valorMax})`;
  }

  if (totEl) {
    totEl.textContent = total;
  }
}

