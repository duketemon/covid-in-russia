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

    var threshhold = 0;
    if (groupBy == "week") {
        threshhold = 6;
    }

    let raw_data = STATS_DATA[subjectName];
    let dates = [];
    let new_infected_cases = [];
    let new_healed_cases = [];
    let new_died_cases = [];

    var new_infected_cases_count = 0
    var new_healed_cases_count = 0
    var new_died_cases_count = 0
    var counter = 0

    for(var i=1; i<STATS_DATES.length; i++) {
        if (raw_data["infected"][i] > 0) {
            counter += 1;
            new_infected_cases_count += raw_data["infected"][i] - raw_data["infected"][i-1];
            new_healed_cases_count += -(raw_data["healed"][i] - raw_data["healed"][i-1]);
            new_died_cases_count += -(raw_data["died"][i] - raw_data["died"][i-1]);

            if (counter > threshhold) {
                dates.push(STATS_DATES[i])
                new_infected_cases.push(new_infected_cases_count)
                new_healed_cases.push(new_healed_cases_count)
                new_died_cases.push(new_died_cases_count)
                
                counter = 0;
                new_infected_cases_count = new_healed_cases_count = new_died_cases_count = 0;
            }
        }
    }

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
    buildStatsChart("Россия");
});

$('#group-by-selector').on('change', function() {
    buildStatsChart(lastChosenSubjectName);
});
