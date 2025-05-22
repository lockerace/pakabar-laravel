// DonasiForm.jsx
import React from 'react';
import axios from 'axios';

export default function DonasiForm() {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        nominal: '',
        message: '',
        payment_method: ''
    });
    const [isAnonymous, setIsAnonymous] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const presetAmounts = [5000, 10000, 50000, 100000];
    const paymentMethods = [
        { id: 'QRIS', label: 'QRIS', fee: '0.7%', image: '/img/payment/qris.png' },
        { id: 'DANA', label: 'DANA', fee: '1.5%', image: '/img/payment/dana.png' },
        { id: 'GoPay', label: 'GoPay', fee: '2%', image: '/img/payment/gopay.png' },
        { id: 'OVO', label: 'OVO', fee: '2.74%', image: '/img/payment/ovo.png' },
        { id: 'BCA', label: 'Transfer BCA', fee: 'Rp 4.000', image: '/img/payment/bca.png' },
        { id: 'Mandiri', label: 'Transfer Mandiri', fee: 'Rp 4.000', image: '/img/payment/mandiri.png' },
        { id: 'BNI', label: 'Transfer BNI', fee: 'Rp 4.000', image: '/img/payment/bni.png' },
        { id: 'BRI', label: 'Transfer BRI', fee: 'Rp 4.000', image: '/img/payment/bri.png' }
    ];


    React.useEffect(() => {
        // Cek apakah Snap sudah terload
        if (!window.snap) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', 'SB-Mid-client-tXPjLtVrL-iXOhjg'); // Ganti dengan client key Midtrans kamu
            script.async = true;
            document.body.appendChild(script);
        }
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user');
                const user = res.data;
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || ''
                }));
            } catch (err) {
                console.error("Gagal mengambil data user", err);
            }
        };
        fetchUser();
    }, []);

    const getMaskedName = (name) => {
        if (!name || name.length < 2) return '*';
        const first = name[0];
        const last = name[name.length - 1];
        return `${first}***${last}`;
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'nominal') {
            value = Math.max(0, Number(value));
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePresetAmount = (amount) => {
        setFormData({ ...formData, nominal: amount });
    };

    const handlePaymentMethodSelect = (methodId) => {
        setFormData({ ...formData, payment_method: methodId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            name: isAnonymous ? getMaskedName(formData.name) : formData.name,
            anonymous: isAnonymous
        };

        try {
            const res = await axios.post('/api/donasi', payload);
            if (window.snap && res.data.snap_token) {
                window.snap.pay(res.data.snap_token, {
                    onSuccess: (result) => alert("Pembayaran berhasil"),
                    onPending: (result) => alert("Menunggu pembayaran"),
                    onError: (result) => alert("Gagal melakukan pembayaran"),
                });
            } else {
                alert("Midtrans Snap belum tersedia");
            }

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses donasi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-5">
            <h1>Beri Donasi</h1>

            <div className="mb-3">
                <label>Nominal Donasi</label>
                <input
                    type="number"
                    name="nominal"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.nominal}
                    required
                    min="0"
                />
                <div className="d-flex gap-2 mt-2 flex-wrap">
                    {presetAmounts.map((amount) => (
                        <button
                            type="button"
                            key={amount}
                            className="btn btn-outline-primary"
                            onClick={() => handlePresetAmount(amount)}
                        >
                            Rp {amount.toLocaleString('id-ID')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label>Nama</label>
                <input type="text" name="name" className="form-control" value={formData.name} readOnly />
            </div>
            <div className="mb-3">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} readOnly />
            </div>
            <div className="mb-3">
                <label>Pesan</label>
                <textarea name="message" className="form-control" onChange={handleChange} value={formData.message}></textarea>
            </div>

            <div className="mb-3">
                <label>Metode Pembayaran</label>
                <div className="d-flex flex-wrap gap-3">
                    {paymentMethods.map(method => (
                        <div
                            key={method.id}
                            className={`p-2 border rounded text-center cursor-pointer ${formData.payment_method === method.id ? 'border-primary' : ''}`}
                            onClick={() => handlePaymentMethodSelect(method.id)}
                            style={{ width: '150px', cursor: 'pointer' }}
                        >
                            <img
                                src={method.image}
                                alt={method.label}
                                style={{ maxWidth: '100%', height: '40px', objectFit: 'contain' }}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>{method.label}</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{method.fee}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} id="anonCheck" />
                <label className="form-check-label" htmlFor="anonCheck">
                    Kirim sebagai anonim
                </label>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>Kirim Donasi</button>
        </form>
    );
}
