const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

function noop () {}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector);
    const preview = element('div', ['preview1'])
    const open = element('button', ['btn-for-add'], 'Добавить')
    const upload = element('button', ['btn-for-add'], 'Загрузить')
    upload.style.display = 'none';

    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);

    const triggerInput = () => input.click();

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }
        
        files = Array.from(event.target.files);
        preview.innerHTML = '';
        upload.style.display = 'inline'

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image1">
                        <div class="preview-remove1" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}"/>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })
    }

    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        } 

        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)

        console.log(files.length)
        if (!files.length) {
            upload.style.display = 'none';
        }
        
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image1')

        block.classList.add('removing1')
        block.remove();
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove1').forEach(e => e.remove())
        onUpload(files);
        document.querySelector('.preview1').innerHTML = ''

    

    }

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}