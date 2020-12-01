export default function getType (o) {
    const t = typeof(o);
    if(t !== 'object' || o === null) return t;
    return o.constructor.name;
}
