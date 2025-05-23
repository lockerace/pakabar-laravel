
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DonasiForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nominal: '',
        message: '',
        payment_method: 'default',
        anonymous: false,
        order_id: ''
    });

    const [snapLoaded, setSnapLoaded] = useState(false);

    useEffect(() => {
        // Ambil user login dari API
        axios.get('/api/user').then(res => {
            const user = res.data;
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        });

        // Load Snap Midtrans script jika belum ada
        if (!window.snap) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', 'SB-Mid-client-tXPjLtVrL-iXOhjg'); // Ganti dengan key kamu
            script.async = true;
            script.onload = () => setSnapLoaded(true);
            document.body.appendChild(script);
        } else {
            setSnapLoaded(true);
        }
    }, []);

    const presetAmounts = [5000, 10000, 50000, 100000];

    const setPresetAmount = (amount) => {
        setFormData(prev => ({ ...prev, nominal: amount }));
    };


    const getMaskedName = (name) => {
        if (!name || name.length < 2) return '*';
        return name[0] + '***' + name[name.length - 1];
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.anonymous ? getMaskedName(formData.name) : formData.name,
                email: formData.email,
                nominal: parseInt(formData.nominal),
                message: formData.message,
                anonymous: formData.anonymous
            };

            const res = await axios.post('/api/donasi', payload);
            const snapToken = res.data.snap_token;
            const orderId = res.data.order_id;

            setFormData(prev => ({ ...prev, order_id: orderId }));

            if (window.snap && snapToken) {
                window.snap.pay(snapToken, {
                    onSuccess: result => {
                        alert("Pembayaran berhasil!");
                        handleAutoCheckStatus(orderId); // <- Tambahkan ini
                    },
                    onPending: result => {
                        alert("Pembayaran tertunda.");
                        handleAutoCheckStatus(orderId); // <- Tambahkan ini juga
                    },
                    onError: result => {
                        alert("Terjadi kesalahan pembayaran.");
                    },
                });
            } else {
                alert("Midtrans Snap belum tersedia.");
            }
        } catch (err) {
            console.error(err);
            alert("Gagal melakukan donasi.");
        }
    };

    const handleManualCheck = async () => {
        if (!formData.order_id) {
            alert("Order ID tidak tersedia.");
            return;
        }

        try {
            const res = await axios.post('/api/donasi/check-status', {
                order_id: formData.order_id
            });

            const { status, payment_method } = res.data;
            alert(`✅ Status: ${status}\n💳 Metode: ${payment_method}`);
        } catch (err) {
            console.error(err);
            alert("Gagal memeriksa status donasi.");
        }
    };

    const handleAutoCheckStatus = async (orderId) => {
  try {
    const res = await axios.post('/api/donasi/check-status', {
      order_id: orderId
    });

    const { status, payment_method } = res.data;
    alert(`✅ Status diperbarui otomatis\nStatus: ${status}\nMetode: ${payment_method}`);
  } catch (err) {
    console.error("Auto status check gagal:", err);
  }
};


    return (
        <div className="container mt-5">
            <h2>Form Donasi</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nama</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} disabled />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} disabled />
                </div>

                <div className="mb-3">
                    <label>Pilih Nominal Cepat:</label>
                    <div className="d-flex gap-2 flex-wrap">
                        {presetAmounts.map((amt) => (
                            <button
                                type="button"
                                key={amt}
                                className="btn btn-outline-secondary"
                                onClick={() => setPresetAmount(amt)}
                            >
                                Rp{amt.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label>Nominal (Rp)</label>
                    <input type="number" className="form-control" name="nominal" min="1000" value={formData.nominal} onChange={handleChange} required min={1000} />
                </div>
                <div className="mb-3">
                    <label>Pesan</label>
                    <textarea className="form-control" name="message" value={formData.message} onChange={handleChange}></textarea>
                </div>
                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} />
                    <label className="form-check-label">Kirim sebagai anonim</label>
                </div>
                <button type="submit" className="btn btn-primary">Kirim Donasi</button>
                <button type="button" className="btn btn-outline-warning mt-2 ms-2" onClick={handleManualCheck}>
                    🔄 Cek Status Manual
                </button>
            </form>
        </div>
    );
}
