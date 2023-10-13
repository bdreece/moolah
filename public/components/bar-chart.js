export default class BarChart extends HTMLCanvasElement {
    #observer;
    #chart;

    constructor() {
        super();

        this.#chart = new Chart(this, {
            type: 'bar',
            data: {
                datasets: [],
            },
            options: {
                responsive: false,
                maintainAspectRation: true,
                aspectRatio: 0.75,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Amount',
                        }
                    },
                },
                plugins: {
                    colors: {
                        enabled: true,
                        forceOverride: true,
                    },
                    tooltip: {
                        callbacks: {
                            label: this.#labelCallback,
                        },
                    },
                },
            },
        });

        this.#observer = new MutationObserver(this.#observe.bind(this));
        this.#observer.observe(this, {
            childList: true,
            subtree: true,
        });
    }

    #labelCallback(context) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        let label = context.dataset.label;
        if (label) {
            label += ': ';
        }

        if (context.parsed.y !== null) {
            label += formatter.format(context.parsed.y);
        }
        
        return label;
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

        this.#chart.update();
    }

    /** @param {Node} node */
    #add(node) {
        if (node instanceof HTMLDataElement) {
            const type = node.dataset['type']
            this.#chart.data.datasets.push({
                label: node.textContent,
                data: [{
                    x: type[0].toUpperCase() + type.slice(1), // title case
                    y: Number(node.value),
                    key: node.dataset['key'],
                }],
            });
        }
    }

    /** @param {Node} node */
    #remove(node) {
        if (node instanceof HTMLDataElement) {
            const i = this.#chart.data.datasets.findIndex(({ data }) =>
                data[0].key === node.dataset['key']);

            this.#chart.data.datasets.splice(i, 1);
        }
    }

    /** @param {CustomElementRegistry} registry */
    static register(registry) {
        registry.define('bar-chart', BarChart, { extends: 'canvas' });
    }
}
