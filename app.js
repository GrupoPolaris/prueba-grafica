const projects = [
  { name: "Proyecto 1", type: "residential", budget: 5000 },
  { name: "Proyecto 2", type: "commercial", budget: 12000 },
  { name: "Proyecto 3", type: "residential", budget: 8000 },
  // Aquí puedes agregar más proyectos
];

const updateFilters = () => {
  const type = document.getElementById('type').value;
  const filteredProjects = projects.filter(project => type === 'all' || project.type === type);
  
  updateProjectList(filteredProjects);
  updateChart(filteredProjects);
};

const updateProjectList = (filteredProjects) => {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';  // Limpiar la lista actual
  filteredProjects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = project.name;
    projectList.appendChild(li);
  });
};

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
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    }
  });
};

// Inicializar con todos los proyectos
updateFilters();
