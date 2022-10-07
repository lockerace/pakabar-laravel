import './bootstrap';

window.onMemberEdit = (event)=>{    
    var member = {
        email:"",
        name:"",
        no_anggota:"",
        no_ktp:"",
        jabatan_id:"",
        id:"",
    };

    if(event)
        member = JSON.parse(event.dataset.member);
    var email = document.getElementById('memberEmail');
    var name = document.getElementById('memberName');
    var no_anggota = document.getElementById('memberNoAnggota');
    var no_ktp = document.getElementById('memberNoKtp');
    var jabatan_id = document.getElementById('memberJabatan');
    var id = document.getElementById('memberId');

    email.value = member.email;
    name.value = member.name;
    no_anggota.value = member.no_anggota;
    no_ktp.value = member.no_ktp;
    jabatan_id.value = member.jabatan_id;
    id.value = member.id;
}

window.onJabatanEdit = (event)=>{    
    var jabatan = {
        name:"",
        id:"",
    };

    if(event)
        jabatan = JSON.parse(event.dataset.jabatan);
    var name = document.getElementById('jabatanName');
    var id = document.getElementById('jabatanId');

    name.value = jabatan.name;
    id.value = jabatan.id;
}

window.onNewsEdit = (event)=>{    
    var news = {
        judul:"",
        konten:"",
        id:"",
    };

    if(event)
        news = JSON.parse(event.dataset.news);
    var judul = document.getElementById('newsJudul');
    var konten = document.getElementById('newsKonten');
    var id = document.getElementById('newsId');

    judul.value = news.judul;
    konten.value = news.konten;
    id.value = news.id;
}