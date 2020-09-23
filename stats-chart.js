var statsChartOptions = {
    type: 'bar',
    data: null,
    options: {
        legend: {
            position: 'bottom'
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    return data.datasets[tooltipItem.datasetIndex].label + ": " + Math.abs(tooltipItem.yLabel);
                }
            },
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            },
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return Math.abs(value);
                    }
                }
            }]
        }
    }
};


function buildStatsChart(subjectName) {
    updateGeneralStats(subjectName);
    let groupBy = $('#group-by-selector')[0].selectedOptions[0].value;
    let data = generateStatsChartData(subjectName, groupBy);
    statsChartOptions['data'] = data;
    window.myBar.update();
    lastChosenSubjectName = subjectName;
};


function generateStatsChartData(subjectName, groupBy) {
    $('#selected-subject-name')[0].innerText = subjectName;

    var [dates, new_infected_cases, new_healed_cases, new_died_cases] = generateIncrementalData(subjectName);
    var [dates, new_infected_cases, new_healed_cases, new_died_cases] = groupData(dates, new_infected_cases, new_healed_cases, new_died_cases, groupBy);
    
    return {
        labels: dates,
        datasets: [{
            label: 'Количество новых случаев заражения',
            backgroundColor: '#d50000',
            stack: 'Stack 0',
            data: new_infected_cases
        }, {
            label: 'Количество выздоровивших',
            backgroundColor: '#00c853',
            stack: 'Stack 0',
            data: new_healed_cases
        }, {
            label: 'Количество умерших',
            backgroundColor: '#212121',
            stack: 'Stack 0',
            data: new_died_cases
        }]
    };
};

function generateIncrementalData(subjectName) {
    let raw_data = STATS_DATA[subjectName];
    var start_index = 1;
    while (raw_data["infected"][start_index] == 0) { 
        start_index++;
    }

    let dates = [];
    let new_infected_cases = [];
    let new_healed_cases = [];
    let new_died_cases = [];
    for(var i=start_index; i<STATS_DATES.length; i++) {
        new_infected_cases_count = raw_data['infected'][i] - raw_data['infected'][i-1];
        new_healed_cases_count = -(raw_data['healed'][i] - raw_data['healed'][i-1]);
        new_died_cases_count = -(raw_data['died'][i] - raw_data['died'][i-1]);

        dates.push(STATS_DATES[i]);
        new_infected_cases.push(new_infected_cases_count);
        new_healed_cases.push(new_healed_cases_count);
        new_died_cases.push(new_died_cases_count);
    }

    return [dates, new_infected_cases, new_healed_cases, new_died_cases];
};


function groupData(dates, new_infected_cases, new_healed_cases, new_died_cases, groupBy) {
    if (groupBy == 'week') {
        var labels = [];
        var infected_cases = []; 
        var healed_cases = []; 
        var died_cases = []; 

        var left = 0;
        var step = 7;
        while (left < dates.length) {
            var right = Math.min(left + step, dates.length);
            var prefix = '';
            if (right - left > 0) {
                prefix = dates[left] + '-';
            }
            labels.push(prefix + dates[right-1]);
            infected_cases.push(new_infected_cases.slice(left, right).reduce((a, b) => a + b));
            healed_cases.push(new_healed_cases.slice(left, right).reduce((a, b) => a + b));
            died_cases.push(new_died_cases.slice(left, right).reduce((a, b) => a + b));
            
            left = right;
        }
        return [labels, infected_cases, healed_cases, died_cases];
    }
    return [dates, new_infected_cases, new_healed_cases, new_died_cases];
};


function updateStatsDataHandler(obj) {
    let subjectName = $(obj).data('subject-name');
    buildStatsChart(subjectName);
};

function getSubjectIndex(target_subject) {
    target_subject = target_subject.toLowerCase();
    for (let i = 0; i < RF_SUBJECTS.length; i++) {
        if (RF_SUBJECTS[i].toLowerCase() == target_subject) {
            return i;
        }
    }
    return -1;
};

function buildStatsChartHandler() {
    var subjectName = $('#subjects-list')[0].value.trim().toLowerCase();
    var subject_index = getSubjectIndex(subjectName);
    if (subject_index == -1) {
        alert('Введите полное название субъекта');
        return;
    }
    buildStatsChart(RF_SUBJECTS[subject_index]);
    $('#subjects-list')[0].value = '';
};

$(window).load(function() {
    var ctx = document.getElementById('stats-chart').getContext('2d');
    window.myBar = new Chart(ctx, statsChartOptions);
    buildStatsChart('Россия');
});

$('#group-by-selector').on('change', function() {
    buildStatsChart(lastChosenSubjectName);
});
