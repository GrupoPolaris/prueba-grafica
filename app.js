let projects = [];
let filteredProjects = [];

// Cargar y leer el archivo Excel
function loadExcel(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    projects = jsonData.map(item => ({
      title: item['Título'],  
      year: item['Año'],    
      region: item['Comunidad Autónoma'],  
      funding: item['Financiación'], 
      ip: item['IP 1'],  
      university: item['Universidad']
    }));

    // Inicializar los filtros
    initializeFilters();
    updateFilters();
  };

  reader.readAsArrayBuffer(file);
}

// Inicializar los filtros
function initializeFilters() {
  const years = [...new Set(projects.map(project => project.year))];
  const regions = [...new Set(projects.map(project => project.region))];

  const yearSelect = document.getElementById('year');
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  const regionSelect = document.getElementById('region');
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });
}

// Aplicar los filtros
function updateFilters() {
  const titleFilter = document.getElementById('title').value.toLowerCase();
  const yearFilter = document.getElementById('year').value;
  const regionFilter = document.getElementById('region').value;
  const fundingFilter = document.getElementById('funding').value;
  const ipFilter = document.getElementById('ip').value.toLowerCase();

  filteredProjects = projects.filter(project => {
    return (
      (titleFilter === '' || project.title.toLowerCase().includes(titleFilter)) &&
      (yearFilter === 'all' || project.year === yearFilter) &&
      (regionFilter === 'all' || project.region === regionFilter) &&
      (fundingFilter === '' || project.funding >= fundingFilter) &&
      (ipFilter === '' || project.ip.toLowerCase().includes(ipFilter))
    );
  });

  updateTable();
}

// Actualizar la tabla de resultados
function updateTable() {
  const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  let totalFunding = 0;
  let universities = new Set();

  filteredProjects.forEach(project => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${project.title}</td>
      <td>${project.year}</td>
      <td>${project.region}</td>
      <td>${project.funding} €</td>
      <td>${project.ip}</td>
      <td>${project.university}</td>
    `;
    tableBody.appendChild(row);

    totalFunding += project.funding;
    universities.add(project.university);
  });

  document.getElementById('totalFunding').textContent = totalFunding;
  document.getElementById('universitiesList').textContent = Array.from(universities).join(', ') || 'Ninguna';
}
