export default class TransactionControls extends HTMLElement {
    #type;
    #list;
    #form;
    #total;
    #target;
    #formatter;

    constructor() {
        super();

        this.#list = this.querySelector('ul');
        this.#form = this.querySelector('form');
        this.#total = this.querySelector('b');
        this.#formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        
        this.#target = document.querySelector('canvas');
        this.#type = this.dataset['type'];
        this.#form.addEventListener('submit', this.#onSubmit.bind(this));
    }

    /** @param {SubmitEvent} e */
    #onSubmit(e) {
        e.preventDefault();
        const form = new FormData(this.#form);

        const data = this.#createDataItem(form);
        this.#createListItem(form, data);
        this.#updateTotal();
    }

    /**
     * @param {FormData} form
     * @param {HTMLDataElement} data
     */
    #createListItem(form, data) {
        const li = this.#list.appendChild(document.createElement('li'));
        li.classList.add('transaction');

        const p = li.appendChild(document.createElement('p'));
        const label = form.get('description');
        const value = form.get('amount');
        p.innerText = `${label}: ${this.#formatter.format(value)}`;

        const del = li.appendChild(document.createElement('button'));
        del.innerText = 'Delete';
        del.addEventListener('click', () => {
            data.remove();
            li.remove();
            this.#updateTotal();
        }, { once: true });
    }

    /** @param {FormData} form */
    #createDataItem(form) {
        const label = form.get('description');
        const value = form.get('amount');
        const data = document.createElement('data');
        data.dataset['key'] = (Math.random() * 999999).toFixed(0);
        data.dataset['type'] = this.#type;
        data.innerText = label;
        data.value = value;
        data.hidden = true;

        return this.#target.appendChild(data);
    }

    #updateTotal() {
        if (this.#target.children.length === 0) {
            this.#total.innerText = '';
            return;
        }

        let total = 0;
        for (const child of this.#target.children) {
            if (child instanceof HTMLDataElement &&
                child.dataset['type'] === this.#type) {
                total += Number(child.value);
            }
        }

        this.#total.textContent = `Total: ${this.#formatter.format(total)}`;
    }

    /** @param {CustomElementRegistry} registry */
    static register(registry) {
        registry.define('transaction-controls', TransactionControls);
    }
}

