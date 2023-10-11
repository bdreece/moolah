export default class TransactionForm extends HTMLElement {
    #target;
    #list;
    #form;
    #total;

    constructor() {
        super();

        this.#list = this.querySelector('ul');
        this.#form = this.querySelector('form');
        this.#total = this.querySelector('b');

        this.#target = document.querySelector(this.dataset['target']);
        this.#form.addEventListener('submit', this.#onSubmit.bind(this));
    }

    /** @param {SubmitEvent} e */
    #onSubmit(e) {
        e.preventDefault();

        const form = new FormData(this.#form);
        const label = form.get('description');
        const value = form.get('amount');

        const data = document.createElement('data');
        data.dataset['key'] = (Math.random() * 999999).toFixed(0);
        data.innerText = label;
        data.value = value;
        data.hidden = true;
        // trigger mutation observer
        this.#target.appendChild(data);

        let total = 0;
        for (const child of this.#target.children) {
            if (child instanceof HTMLDataElement) {
                total += Number(child.value);
            }
        }

        this.#total.textContent = `Total: \$${total.toFixed(2)}`;

        const li = this.#list.appendChild(document.createElement('li'));
        li.classList.add('transaction');
        const p = li.appendChild(document.createElement('p'));
        p.innerText = `${label}: \$${Number(value).toFixed(2)}`;

        const del = li.appendChild(document.createElement('button'));
        del.innerText = 'Delete';
        del.addEventListener('click', () => {
            data.remove();
            li.remove();
            if (this.#target.children.length === 0) {
                this.#total.innerText = '';
                return;
            }

            let total = 0;
            for (const child of this.#target.children) {
                if (child instanceof HTMLDataElement) {
                    total += Number(child.value);
                }
            }

            this.#total.textContent = `Total: \$${total.toFixed(2)}`;
        }, { once: true });

    }
}

customElements.define('transaction-form', TransactionForm);
