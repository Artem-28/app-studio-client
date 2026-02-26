export function hClasses(rootClass) {
    const classes = [rootClass];

    function append(cls) {
        classes.push(cls);

        return this;
    }

    function remove(cls) {
        const idx = classes.findIndex((i) => i === cls);
        if (idx > -1) {
            classes.splice(idx, 1);
        }
        return this;
    }

    function modify() {
        return {
            append: (cls) => append.bind(this)(`${rootClass}--${cls}`),
            remove: (cls) => remove.bind(this)(`${rootClass}--${cls}`),
        };
    }

    return {
        value: () => classes.join(' '),
        modify,
        append,
        remove,
    };
}