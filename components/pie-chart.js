export default class PieChart extends HTMLCanvasElement {
    #chart;
    #observer;

    constructor() {
        super();

        this.#chart = new Chart(this, {
            type: 'doughnut',
            data: {
                datasets: [{ data: [] }],
            },
            options: {
                responsive: false,
                parsing: {
                    key: 'value',
                },
                plugins: {
                    colors: {
                        enabled: true,
                        forceOverride: true,
                    }
                }
            },
        });

        this.#observer = new MutationObserver(this.#observe.bind(this));
        this.#observer.observe(this, {
            childList: true,
            subtree: true,
        });
    }

    debug() {
        console.dir(this.#chart);
    }

    /** @param {MutationRecord[]} changes */
    #observe(changes, _) {
        for (const c of changes) {
            for (const n of c.addedNodes) {
                this.#add(n);
            }

            for (const n of c.removedNodes) {
                this.#remove(n);
            }
        }
    }

    /** @param {Node} node */
    #add(node) {
        if (node instanceof HTMLDataElement) {
            const key = node.dataset['key'];
            this.#chart.data.labels.push(node.textContent);
            this.#chart.data.datasets[0].data.push({
                key,
                value: Number(node.value)
            });

            this.#chart.update();
        }
    }

    /** @param {Node} node */
    #remove(node) {
        if (node instanceof HTMLDataElement) {
            const i = this.#chart.data.datasets[0].data
                .findIndex(({ key }) => key === node.dataset['key']);

            this.#chart.data.labels.splice(i, 1);
            this.#chart.data.datasets[0].data.splice(i, 1);
            this.#chart.update();
        }
    }
}

customElements.define('pie-chart', PieChart, { extends: 'canvas' });
