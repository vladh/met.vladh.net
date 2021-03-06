const DATA_URL = 'https://met.vladh.net/dewdrop-data.txt';


function parse_data(text) {
    let data = {};
    const rows = text.split("\n");
    rows.forEach((row) => {
        if (row.length == 0) {
            return;
        }
        const fields = row.split(' ');
        fields.forEach((field) => {
            const [key, value] = field.split('=');
            if (!(key in data)) {
                data[key] = [];
            }
            data[key].push(value);
        });
    });
    return data;
}


async function main() {
    const data = await fetch(DATA_URL)
        .then((response) => response.text())
        .then((text) => parse_data(text));

    ['temp', 'pres', 'hum'].forEach((field) => {
        const plot_params = [{
            x: data.date,
            y: data[field],
            type: 'scatter',
        }];
        Plotly.newPlot(`plot_${field}`, plot_params);

        const latest_val = (+data[field].at(-1)).toFixed(2);
        document.getElementById(`curr_${field}`).innerHTML = latest_val;
    });

    document.getElementById('loader').style.display = 'none';
}


main();
