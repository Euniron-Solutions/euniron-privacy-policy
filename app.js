/**
 * Euniron Privacy Policy - PDF Viewer
 * Pure vanilla JS, no frameworks
 */

(function () {
  'use strict';

  // =========================================
  // Configuration
  // =========================================
  var PDF_URL = 'data-use-policy.pdf';
  var SCALE_STEP = 0.25;
  var MIN_SCALE = 0.5;
  var MAX_SCALE = 3.0;

  // =========================================
  // State
  // =========================================
  var pdfDoc = null;
  var currentPage = 1;
  var currentScale = 1.5;
  var baseScale = 1.5;
  var userZoom = 0; // tracks manual zoom steps from fit-to-width
  var rendering = false;
  var renderQueued = false;

  // =========================================
  // DOM Elements
  // =========================================
  var canvas = document.getElementById('pdfCanvas');
  var ctx = canvas.getContext('2d');
  var pageNumEl = document.getElementById('pageNum');
  var pageCountEl = document.getElementById('pageCount');
  var zoomLevelEl = document.getElementById('zoomLevel');
  var prevBtn = document.getElementById('prevPage');
  var nextBtn = document.getElementById('nextPage');
  var zoomInBtn = document.getElementById('zoomIn');
  var zoomOutBtn = document.getElementById('zoomOut');
  var loadingEl = document.getElementById('loading');
  var canvasWrapper = document.getElementById('canvasWrapper');
  var errorState = document.getElementById('errorState');

  // =========================================
  // Fit-to-width scale calculation
  // =========================================
  function calcFitScale(page) {
    // Get available width inside the canvas wrapper (minus padding)
    var wrapperStyle = window.getComputedStyle(canvasWrapper);
    var paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;
    var paddingRight = parseFloat(wrapperStyle.paddingRight) || 0;
    var availableWidth = canvasWrapper.clientWidth - paddingLeft - paddingRight;

    // Get the page's natural width at scale 1.0
    var defaultViewport = page.getViewport({ scale: 1.0 });
    var fitScale = availableWidth / defaultViewport.width;

    return fitScale;
  }

  // =========================================
  // PDF Rendering
  // =========================================
  function renderPage(num) {
    if (rendering) {
      renderQueued = true;
      return;
    }
    rendering = true;

    pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({ scale: currentScale });

      // Handle high-DPI displays
      var dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      page.render(renderContext).promise.then(function () {
        rendering = false;
        updateUI();

        // If a render was queued while we were busy, do it now
        if (renderQueued) {
          renderQueued = false;
          renderPage(currentPage);
        }
      });
    });
  }

  function updateUI() {
    pageNumEl.textContent = currentPage;
    pageCountEl.textContent = pdfDoc.numPages;

    // Show zoom relative to fit-width (so fit = 100%)
    var displayPercent = Math.round((currentScale / baseScale) * 100);
    zoomLevelEl.textContent = displayPercent + '%';

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pdfDoc.numPages;
    zoomInBtn.disabled = currentScale >= MAX_SCALE;
    zoomOutBtn.disabled = currentScale <= MIN_SCALE;
  }

  function showLoading() {
    loadingEl.style.display = 'flex';
    canvasWrapper.style.display = 'none';
    errorState.style.display = 'none';
  }

  function showViewer() {
    loadingEl.style.display = 'none';
    canvasWrapper.style.display = 'flex';
    errorState.style.display = 'none';
  }

  function showError() {
    loadingEl.style.display = 'none';
    canvasWrapper.style.display = 'none';
    errorState.style.display = 'flex';
  }

  // =========================================
  // Event Handlers
  // =========================================
  prevBtn.addEventListener('click', function () {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
  });

  nextBtn.addEventListener('click', function () {
    if (!pdfDoc || currentPage >= pdfDoc.numPages) return;
    currentPage++;
    renderPage(currentPage);
  });

  zoomInBtn.addEventListener('click', function () {
    if (currentScale >= MAX_SCALE) return;
    userZoom++;
    currentScale = Math.min(MAX_SCALE, baseScale + (userZoom * SCALE_STEP));
    renderPage(currentPage);
  });

  zoomOutBtn.addEventListener('click', function () {
    if (currentScale <= MIN_SCALE) return;
    userZoom--;
    currentScale = Math.max(MIN_SCALE, baseScale + (userZoom * SCALE_STEP));
    renderPage(currentPage);
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevBtn.click();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextBtn.click();
        break;
      case '+':
      case '=':
        e.preventDefault();
        zoomInBtn.click();
        break;
      case '-':
        e.preventDefault();
        zoomOutBtn.click();
        break;
    }
  });

  // Recalculate fit-to-width on window resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!pdfDoc) return;
      pdfDoc.getPage(currentPage).then(function (page) {
        baseScale = calcFitScale(page);
        currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, baseScale + (userZoom * SCALE_STEP)));
        renderPage(currentPage);
      });
    }, 200);
  });

  // =========================================
  // Initialize
  // =========================================
  showLoading();

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  pdfjsLib
    .getDocument(PDF_URL)
    .promise.then(function (pdf) {
      pdfDoc = pdf;
      showViewer();

      // Calculate fit-to-width scale from page 1
      pdf.getPage(1).then(function (page) {
        baseScale = calcFitScale(page);
        currentScale = baseScale;
        renderPage(currentPage);
      });
    })
    .catch(function (err) {
      console.error('PDF load error:', err);
      showError();
    });
})();
