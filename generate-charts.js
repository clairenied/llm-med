const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'chart-images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

async function render(filename, width, height, config) {
  const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });
  const buf = await canvas.renderToBuffer(config);
  fs.writeFileSync(path.join(outDir, filename), buf);
  console.log(`  wrote ${filename}`);
}

const timeData = [
  {date:'Feb 1',count:2},{date:'Feb 2',count:2},{date:'Feb 4',count:6},
  {date:'Feb 5',count:3},{date:'Feb 7',count:4},{date:'Feb 11',count:15},
  {date:'Feb 13',count:1},{date:'Feb 15',count:22},{date:'Feb 16',count:13},
  {date:'Feb 17',count:23},{date:'Feb 18',count:43},{date:'Feb 19',count:14},
  {date:'Feb 20',count:11},{date:'Feb 22',count:6},{date:'Feb 23',count:19},
  {date:'Feb 24',count:1},{date:'Feb 25',count:19},{date:'Feb 26',count:11},
  {date:'Feb 27',count:9},{date:'Mar 1',count:10},{date:'Mar 2',count:46},
  {date:'Mar 3',count:10},{date:'Mar 4',count:10},{date:'Mar 5',count:10},
  {date:'Mar 6',count:10},{date:'Mar 8',count:14},{date:'Mar 9',count:38},
  {date:'Mar 10',count:16},{date:'Mar 11',count:10},{date:'Mar 12',count:19},
  {date:'Mar 13',count:10},{date:'Mar 15',count:10},{date:'Mar 16',count:43},
  {date:'Mar 18',count:3},{date:'Mar 24',count:2},{date:'Mar 26',count:15},
  {date:'Mar 27',count:78}
];

const graders = [
  {name:'Craig Niederberger',count:260},{name:'Jonathan Berger',count:93},
  {name:'Roger Sur',count:85},{name:'Ajay Nangia',count:33},
  {name:'Gail Prins',count:27},{name:'Mike Hsieh',count:20},
  {name:'Kaitlan Cobb',count:16},{name:'Marty Kathrins',count:10},
  {name:'Omer Acar',count:10},{name:'Kristin Brogaard',count:9},
  {name:'Dan Moreira',count:6},{name:'Peter Schlegel',count:5},
  {name:'Mahmoud Mima',count:4}
];

const catLabels = ['Clinical Relevance','Methodology','Results','Writing Clarity','Ethical Considerations'];
const gradeOrder = ['VERY_GOOD','GOOD','POOR','VERY_POOR','NA'];
const gradeLabels = ['Very Good','Good','Poor','Very Poor','N/A'];
const gradeColors = ['#22c55e','#84cc16','#f97316','#ef4444','#94a3b8'];

const catData = {
  clinicalRelevance: {VERY_GOOD:183,GOOD:220,POOR:82,VERY_POOR:27,NA:66},
  methodology: {VERY_GOOD:209,GOOD:172,POOR:87,VERY_POOR:27,NA:83},
  results: {VERY_GOOD:183,GOOD:182,POOR:101,VERY_POOR:32,NA:80},
  writingClarity: {VERY_GOOD:131,GOOD:166,POOR:58,VERY_POOR:38,NA:185},
  ethicalConsiderations: {VERY_GOOD:44,GOOD:26,POOR:36,VERY_POOR:54,NA:418}
};

const overallGrades = {VERY_GOOD:750,GOOD:766,POOR:364,VERY_POOR:178,NA:832};

const palette = [
  '#2563eb','#7c3aed','#059669','#d97706','#dc2626',
  '#0891b2','#c026d3','#65a30d','#ea580c','#4f46e5',
  '#0d9488','#e11d48','#ca8a04'
];

async function main() {
  console.log('Generating charts...');

  // 1. Grades over time (bar)
  await render('1-grades-time.png', 900, 320, {
    type: 'bar',
    data: {
      labels: timeData.map(d => d.date),
      datasets: [{ label: 'Grades submitted', data: timeData.map(d => d.count), backgroundColor: '#2563eb', borderRadius: 3 }]
    },
    options: {
      plugins: { legend: { display: false }, title: { display: true, text: 'Grades Submitted Over Time', font: { size: 16 } } },
      scales: { x: { ticks: { maxRotation: 50, font: { size: 10 } } }, y: { beginAtZero: true, title: { display: true, text: 'Grades' } } }
    }
  });

  // 2. Cumulative
  let cumulative = [], running = 0;
  timeData.forEach(d => { running += d.count; cumulative.push(running); });

  await render('2-cumulative.png', 900, 320, {
    type: 'line',
    data: {
      labels: timeData.map(d => d.date),
      datasets: [{ label: 'Cumulative', data: cumulative, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.3, pointRadius: 3 }]
    },
    options: {
      plugins: { legend: { display: false }, title: { display: true, text: 'Cumulative Grades Over Time', font: { size: 16 } } },
      scales: { x: { ticks: { maxRotation: 50, font: { size: 10 } } }, y: { beginAtZero: true, title: { display: true, text: 'Total Grades' } } }
    }
  });

  // 3. Grader pie
  await render('3-grader-pie.png', 500, 400, {
    type: 'pie',
    data: { labels: graders.map(g => g.name), datasets: [{ data: graders.map(g => g.count), backgroundColor: palette }] },
    options: {
      plugins: {
        title: { display: true, text: 'Grades by Grader', font: { size: 16 } },
        legend: { position: 'right', labels: { font: { size: 11 }, padding: 8 } }
      }
    }
  });

  // 4. Overall grade pie
  await render('4-grade-pie.png', 500, 400, {
    type: 'pie',
    data: { labels: gradeLabels, datasets: [{ data: gradeOrder.map(g => overallGrades[g]), backgroundColor: gradeColors }] },
    options: {
      plugins: {
        title: { display: true, text: 'Overall Grade Distribution', font: { size: 16 } },
        legend: { position: 'right', labels: { font: { size: 12 }, padding: 10 } }
      }
    }
  });

  // 5. Category stacked bar
  const categories = ['clinicalRelevance','methodology','results','writingClarity','ethicalConsiderations'];
  await render('5-category-bar.png', 900, 350, {
    type: 'bar',
    data: {
      labels: catLabels,
      datasets: gradeOrder.map((g, i) => ({ label: gradeLabels[i], data: categories.map(c => catData[c][g] || 0), backgroundColor: gradeColors[i] }))
    },
    options: {
      plugins: { title: { display: true, text: 'Grade Distribution by Category', font: { size: 16 } }, legend: { position: 'top' } },
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Count' } } }
    }
  });

  // 6. Doughnut excl NA
  await render('6-grade-no-na.png', 500, 400, {
    type: 'doughnut',
    data: { labels: ['Very Good','Good','Poor','Very Poor'], datasets: [{ data: [750,766,364,178], backgroundColor: ['#22c55e','#84cc16','#f97316','#ef4444'] }] },
    options: {
      plugins: {
        title: { display: true, text: 'Grade Distribution (Excluding N/A)', font: { size: 16 } },
        legend: { position: 'right', labels: { font: { size: 12 }, padding: 10 } }
      }
    }
  });

  // 7. Grader horizontal bar
  await render('7-grader-bar.png', 500, 400, {
    type: 'bar',
    data: { labels: graders.map(g => g.name), datasets: [{ label: 'Grades', data: graders.map(g => g.count), backgroundColor: palette }] },
    options: {
      indexAxis: 'y',
      plugins: { title: { display: true, text: 'Grades per Grader', font: { size: 16 } }, legend: { display: false } },
      scales: { x: { beginAtZero: true, title: { display: true, text: 'Grades Submitted' } }, y: { ticks: { font: { size: 10 } } } }
    }
  });

  // Build HTML
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Human Review Grading Charts</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #333; width: 900px; margin: 0 auto; padding: 30px 0; }
  h1 { text-align: center; margin-bottom: 4px; font-size: 1.6rem; }
  .subtitle { text-align: center; color: #666; margin-bottom: 20px; font-size: 0.9rem; }
  .stats { display: flex; gap: 20px; justify-content: center; margin-bottom: 24px; }
  .stat { border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px 30px; text-align: center; }
  .stat .num { font-size: 1.8rem; font-weight: 700; color: #2563eb; }
  .stat .label { font-size: 0.85rem; color: #666; }
  .chart-img { display: block; margin: 0 auto 20px; }
  .row { display: flex; gap: 0; justify-content: center; margin-bottom: 20px; }
  .row img { flex-shrink: 0; }
  .page-break { page-break-before: always; padding-top: 10px; }
</style></head><body>
<h1>Human Review Grading Analysis</h1>
<p class="subtitle">Stage 1 grading data (excludes AI-generated reviews) — Feb 1 to Mar 27, 2026</p>
<div class="stats">
  <div class="stat"><div class="num">578</div><div class="label">Total Grades</div></div>
  <div class="stat"><div class="num">13</div><div class="label">Graders</div></div>
  <div class="stat"><div class="num">37</div><div class="label">Active Days</div></div>
</div>
<img class="chart-img" src="chart-images/1-grades-time.png" width="880">
<img class="chart-img" src="chart-images/2-cumulative.png" width="880">
<div class="row">
  <img src="chart-images/3-grader-pie.png" width="440">
  <img src="chart-images/4-grade-pie.png" width="440">
</div>
<div class="page-break"></div>
<img class="chart-img" src="chart-images/5-category-bar.png" width="880">
<div class="row">
  <img src="chart-images/6-grade-no-na.png" width="440">
  <img src="chart-images/7-grader-bar.png" width="440">
</div>
</body></html>`;

  fs.writeFileSync(path.join(__dirname, 'grading-charts.html'), html);
  console.log('Done! Wrote grading-charts.html');
}

main().catch(console.error);
