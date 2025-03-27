let projects = [];

// Cargar y leer el archivo Excel
function loadExcel(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Obtener la primera hoja de trabajo (puedes ajustar según necesites)
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Aquí, asumimos que el archivo Excel tiene columnas 'Nombre', 'Tipo', 'Presupuesto'.
    projects = jsonData.map(item => ({
      name: item['Nombre'],  // Cambia el nombre de la columna si es necesario
      type: item['Tipo'],    // Cambia el nombre de la columna si es necesario
      budget: item['Presupuesto'],  // Cambia el nombre de la columna si es necesario
    }));

    // Ahora actualizamos la interfaz con los datos cargados
    updateFilters();
  };

  reader.readAsArrayBuffer(file);
}

// Actualiza los filtros (cuando cambian el select o el input range)
const updateFilters = () => {
  const type = document.getElementById('type').value;
  const budget = document.getElementById('budget').value;
  document.getElementById('budget-value').textContent = `Presupuesto: ${budget}`;
  
  // Filtramos los proyectos
  const filteredProjects = projects.filter(project => 
    (type === 'all' || project.type === type) && project.budget <= budget
  );
  
  updateProjectList(filteredProjects);
  updateChart(filteredProjects);
};

// Actualiza la lista de proyectos en la página
const updateProjectList = (filteredProjects) => {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';  // Limpiar la lista actual

  filteredProjects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - $${project.budget}`;
    projectList.appendChild(li);
  });
};

// Actualiza la gráfica con los proyectos filtrados
const updateChart = (filteredProjects) => {
  const labels = filteredProjects.map(project => project.name);
  const budgets = filteredProjects.map(project => project.budget);

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Presupuesto',
        data: budgets,
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 5
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// Inicializar con todos los proyectos si hay datos
if (projects.length > 0) {
  updateFilters();
}


