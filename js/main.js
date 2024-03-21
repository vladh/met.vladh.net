const DATA_URL_A = 'https://met.vladh.net/dewdrop-data-a.txt';
const DATA_URL_B = 'https://met.vladh.net/dewdrop-data-b.txt';


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
    const promise_a = fetch(DATA_URL_A)
        .then((response) => response.text())
        .then((text) => parse_data(text));
    const promise_b = fetch(DATA_URL_B)
        .then((response) => response.text())
        .then((text) => parse_data(text));
    const [data_a, data_b] = await Promise.all([promise_a, promise_b]);

    ['temp', 'pres', 'hum'].forEach((field) => {
        const plot_params = [
            {
                x: data_a.date,
                y: data_a[field],
                type: 'scatter',
                name: 'Living room',
            },
            {
                x: data_b.date,
                y: data_b[field],
                type: 'scatter',
                name: 'Study',
            },
        ];
        const layout = {
            margin: {
                t: 20,
                r: 20,
                b: 30,
                l: 40,
            },
            height: 300,
        };
        document.getElementById(`plot_${field}`).innerHTML = '';
        Plotly.newPlot(`plot_${field}`, plot_params, layout);

        document.getElementById(`curr_${field}_a`).innerHTML =
            (+data_a[field].at(-1)).toFixed(2)
        document.getElementById(`curr_${field}_b`).innerHTML =
            (+data_b[field].at(-1)).toFixed(2)
    });

    document.querySelectorAll('.loader').forEach((el) => {
        el.hidden = true;
    });
}


main();
