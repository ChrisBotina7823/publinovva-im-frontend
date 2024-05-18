const getDriveUrl = (url) => {
    return url ? `https://drive.lienuc.com/uc?id=${url}` : null;
}

const formatCurrency = (amount) => {
    let numeroFormateado = new Intl.NumberFormat('es-ES', { style: 'decimal' }).format(amount);
    numeroFormateado = '$' + numeroFormateado;
    return numeroFormateado;
}

export {
    getDriveUrl,
    formatCurrency
}