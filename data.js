// ===== СИСТЕМА УПРАВЛЕНИЯ ПРИНТЕРАМИ =====

// Инициализация данных
function initPrintersData() {
  if (!localStorage.getItem('printers')) {
    const defaultPrinters = {
      "printer1": {
        id: "printer1",
        name: "Принтер 1",
        model: "Bambu Lab A1",
        status: "idle",
        color: "red",
        progress: 0,
        currentPrint: null,
        printName: "",
        totalSeconds: 0,
        startTime: 0,
        savedPercent: 0,
        problem: "нет",
        image: "foto/1.png",
        finishedNotified: false,
        lastUpdate: Date.now()
      },
      "printer2": {
        id: "printer2",
        name: "Принтер 2",
        model: "Creality Ender 3",
        status: "idle",
        color: "blue",
        progress: 0,
        currentPrint: null,
        printName: "",
        totalSeconds: 0,
        startTime: 0,
        savedPercent: 0,
        problem: "нет",
        image: "foto/2.png",
        finishedNotified: false,
        lastUpdate: Date.now()
      }
    };
    localStorage.setItem('printers', JSON.stringify(defaultPrinters));
  }
}

// Получить все принтеры
function getAllPrinters() {
  initPrintersData();
  return JSON.parse(localStorage.getItem('printers'));
}

// Получить конкретный принтер
function getPrinter(id) {
  const printers = getAllPrinters();
  return printers[id] || null;
}

// Обновить принтер
function updatePrinter(id, data) {
  const printers = getAllPrinters();
  if (printers[id]) {
    printers[id] = { ...printers[id], ...data, lastUpdate: Date.now() };
    localStorage.setItem('printers', JSON.stringify(printers));
    return true;
  }
  return false;
}

// Добавить новый принтер
function addPrinter(name, model, image = "foto/default.png") {
  const printers = getAllPrinters();
  const newId = 'printer' + (Object.keys(printers).length + 1);
  
  printers[newId] = {
    id: newId,
    name: name,
    model: model,
    status: "idle",
    color: "gray",
    progress: 0,
    currentPrint: null,
    printName: "",
    totalSeconds: 0,
    startTime: 0,
    savedPercent: 0,
    problem: "нет",
    image: image,
    finishedNotified: false,
    lastUpdate: Date.now()
  };
  
  localStorage.setItem('printers', JSON.stringify(printers));
  return newId;
}

// Удалить принтер
function removePrinter(id) {
  const printers = getAllPrinters();
  if (printers[id]) {
    delete printers[id];
    localStorage.setItem('printers', JSON.stringify(printers));
    return true;
  }
  return false;
}

// Получить текстовое описание статуса
function getStatusText(status) {
  const statusMap = {
    'idle': 'Простаивает',
    'printing': 'Печать',
    'stopped': 'Остановлено',
    'finished': 'Готово',
    'repair': 'На ремонте'
  };
  return statusMap[status] || status;
}

// Получить цвет для статуса
function getStatusColor(status) {
  const colorMap = {
    'idle': '#fff',
    'printing': '#fff',
    'stopped': 'orange',
    'finished': '#4caf50',
    'repair': 'red'
  };
  return colorMap[status] || '#fff';
}

// Получить цвет для прогресс-бара
function getProgressColor(status) {
  const colorMap = {
    'idle': '#444',
    'printing': '#4caf50',
    'stopped': 'orange',
    'finished': '#4caf50',
    'repair': 'red'
  };
  return colorMap[status] || '#444';
}

// Обновить прогресс для печатающих принтеров
function updatePrintingProgress() {
  const printers = getAllPrinters();
  const now = Date.now();
  let updated = false;

  Object.keys(printers).forEach(id => {
    const printer = printers[id];
    
    if (printer.status === 'printing' && printer.totalSeconds > 0) {
      const elapsed = Math.floor((now - printer.startTime) / 1000);
      let percent = Math.min(100, Math.floor((elapsed / printer.totalSeconds) * 100));
      
      if (percent >= 100) {
        printer.status = 'finished';
        printer.progress = 100;
        printer.savedPercent = 100;
        printer.finishedNotified = false;
        updated = true;
      } else {
        printer.progress = percent;
        printer.savedPercent = percent;
      }
    }
    
    // Обновляем в localStorage
    updatePrinter(id, printer);
  });

  return updated;
}

// Получить количество уведомлений (завершенных печатей)
function getNotificationCount() {
  const printers = getAllPrinters();
  let count = 0;
  
  Object.values(printers).forEach(printer => {
    if (printer.status === 'finished' && !printer.finishedNotified) {
      count++;
    }
  });
  
  return count;
}